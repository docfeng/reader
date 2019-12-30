List = (function(a) {
	var _List = Book.List;
	var Arr, Json;
	var List = {
		read: function(name) {
			var t = this;
			return _List.read(name).then(function(json) {
				if (json && json.val) {
					var re = JSON.parse(json.val);
					return re;
				} else {
					return false
				}
			});
		},
		write: function(name, arr) {
			var json = {
				"name": name,
				"val": JSON.stringify(arr)
			};
			return _List.write(json);
		},
		add: function(name, url, arr) {
			var t = this;
			var json = Book.json;
			var json1 = {};
			var num = -1;
			for (var i = 0; i < json.length; i++) {
				if (json[i].name == name) {
					num = i;
				}
			}
			if (num == -1) {
				json1 = {
					name: name,
					url: url,
					creatAt: formatDate(new Date()),
					readIndex: 0,
					readTitle: arr[0][1],
					readAt: formatDate(new Date()),
					readURL: arr[0][0],
					updateIndex: arr.length - 1,
					updateTitle: arr[arr.length - 1][1],
					updateAt: formatDate(new Date()),
					updateURL: arr[arr.length - 1][0]
				}
			} else {
				json1 = json.splice(num, 1)[0]; //json[num];
				json1.url = url;
				json1.updateIndex = arr.length - 1;
				json1.updateTitle = arr[arr.length - 1][1];
				json1.updateAt = formatDate(new Date());
				json1.updateURL = arr[arr.length - 1][0];
				//this.show({index:num})
			}
			json.unshift(json1);
			this.show()
			//alert(json1)
			this.setKeyData(json1);
		},
		delete: function(i) {
			var name = Book.json[i].name;
			if (confirm("是否删除:" + i + name)) {
				this.deleteKeyData(name);
			}
		},
		upload: function() {
			this.getAllIndexData("readAt").then(function(json){
				json = json.reverse();
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
		//显示目录
		show: function(name, url, arr) {
			Book.listarr = arr;
			Book.name = name;
			Book.url = url;
			this.showarr(arr);
			listName.innerText = name;
			listCount.innerText = arr.length;
			listUrl.innerText = url;
		},
		showarr: function(arr) {
			if (!arr) {
				alert("list.showarr 没有arr");
				return false
			}
			var str = "";
			var err = [];
			for (var i = 0; i < arr.length; i++) {
				if (!arr[i] || !arr[i][1]) {
					err[err.length] = i + ":" + arr[i];
				} else {
					var d = "<h4>" + arr[i][1] + "</h4>";
					d += "<h5>" + arr[i][0] + "</h5>";
					str += "<tr><td>" + d + "</td></tr>";
				}
			}
			list_table.innerHTML = str;
		},
		//目录滚动到第i个
		scroll: function(i) {
			var obj = list_table.rows[i];
			if (obj) {
				var h = obj.offsetTop
				list_table.parentNode.scrollTop = h
			} else {
				fj.tip("List.scroll超出界限：i=" + i);
			}
		},

		click: function(obj) {
			var obj = obj.parentNode;
			var i = obj.parentNode.rowIndex; //*this.max+obj.cellIndex;
			if(!i&&i!=0){
				alert("i:err")
				return 0;
			}
			this.showPageIndex(i);
			//fullScreen(document.querySelector("#pageDiv"))
		},
		showPageIndex: function(i) {
			var name = Book.name;
			var arr = Book.listarr[i];
			var title = arr[1];
			var url = arr[0];
			if(("string"!=typeof name)||!arr||("string"!=typeof url)||("string"!=typeof title)){
				var str="List.click参数错误：\nname:"+name+"\nurl:"+url+"\nreadIndex:"+title+"\narr:"+arr
				alert(str)
				return Promise.reject(str);
			}
			Page.getList(name).then(function(){
				Page.resize()
				window.page(i)
			});
			
			UI.hidePage();
		},

		update: function(url) {
			fj.tip("开始更新");
			var arr = Book.listarr
			var name = Book.name;
			if (!url || !arr) {
				fj.tip("参数错误：\nurl:" + url + "\narr:" + arr, 2)
				return false
			}
			var t = this;
			this.remote(url).then(function(_arr) {
				if (_arr.length == Book.listarr.length) {
					fj.tip("目前没有新更新", 1.5);
				} else {
					var arr = Book.listarr = _arr;
					t.showarr(arr);
					t.write(name, arr).then(function(re) {
						fj.tip("List写入成功")
					}).catch(function(e) {
						fj.tip("List写入失败" + e)
					})

					var title = arr[arr.length - 1][1];
					var url = arr[arr.length - 1][0];
					var newpage = title;
					fj.tip("已更新" + title, 2);
					listNew.innerText = title;
					var json = t.json;
					json.url=url;
					json.updateTitle = title;
					json.updateURL = url;
					json.updateIndex = arr.length - 1;
					json.updateAt = formatDate(new Date());
					Shelf.write(json);
					Shelf.put(json);
				}
			}).catch(function(e) {
				alert("更新出错" + e)
			})
		},
		changeSource: function(name) {
			UI.showSearch();
			f6_name.value = name;
			Search.search(name);
		},
		addBook: function(name, url, arr) {
			var name = name || Book.name;
			var arr = arr || Book.listarr;
			var url = url || Book.url;
			Shelf.add(name, url, arr);
		},
		addUrl: function() {
			var url = prompt();
			if(url){
				Book.url=url;
				this.update(url);
			}
		}

	}
	List=Object.assign({},_List,List);
	return List;
})();
Page = (function(a) {
	var _Page = Book.Page;
	var Arr, Json;
	var preArr=[];
	var Page = {
		multiIndex: function(i) {
			var name = Book.name;
			var arr = Book.listarr;
			if(!name||!arr||(i!=0&&!i)){
				alert("Page.multiIndex参数错误：\nname:"+name+"\ni:"+i+"\narr:"+arr)
				return Promise.reject("Page.multiIndex参数错误：\nname:"+name+"\ni:"+i+"\narr:"+arr);
			}
			if(i>arr.length-1||i<0){
				return Promise.reject("Page.multiIndex参数i超出范围：\nname:"+name+"\ni:"+i);
			}
			var title = arr[i][1];
			var url = arr[i][0];
			Shelf.readAt(name,title,url,i).then(function(json){
				
			}).catch(function(e){
				console.log(e)
			});
			//预读
			for(var i2=i+1;i2<i+5;i2++){
				if(i2<arr.length&&!preArr[i2]){
					preArr[i2]=true;
					this.preread(i2);
				}
			}
			return _Page.multi(name, title,url);
		},
		preread: function(i) {
			var name = Book.name;
			var arr = Book.listarr;
			if(!name||!arr||!i){
				alert("Page.multiIndex参数错误：\nname:"+name+"\narr:"+arr+"\ni:"+i)
				return Promise.reject("Page.multiIndex参数错误：\nname:"+name+"\narr:"+arr+"\ni:"+i);
			}
			if(i>arr.length-1||i<0){
				return Promise.reject("Page.multiIndex参数i超出范围：\nname:"+name+"\ni:"+i);
			}
			var title = arr[i][1];
			var url = arr[i][0];
			return _Page.multi(name,title, url);
		},
		
		show: function(txt) {
			var txt = this.formatUI(txt);
			//document.querySelector("#txt").innerHTML = txt;
		},
		formatUI: function(txt) {
			var txt = "<p>" + txt.replace(/\n/g, '</p>\n<p>') + "</p>"
			//document.querySelector("#txt").innerHTML = txt;
			return txt;
		},
		clear: function() {
			DB.Table.clear('book', 'page').then(function(a) {
				alert('清除page数据表\n成功')
			}).catch(function() {
				alert('清除page数据表\n失败')
			})
		},
		showList: function(name, arr) {
			var arr = arr || Book.listarr;
			var name = name || Book.name;
			if (!name || !arr) {
				alert("err:Page.showList\n参数错误;\nname:" + name + "\narr:" + arr)
				return "err:Page.showList\n参数错误";
			}

			var config = {
				"height": (document.body.clientHeight - 8) + "px",
				"width": "60%",
				"left": "0px",
				"top": "0px"
			}
			var url_arr = arr;
			var str = "";
			var err = [];
			for (var i = 0; i < url_arr.length; i++) {
				if (!url_arr[i] || !url_arr[i][1]) {
					err[err.length] = i + ":" + url_arr[i];
				} else {
					var d = "<h4>" + url_arr[i][1] + "</h4>";
					d += "<h5>" + url_arr[i][0] + "</h5>";
					//h+="<td>"+d+"</td>";
					str += "<tr><td>" + d + "</td></tr>";
				}
			}

			//str ='<div style="height:580px;overflow-x:hidden;overflow-y:scroll;"><table style="width:100%;height:100%" onclick="Page.closeList(event.srcElement)">' +
			//	str + "</table></div>";
			str='' +
				str + "";
			//msg(name, str, config);
			document.querySelector("#listName2").innerHTML=name;
			var table1=document.querySelector("#list_table2")
			table1.innerHTML=str;
			document.querySelector("#listDiv2").style.display="flex";
			//目录滚动到第i个
			var i = this.index1||Book.json.readIndex;
			var o = table1.rows[i]
			if(!o){
				alert("index1"+this.index1)
				return "";
			}
			var h=o.offsetTop;
			table1.parentNode.scrollTop = h;
		},
		//关闭目录,显示文章
		closeList: function(obj) {
			var obj = obj.parentNode;
			var i = obj.parentNode.rowIndex;
			window.page(i);
			/* $(".msg").css("display", "none");
			looseBody(); */
		}
	}
	Page=Object.assign({},_Page,Page);
	return Page;
})();

Search=(function(a){
	var _Search=Book.Search;
	var Arr,Json;
	var Search ={
		show: function(arr) {
			var txt=this.formatUI(arr);
			f6_table.innerHTML = txt;
			//document.querySelector("#txt").innerHTML = txt;
		},
		formatUI: function(arr) {
			var txt = ""
			for (var i = 0; i < arr.length; i++) {
				txt += "<tr><td><h4>" + arr[i][0] + "</h4><h3>" + arr[i][1] + "</h3></td></tr>";
			}
			return txt;
		},
		search:function(name){
			var t=this;
			fj.tip("开始获取数据")
			Search.multi(name).then(function(re){
				//alert(re)
				fj.tip("已获取数据<br ><pre>"+re+"</pre>",3)
				//alert(JSON.stringify(re,null,4));
				t.arr=re;
				t.name=name;
				Search.write(name,re)
				Search.show(re);
			}).catch(function(e){
				alert("Search.search:\n"+e)
			})
		},
		update:function(name){
			var t=this;
			fj.tip("开始更新数据")
			Search.remote(name).then(function(re){
				fj.tip("已获取数据<br ><pre>"+JSON.stringify(re,null,4)+"</pre>",3)
				alert(JSON.stringify(re,null,4))
				t.arr=re;
				Search.write(name,re)
				Search.show(re);
			}).catch(function(e){
				alert("search.update:\nname"+name+"\nerr:"+e)
			})
		},
		click: function(obj){
		    var obj=obj.parentNode;
		    var i=obj.parentNode.rowIndex;
			if((i!=0&&!i)||!this.name||!this.arr){
				alert("search.click参数错误：\ni=%s;\nname=%s;\narr=%s".fill([i,this.name,this.arr]));
			}
		    var name=this.name;
		    var arr=this.arr[i];
		    var url=arr[0];
			fj.tip("开始获取目录数据")
			//显示目录页
			_Search.getRealPath(url).then(function(re){
				fj.tip("已获取目录数据，开始显示",1)
				var url=re[0];
				var arr=re[1];
				List.show(name,url,arr);
				List.write(name,arr);
				Shelf.updateAt(name,url,arr).then(function(re){
					fj.tip("添加书本成功",2)
					Shelf.showAll()
				}).catch(function(e){
					fj.tip("添加书本失败",2)
				})
				//UI.showList()
				alert("name="+name+"\nurl="+url+"\narr:"+JSON.stringify(arr,null,4))
				window.history.go(-1);	
			}).catch(function(e){
				alert("search.click:err:\n"+e)
			});
			
		    //f6_table.rows[i].innerHTML=`<tr><td><h4>${json[i][0]}</h4><h3>${json[i][1]}</h3></td></tr>`;
		},
		add: function(name,url){
		    var name=name||this.name;
			if(!name||!url){
				alert("search.add参数错误：\nname=%s;\nurl=%s".fill([name,url]));
				return 0;
			}
			fj.tip("开始获取目录数据")
			//显示目录页
			List.remote(url).then(function(arr){
				fj.tip("已获取目录数据，开始显示",1)
				alert(arr)
				List.show(name,url,arr);
				Shelf.add(name,url,arr).then(function(re){
					fj.tip("添加书本成功",2)
				}).catch(function(e){
					fj.tip("添加书本失败",2)
				})
				//UI.showList()
				List.write(name,arr);
				alert("name="+name+"\nurl="+url+"\narr:"+JSON.stringify(arr,null,4))
				window.history.go(-1);	
			}).catch(function(e){
				alert("search.add:err:\n"+e)
			});
			
		    //f6_table.rows[i].innerHTML=`<tr><td><h4>${json[i][0]}</h4><h3>${json[i][1]}</h3></td></tr>`;
		}
	}
	Search=Object.assign({},_Search,Search)
	return Search;
})();



Shelf=(function(a){
	var _Shelf=Book.Shelf;
	var Arr,Json;
	var Shelf = {
		readAll:function() {
			if(Book.arr){
				return Promise.resolve(Book.arr);
			}else{
				return _Shelf.readAll().then(function(arr){
					Book.arr=arr;
					return arr;
				});
			}
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
				_Shelf.delete(json).then(function(){
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
					var json=Book.arr[index];
					fj.select(json.name,["删除","移动"]).then(function(re){
						switch(re){
							case "删除":
							    t.delete(index);
							    break;
							case "移动":
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
						}
					})
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
					alert(str)
					return Promise.reject(str);
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
				});
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
	Shelf=Object.assign({},_Shelf,Shelf)
	return Shelf;
})();
//