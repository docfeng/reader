var Shelf = {
		get: function(id) {
			return Git.Comment.get("docfeng", "book-data", id).then(function(text) {
				var json = JSON.parse(text);
				prompt(json.id)
				alert(json.body)
				return text
			});
		},
		
		put: function(json) {
			if (!json.id) {
				var text = JSON.stringify(json, null, 4);
				var sort=json.sort||1;
				return Git.Comment.create("docfeng", "book-data", sort, text).then(function(text1) {
					var json1 = JSON.parse(text1)
					json.id = json1.id;
					Shelf.write(json);
					//return Git.Comment.put("docfeng", "book-data", json.id, JSON.stringify(json, null, 4));
				});
			} else {
				return Git.Comment.put("docfeng", "book-data", json.id, JSON.stringify(json, null, 4));
			}
		},
		
		samePart: function() {
			//未完成
			var d = new Date("2019-07-23T17:23:10");
			Git.Comment.getSince("docfeng", "book-data", 1, d).then(function(re) {
				var json = JSON.parse(re);
				for (var i = 0; i < json.length; i++) {
					alert(new Date(json[i].updated_at))
				}
			}).catch(function(e) {
				alert(e)
			});
		},
		sameAll: function(sort) {
			var sort=sort||1;
			var t = this;
			return Git.Comment.gets("docfeng", "book-data", sort).then(function(text) {
				var arr1 = JSON.parse(text);
				return t.readAll().then(function(arr2) {
					return t.compare(arr1,arr2);
				});
					/* var p = [];
					var addGit = function(json) {
						var text = JSON.stringify(json, null, 4)
						return Git.Comment.create("docfeng", "book-data", 1, text).then(function(text1) {
							var arr1 = JSON.parse(text1);
							json.id = arr1.id;
							t.write(json);
							return Git.Comment.put("docfeng", "book-data", json.id, JSON.stringify(json, null, 4)).then(function(text) {
								return json.name
							});
						});
					}
					for (var i2 = 0; i2 < arr2.length; i2++) {
						if (!arr2[i2].id) {
							p.push(addGit(arr2[i2]));
						}
					}
					Book.arr=re;
					return Promise.all(p); */
			});
		},
		compare:function(arr1,arr2){
			var j = [];
			for (var i1 = 0; i1 < arr1.length; i1++) {
				var json1 = JSON.parse(arr1[i1].body);
				if (json1.name&&!json1.id) {
					json1.id = arr1[i1].id;
					this.put(json1)
				}
				var b = false;
				for (var i2 = 0; i2 < arr2.length; i2++) {
					var json2= arr2[i2];
					if (json1.name == json2.name) {
						b = true;
						if ((json1.readAt > json2.readAt) || !json2.id) {
							// 网络更新时间>本地更新时间，或者本地没有id，用网络的版本（替换）
							j.push(json1);
							arr2[i2] = json1;
						}
					}
				}
				// 如果本地沒有查到name，用网络的版本（添加）
				if (!b) {
					j.push(json1);
				}
			}
			//写入改变项
			if (j.length > 0) {
				return this.writeAll(j).then(function(foo1){
					return Shelf.readAll().then(function(arr){
						Book.arr=arr;
						return arr;
					});
				});
			}else{
				return Promise.resolve(true);
			}
		},
		sameSince:function(){
			var t = this;
			if(!Book.arr[0]){
				return this.sameAll();
			}
			var time=Book.arr[0].readAt;
			console.log(time,Book.arr[0].name)
			
			time=new Date(time);
			var s=time.getTime();
			s+=1000*10;
			time.setTime(s)
			return Git.Comment.getSince("docfeng", "book-data", 1,time).then(function(text) {
				if(text){
					var arr1 = JSON.parse(text);
					var arr2=Book.arr;
					return t.compare(arr1,arr2);
				}
			});
		},
		
		_readAll: function() {
			if(!DB){
				alert()
				var re=localStorage.getItem("shelf");
				if(!re)re="[]"
				var json=JSON.parse(re)
				Book.arr=json;
				return Promise.resolve(json);
			}
			var t = this;
			return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
				DB.DB.close();
				var json = json.reverse();
				Book.arr=json;
				return json;
			}).catch(function(e) {
				DB.DB.close();
				alert("Book.Shelf.readAll:\n" + e)
				return Promise.reject(e);
			});
		},
		readAll:function() {
			if(Book.arr){
				return Promise.resolve(Book.arr);
			}else{
				return this._readAll().then(function(arr){
					Book.arr=arr;
					return arr;
				});
			}
		},
		read: function(name) {
			if(!DB){
				var re=localStorage.getItem("shelf");
				if(!re)re="[]"
				var json=JSON.parse(re)
				Book.arr=json;
				return Promise.resolve(json);
			}
			var t = this;
			return DB.Data.getKey("book", "shelf", name).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				alert("Book.Shelf.read:\n" + e)
				return Promise.reject(e);
			});
		},
		writeAll: function(json) {
			if(!DB){
				var re=localStorage.setItem("shelf",JSON.stringify(json));
				return Promise.resolve(re);
			}
			var t = this;
			return DB.Table.select("book", "shelf").catch(function(e) {
				DB.DB.close();
				return t.ini();
			}).then(function() {
				var re = [];
				for (var i = 0; i < json.length; i++) {
					var obj = json[i];
					re.push(DB.Data.put("book", "shelf", obj));
				}
				return Promise.all(re);
			}).then(function(re) {
				return true;
			});
		},
		write: function(json) {
			if(!DB){
				
				return Promise.resolve(true);
			}
			var t = this;
			return DB.Data.put("book", "shelf", json).then(function(json) {
				DB.DB.close();
				return true;
			}).catch(function(e) {
				DB.DB.close();
				return t.ini().then(function() {
					return DB.Data.put("book", "shelf", json).then(function(json) {
						DB.DB.close();
						return true;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List" + e)
						return false
					});
				});
			});
		},
		getId: function() {
			return Git.Comment.create("docfeng", "book-data", 1, "test").then(function(text) {
				var json = JSON.parse(text)
				var id = json.id;
				return id;
			});
		},
		
		add: function(json) {
			var t = this;
			if (!json.id) {
				return Git.Comment.gets("docfeng", "book-data", 1).then(function(text) {
					var json1 = JSON.parse(text);
					var b = false;
					for (var i1 = 0; i1 < json1.length; i1++) {
						var json3 = JSON.parse(json1[i1].body);
						if (json3.name == json.name) {
							b = true;
							json.id = json1[i1].id;
							//t.put(json);
							t.write(json);
						}

					}
					if (!b) {
						return Git.Comment.create("docfeng", "book-data", 1, JSON.stringify(json, null, 4)).then(function(text1) {
							var json1 = JSON.parse(text1)
							json.id = json1.id;
							Shelf.write(json);
							return Git.Comment.put("docfeng", "book-data", json.id, JSON.stringify(json, null, 4));
						});
					}
					return true;
				}).catch(function(e){
					json.id="";
					Shelf.write(json);
					return true;
				})
			} else {
				t.write(json);
				return Git.Comment.put("docfeng", "book-data", json.id, JSON.stringify(json, null, 4));
			}
		},
		readAt:function(name,title,url,index){
			//保存记录
			if(!Book.json||Book.json.name!=name){
				var t=this;
				alert(name)
				var p=Shelf.read(name);
			}else{
				var p=Promise.resolve(Book.json)
			}
			return p.then(function(json){
				json.readTitle = title;
				json.readURL = url;
				json.readIndex = index;
				json.readAt = formatDate(new Date());
				return Shelf.add(json);
			});
		},
		_delete: function(json) {
			var id=json.id;
			if(id){
				Git.Comment.del("docfeng", "book-data", id).then(function(re) {
					console.log("shelf:del",re)
				});
			}
			var key=json.name;
			if(key){
				return DB.Data.delete("book", "shelf", key).then(function(json) {
					DB.DB.close();
					return json;
				}).catch(function(e) {
					DB.DB.close();
					return Promise.reject(e);
				});
			}
		},
		move:function(json){
			Shelf.delete(json);
			delete json.id;
			Shelf.put(json)
		},
		createShelfTable: function() {
			var data = {
				key: "name",
				index: {
					name: true,
					url: false,
					id: false,
					state: false,
					updated_at: false,
					created_at: false,
					changed_at: false,
					creatAt: false,
					readIndex: false,
					readTitle: false,
					readAt: false,
					readURL: false,
					updateIndex: false,
					updateTitle: false,
					updateAt: false,
					updateURL: false
				}
			};
			return DB.Table.create("book", "shelf", data);
		},
		createListTable: function() {
			var data = {
				key: "name",
				index: {
					name: true,
					arr: false
				}
			};
			return DB.Table.create("book", "list", data);
		},
		createPageTable: function() {
			var data = {
				key: "full_name",
				index: {
					full_name: true,
					name: false,
					title: false,
					txt: false,
					url: false,
					name: false,
					updated_at: false,
				}
			};
			return DB.Table.create("book", "page", data);
		},
		ini: function() {
			var t=this;
			if(DB){
				return DB.Table.has("book", "shelf").then(function(bool){
					if(!bool){
						fj.tip("开始创建表格");
						return t.createShelfTable().then(function(foo1){
							fj.tip("创建List表格");
							return t.createListTable();
						}).then(function(foo1){
							fj.tip("创建Page表格");
							return t.createPageTable()
						}).then(function(foo1){
							alert("创建表格完成")
							return true;
						});
					}
					return true;
				}).catch(function(e){
					fj.tip("创建表格失败\n"+e);
				});
			}else{
				return Promise.resolve(false)
			}
		},
		moveData: function() {
			var t = this;
			var arr1, arr2;
			var re = [];
			return DB.Table.has("book", "shelf").catch(function(e) {
				alert(e)
				return t.ini();
			}).then(function() {
				return Git.File.get("docfeng", "page", "novel/data/Shelf.json").then(function(text) {
					var p = [];
					arr1 = JSON.parse(text);
					return t.readAll();
				}).then(function(arr) {
					arr2 = arr;
				}).then(function() {
					var err = []
					for (var i = 0; i < arr1.length; i++) {
						for (var i2 = 0; i2 < arr2.length; i2++) {
							if (arr1[i] && arr1[i].name) {
								if (arr2[i2] && arr2[i2].name) {
									if (arr1[i].name == arr2[i2].name) {
										if (new Date(arr1[i].updateAt) > new Date(arr2[i2].updateAt)) {
											re.push(arr1[i]);
										} else {
											re.push(arr2[i2]);
										}
										arr1.splice(i, 1);
										arr2.splice(i2, 1);
										i--;
										i2--;
									}
								} else {
									err.push(["i2", i2])
								}
							} else {
								err.push(["i", i])
							}
						}
					}
					re = re.concat(arr1, arr2)
					t.writeAll(re).then(function(e) {
						alert(e)
					}).catch(function(e) {
						alert(e)
					});;
				});
			}).then(function() {
				alert(true)
			}).catch(function(e) {
				alert(e)
			});
		},
		updateAt: function(name, url, listArr) {
			var t = this;
			var json = {};
			var arr=Book.arr
			if(!name||!url||!arr||arr.length==0){
				alert("Shelf.add参数错误：\nname:"+name+"\ni:"+url+"\narr:"+arr)
				return Promise.reject("Shelf.add参数错误：\nname:"+name+"\ni:"+url+"\narr:"+arr);
			}
			var num = -1;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].name == name) {
					num = i;
				}
			}
			if (num == -1) {
				json = {
					name: name,
					creatAt: formatDate(new Date()),
					readIndex: 0,
					readTitle: listArr[0][1],
					readAt: formatDate(new Date()),
					readURL: listArr[0][0]
				}
			} else {
				json = arr.splice(num, 1)[0]; //arr[num];
			}	
			json.url = url;
			json.updateIndex = listArr.length - 1,
			json.updateTitle = listArr[listArr.length - 1][1],
			json.updateAt = formatDate(new Date()),
			json.updateURL = listArr[listArr.length - 1][0];
				//this.show({index:num})
			//console.log(arr[arr.length - 1])
			arr.unshift(json);
			
			return this.add(json);
		},
		delete: function(i) {
			var json = Book.arr[i];
			var name=json.name;
			if (confirm("是否删除:" + i + name)) {
				this._delete(json).then(function(){
					Book.arr.splice(i,1);
					var obj=shelf_table.rows[i];
					obj.parentNode.removeChild(obj)
				});
			}
		},
		clear: function() {
			DB.Table.delete("book", "shelf").then(function(json) {
				alert(json)
				alert(JSON.stringify(json))
				DB.DB.close();
				return true;
			}).catch(function(e) {
				alert(e)
				DB.DB.close();
			});
		},
		formatUI:function(json) {
			var span1="";
			var span2="";
			if(new Date(json.readAt)<new Date(json.updateAt)){
				span2="<span class='update'>更新:</span>";
			}
			if(json.readIndex<json.updateIndex){
				span1="<span class='alert'>未读:</span>";
			}
			var d ="<h1><input type='checkbox' />%s<span style='float:right'>...</span></h1>\
			    <h2>已读:%s</h2>\
			    <h3>%s</h3>\
			    <h4>%s%s%s</h4>\
			    <h3>%s</h3>\
			    <h6>%s</h6>".fill([json.name,
				json.readTitle,
				json.readAt,
				span1,
				span2,
				json.updateTitle,
				json.updateAt,
				json.url]);
			var str="<tr><td>" + d + "</td></tr>";
			return str;	
		},
		show:function(i) {
			return this.readAll().then(function(arr){
				var json=arr[i];
				arr.splice(i,1);
				arr.unshift(json);
				var str =Shelf.formatUI(json);
				//alert(str)
				//var str=shelf_table.rows[i].innerHTML
				for(;i>0;i--){
					shelf_table.rows[i].innerHTML=shelf_table.rows[i-1].innerHTML
				}
				shelf_table.rows[0].innerHTML = str;
			});
		},
		showAll:function() {
			return this.readAll().then(function(arr){
				Book.arr=arr;
				var str="";
				for (var i=0;i<arr.length;i++) {
					str+=Shelf.formatUI(arr[i],i)
				}
				if (shelf_table) {
					shelf_table.innerHTML = str;
				}
			}).catch(function(e){
				alert("Shelf.showAll:\n"+e)
			});
		},
		checkChange:function(){
			var arr1,arr2;
			var t=this;
			this.getAll().then(function(arr){
				arr1=arr;
				return t.readAll();
			}).then(function(arr){
				arr2=arr;
				for (var i = 0; i < arr1.length; i++) {
					for (var i = 0; i < arr1.length; i++) {
						
					}
				}
			});
		},
		moveData:function() {
			var t=this;
			var arr1,arr2;
			var re=[];
			DB.Table.has("book","shelf").catch(function(e){
				alert(e)
				return t.ini();
			}).then(function(){
				return Git.File.get("docfeng","page", "novel/data/Shelf.json").then(function(text){
					var p=[];
					arr1 = JSON.parse(text);
					return t.readAll();
				}).then(function(arr){
					arr2=arr;
				}).then(function(){
					var err=[]
					for(var i=0;i<arr1.length;i++){
						for(var i2=0;i2<arr2.length;i2++){
							if(arr1[i]&&arr1[i].name){
								if(arr2[i2]&&arr2[i2].name){
									if(arr1[i].name==arr2[i2].name){
										if(new Date(arr1[i].updateAt)>new Date(arr2[i2].updateAt)){
											re.push(arr1[i]);
										}else{
											re.push(arr2[i2]);
										}
										arr1.splice(i,1);
										arr2.splice(i2,1);
										i--;i2--;
									}
								}else{
									err.push(["i2",i2])
								}
							}else{
								err.push(["i",i])
							}
						} 
					} 
					re=re.concat(arr1,arr2)
					t.writeAll(re).then(function(e){
						alert(e)
					}).catch(function(e){
						alert(e)
					});;
				});
			}).then(function(){
				alert(true)
			}).catch(function(e){
				alert(e)
			});
		},
		upload:function() {
			this.getAllIndexData("readAt").then(function(json){
				var json = json.reverse();
				json = JSON.stringify(json, null, 4);
				git.getFile("page", "novel/data/Shelf.json").then(function(foo1){
					git.createFile({
						owner: "docfeng",
						repos: "page",
						name: "novel/data/Shelf.json",
						txt: json
					}).then(function(re){
						alert(re);
					});
				});				
			});			
		},
		select:function(obj){
		        //var check=obj.querySelector("input");
		        //check.checked=check.checked?false:true;
		        var dir_box=document.querySelector("#shelf_table").querySelectorAll("input");
		        var len=0;
		        var dir=[];
		        for(var i=0;i<dir_box.length;i++){
		            dir_box[i].checked==true&&(len++,dir.push([Book.arr[i],i]));
		        }
		        console.log(dir)
		       // file_control.style.display=len>0?"block":"none";
		        //normal_control.style.display=len>0?"none":"block";
		},
		control:function(index){
			var json=Book.arr[index];
			var name = json.name;
			var url = json.url;
			Book.json=json;
			Book.name=name;
			Book.url=url;
			var readIndex=json.readIndex;
			if(("string"!=typeof name)&&("string"!=typeof url)&&("number"!=typeof readIndex)){
				var str="List.click参数错误：\nname:"+name+"\ni:"+url+"\nreadIndex:"+readIndex
				alert(str)
				return Promise.reject(str);
			}
			
			var d=fj.Dialog(shelf_control);
			d.no=function(a){
				var src=event.srcElement;
				var obj;
				src.classList.contains("item")&&(obj=src)
				src.parentNode.classList.contains("item")&&(obj=src.parentNode);
				if(obj){
					switch(obj.dataset.index){
						case "1"://"删除":
						    t.delete(index);
						    break;
						case "2"://"移动":
							fj.select(json.name,["在读","其他","已读"]).then(function(re){
								console.log(re)
								switch(re){
									case "在读":
										json.sort=1;
									    t.move(json);
									    break;
									case "其他":
										json.sort=2;
									    t.move(json);
									    break;
									case "已读":
									    json.sort=3;
									    t.move(json);
									    break;
								}
							});
							break;
						case "7"://"浏览器打开":
						    window.open('https://so.m.sm.cn/s?uc_param_str=dnntnwvepffrgibijbprsvdsme&from=wh10516&uc_sm=1&q='+Book.name);
						    break;	
						case "3"://更新
						    List.read(name).then(function(list_arr){
								var list_arr=list_arr;
								return List.remote(url).then(function(_list_arr){
									if (list_arr&&_list_arr.length == list_arr.length) {
										fj.tip("目前没有新更新", 1.5);
									} else {
										var arr = Book.listarr = _list_arr;
										List.write(name, arr).then(function(re) {
											//fj.tip("List写入成功")
										}).catch(function(e) {
											fj.tip("List写入失败" + e)
										})
									
										var title = arr[arr.length - 1][1];
										var url = arr[arr.length - 1][0];
										
										fj.tip("已更新" + title, 2);
										
										json.updateTitle = title;
										json.updateURL = url;
										json.updateIndex = arr.length - 1;
										json.updateAt = formatDate(new Date());
									
										Shelf.write(json);
										Shelf.put(json);
										
										var str =Shelf.formatUI(json);
										shelf_table.rows[index].innerHTML = str;
									}
									return list_arr;
								}).catch(function(e) {
									alert("更新出错" + e)
								})
						    });
							break;	
					}
				}
			}
			d.show()
		},
		click:function(obj, order) {
			var order = order ||"click"
			var obj = obj;
			var t=this;
			switch(obj.tagName.toLowerCase()){
			    case "input":
			        obj=obj.parentNode.parentNode;
			        break;
			    case "span":
				    //this.select()
					var index=obj.parentNode.parentNode.parentNode.rowIndex;
					console.log("index",index);
					t.control(index);
					/* fj.select(json.name,["删除","移动"]).then(function(re){
						
					}) */
			        break;
			    case "td":
			        obj=obj.parentNode;
			        break;
			    default:
			        obj=obj.parentNode.parentNode;;
			}
			var i = obj.rowIndex;
			if(!i&&i!=0){
				return 0;
			}
			if (order == "click") {
				UI.showList()
				Shelf.show(i);
				var json = Book.arr[i];
				var name = json.name;
				var url = json.url;
				var readIndex=json.readIndex;
				if(("string"!=typeof name)&&("string"!=typeof url)&&("number"!=typeof readIndex)){
					var str="List.click参数错误：\nname:"+name+"\ni:"+url+"\nreadIndex:"+readIndex
					alert(str);
					return 0;
				}
				//显示目录
				Book.json=json;
				Book.name=name;
				Book.url=url;
				
				List.show(name, url, []);
				
				List.read(name).then(function(list_arr){
					if (!list_arr) {
						return List.remote(url).then(function(list_arr){
							List.write(name, list_arr);
							return list_arr;
						});
					}else{
						return list_arr;
					}
				}).then(function(list_arr){
					List.arr=list_arr;
					List.shelfIndex=i;
					List.listIndex=readIndex
					List.show(name, url, list_arr);
					List.scroll(readIndex); 
				}).catch(function(e){
					alert(e);
				})
			}
			if (order == "delete") {
				this.delete(i);
			}
		},
		updateTop10:function() {
			var arr = Book.arr;
			if(!arr){
				alert("shelf 没有 arr数据");
				return false;
			}
			fj.tip("开始更新前10个");
			var p=[];
			for (var i = 0; i < 10; i++) {
				p.push(this.update(i));
			}
			Promise.all(p).then(function(re){
				alert(JSON.stringify(re,null,4))
			});
		},
		update:function(i) {
			var arr=Book.arr;
			if(!arr){
				return Promise.resolve(i+"shelf 没有 arr数据");
			}
			var json = arr[i];
			if(!json){
				return Promise.resolve(i+"shelf 没有 json数据");
			}
			var url = json.url;
			var name = json.name;
			//Shelf.get(name).then(function(json){
			return List.remote(url).then(function(arr){
				var _arr=arr;
				if(!arr){
					return i+name+"List.remote 没有arr";
				}
				fj.tip("完成第"+i+"个；name="+name);
				if(json.updateIndex!=arr.length){
						//alert(JSON.stringify(arr))
						
						arr = arr[arr.length-1];
						json.updateTitle = arr[1];
						json.updateURL = arr[0];
						json.updateAt = formatDate(new Date());
						json.updateIndex = arr.length;
						Shelf.write(json);
						var str =Shelf.formatUI(json);
						shelf_table.rows[i].innerHTML=str;
						
						List.write(name,_arr)
						.then(function(re){
							fj.tip("List写入成功:"+name)
						}).catch(function(e){
							fj.tip("List写入失败:"+name+e)
						})
						
						return i+name+"更新完成";
				}else{
					return i+name+"没有更新";
				}
			}).catch(function(e){
				return i+"List.remote 错误\n\t"+e;
			});
		}
	}

	