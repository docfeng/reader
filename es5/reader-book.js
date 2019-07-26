
List = (function(a) {
	var _List = Book.List;
	var Arr, Json;
	var List = {
		get: function(name) {
			return _List.get(name);
		},
		getAll: function() {
			return _List.getAll();
		},
		read: function(name) {
			return _List.read(name).then(function(json) {
				if (json) {
					return json.val;
				} else {
					return false
				}
			});
		},
		readAll: function() {
			return _List.readAll();
		},
		write: function(name, val) {
			var json = {
				"name": name,
				"val": val
			};
			return _List.write(json);
		},
		writeAll: function(arr) {
			return _List.writeAll(arr);
		},
		put: function(json) {
			return _List.put(json);
		},
		putAll: function(arr) {
			return _List.putAll(arr);
		},
		remote: function(url) {
			return _List.remote(url).then(function(arr) {
				//List.arr = arr;
				return arr;
			});
		},
		add: async function(name, url, arr) {
			var t = this;
			var json = this.json;
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
				json1.updateIndex = arr.length - 1,
					json1.updateTitle = arr[arr.length - 1][1],
					json1.updateAt = formatDate(new Date()),
					json1.updateURL = arr[arr.length - 1][0];
				//this.show({index:num})
			}
			json.unshift(json1);
			this.show()
			//alert(json1)
			var re = await this.setKeyData(json1);
		},
		delete: function(i) {
			var name = this.json[i].name;
			if (confirm("是否删除:" + i + name)) {
				this.deleteKeyData(name);
			}
		},
		formatShelfUI: function(json, i) {
			var d =
				"<h1>%s.%s</h1>\
			    <h2>已读:%s</h2>\
			    <h3>%s</h3>\
			    <h4><span class='highlight'>最新:</span>%s</h4>\
			    <h3>%s</h3>\
			    <h6>%s</h6>"
				.fill([i, json.name,
					json.readTitle,
					json.readAt,
					json.updateTitle,
					json.updateAt,
					json.url
				]);
			var str = "<tr><td>" + d + "</td></tr>";
			return str;
		},
		ini: function() {
			return _List.ini();
		},
		showShelf: function(i) {
			var t = this;
			this.readAll().then(function(arr) {
				var json = arr[i];
				var str = t.formatShelfUI(json, i);
				shelf_table.rows[i].innerHTML = str;
			});
		},
		checkChange: function() {
			var arr1, arr2;
			var t = this;
			this.getAll().then(function(arr) {
				arr1 = arr;
				return t.readAll();
			}).then(function(arr) {
				arr2 = arr;

			});
		},
		moveData: function() {
			var t = this;
			var arr1, arr2;
			var re = [];
			DB.Table.has("book", "shelf").catch(function(e) {
				alert(e)
				return t.ini();
			}).then(function() {
				return Git.File.get("docfeng", "page", "novel/data/Shelf.json").then(function(text) {
					//alert(text)
					var p = [];
					arr1 = JSON.parse(text);
					alert(JSON.stringify(arr1[0]))
					t.write(arr1[0]);
					return t.readAll();
				}).then(function(arr) {
					arr2 = arr;
					alert(JSON.stringify(arr));
				}).then(function() {
					for (var i = 0; i < arr1.length; i++) {
						for (var i2 = 0; i2 < arr2.length; i2++) {
							if (arr1[i].name == arr2[i2].name) {
								//if()
								re.push(arr1[i]);
								delete arr1[i];
								delete arr2[i2];
							}
						}
					}
					alert(JSON.stringify(re));
					re = re.concat(arr1, arr2)
					alert(JSON.stringify(re));
				});
			}).then(function() {
				alert(true)
			}).catch(function(e) {
				alert(e)
			});
		},
		upload: async function() {
			var json = await this.getAllIndexData("readAt");
			json = json.reverse();
			json = JSON.stringify(json, null, 4);

			await git.getFile("page", "novel/data/Shelf.json");
			var re = await git.createFile({
				owner: "docfeng",
				repos: "page",
				name: "novel/data/Shelf.json",
				txt: json
			});
			alert(re);
		},
		//显示目录
		show: function(name, url, arr) {
			this.arr = arr;
			this.name = name;
			var url = url;
			this.showarr(arr);
			listName.innerText = name;
			listCount.innerText = arr.length;
			listUrl.innerText = url;
		},
		showarr: function(arr) {
			if(!arr){
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
			var h = list_table.rows[i].offsetTop
			list_table.parentNode.scrollTop = h
		},

		click: function(obj) {
			var obj = obj.parentNode;
			var i = obj.parentNode.rowIndex; //*this.max+obj.cellIndex;
			var name = this.name;
			var arr = this.arr[i];
			var title = arr[1];
			var url = arr[0];
			Shelf.read(name).then(function(json){
				json.readTitle = title;
				json.readURL = url;
				json.readIndex = i;
				json.readAt = formatDate(new Date());
				Shelf.write(json);
			});
			
			Page.name = name;
			Page.json=this.json;
			Page.arr = this.arr;
			Page.resize()
			Page.multiIndex(i).then(function(re) {
				//alert(re)
				//Page.show(re)
				Page.resize()
				window.page(i)
			}).catch(function(e) {
				alert("err:Page.multiIndex" + e)
			});
			UI.hidePage();
			//fullScreen(document.querySelector("#pageDiv"))
		},
		update: function(url) {
			var arr=this.arr
			if(!url||!arr){
				alert("参数错误：\nurl:"+url+"\narr:"+ arr)
				return false
			}
			var t=this;
			this.remote(url).then(function(_arr){
				if (_arr.length == t.arr.length) {
					alert("目前没有新更新");
				} else {
					var arr = t.arr = _arr;
					t.showarr(arr);
					t.write(name,arr);
					
					var title = arr[arr.length - 1][1];
					var url = arr[arr.length - 1][0];
					var newpage = title;
					alert("已更新" + title);
					listNew.innerText = title;
					var json=t.json;
					json.updateTitle = title;
					json.updateURL = url;
					json.updateIndex = arr.length - 1;
					json.updateAt = formatDate(new Date());
					Shelf.write(json);
				}
			}).catch(function(e){
				alert("更新出错"+e)
			})
		},
		changeSource: async function(name) {
			UI.showSearch();
			f6_name.value = name;
			Search.search(name);
		},
		addBook: function(name, url, arr) {
			var name = name || this.name;
			var arr = arr || this.arr;
			var url = url || this.url;
			Shelf.add(name, url, arr);
		},

	}
	return List;
})();


Page = (function(a) {
	var _Page = Book.Page;
	var Arr, Json;
	var Page = {
		multi: function(name, url) {
			return _Page.multi(name, url);
		},
		multiIndex: function(i) {
			var name = this.name;
			var arr = this.arr;
			if(!name||!arr||!i){
				alert("Page.multiIndex参数错误：\nname:"+name+"\narr:"+arr)
				return Promise.reject("Page.multiIndex参数错误：\nname:"+name+"\narr:"+arr);
			}
			var title = arr[i][1];
			var url = arr[i][0];
			return _Page.multi(name, url).then(function(txt) {
				
				Page.write(name, title, url, txt).then(function(re) {
					//alert(re)
				}).catch(function(e) {
					alert("err:Page.write:\n" + e)
				});
				return txt;
			})
		},
		remote: function(url) {
			return _Page.remote(url);
		},
		read: function(name, url) {
			return _Page.read(name, url);
		},
		write: function(name, title, url, txt) {
			return _Page.write(name, title, url, txt);
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
			var arr = arr || this.arr;
			var name = name || this.name;
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

			str =
				'<div style="height:580px;overflow-x:hidden;overflow-y:scroll;"><table style="width:100%;height:100%" onclick="Page.closeList(event.srcElement)">' +
				str + "</table></div>";
			msg(name, str, config);
			//目录滚动到第i个
			var i = this.index1||this.json.readIndex;
			var table1 = document.querySelector(".msg_body").childNodes[0].childNodes[0];
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
			$(".msg").css("display", "none");
			looseBody();
		}
	}
	return Page;
})();

Search=(function(a){
	var _Search=Book.Search;
	var Arr,Json;
	var Search ={
		multi: function(name) {
			return _Search.multi(name);
		},
		remote: function(name) {
			return _Search.remote(name);
		},
		read: function(name) {
			return _Search.read(name);
		},
		write: function(name, arr) {
			return _Search.write(name, arr);
		},
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
			Search.multi(name).then(function(re){
				//alert(JSON.stringify(re,null,4));
				t.arr=re;
				t.name=name;
				Search.write("秦吏",re)
				Search.show(re);
			}).catch(function(e){
				alert("Search.multi:\n"+e)
			})
		},
		update:function(name){
			Search.remote(name).then(function(re){
				alert(re);
				alert(JSON.stringify(re))
				Search.write("秦吏",re)
				Search.show(re);
			}).catch(function(e){
				alert(e)
			})
		},
		click: function(obj){
		    var obj=obj.parentNode;
		    var i=obj.parentNode.rowIndex;
		    var name=this.name;
		    var arr=this.arr[i];
		    var url=arr[0];
			//显示目录页
		    //menu_obj.shift(2);
			
			List.remote(url).then(function(arr){
				alert(arr)
				List.show(name,url,arr);
				Shelf.add(name,url,arr).then(function(re){
					alert("添加书本成功")
				}).catch(function(e){
					alert("添加书本失败")
				})
				//window.history.go(-1);
				//UI.showList()
				//
				List.write(name,arr);
			}).catch(function(e){
				alert(e)
			});
		    //f6_table.rows[i].innerHTML=`<tr><td><h4>${json[i][0]}</h4><h3>${json[i][1]}</h3></td></tr>`;
		}
	}
	return Search;
})();



Shelf=(function(a){
	var _Shelf=Book.Shelf;
	var Arr,Json;
	var Shelf = {
		get:function(name){
			return _Shelf.get(name);
		},
		getAll:function(){
			return _Shelf.getAll();
		},
		read:function(name) {
			return _Shelf.read(name) ;
		},
		readAll:function() {
			if(this.arr){
				return Promise.resolve(this.arr);
			}else{
				return _Shelf.readAll().then(function(arr){
					Shelf.arr=arr;
					return arr;
				});
			}
		},
		write:function(json) {
			return _Shelf.write(json) ;
		},
		writeAll:function(arr) {
			return _Shelf.writeAll(arr) ;
		},
		put:function(json) {
			return _Shelf.put(json) ;
		},
		putAll:function(arr) {
			return _Shelf.putAll(arr) ;
		},
		add: function(name, url, arr) {
			var t = this;
			var json = this.arr;
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
				json1.updateIndex = arr.length - 1,
					json1.updateTitle = arr[arr.length - 1][1],
					json1.updateAt = formatDate(new Date()),
					json1.updateURL = arr[arr.length - 1][0];
				//this.show({index:num})
			}
			json.unshift(json1);
			this.showAll()
			return this.write(json1);
		},
		delete: function(i) {
			var name = this.arr[i].name;
			if (confirm("是否删除:" + i + name)) {
				_Shelf.delete(name).then(function(){
					Shelf.arr.splice(i,1);
					var obj=shelf_table.rows[i];
					obj.parentNode.removeChild(obj)
				});
			}
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
			var d ="<h1>%s</h1>\
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
			var str = "<tr><td>" + d + "</td></tr>";
			return str;	
		},
		ini:function(){
			return _Shelf.ini();
		},
		show:function(i) {
			this.readAll().then(function(arr){
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
			this.readAll().then(function(arr){
				Shelf.arr=arr;
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
		upload: async function() {
			var json = await this.getAllIndexData("readAt");
			json = json.reverse();
			json = JSON.stringify(json, null, 4);
	
			await git.getFile("page", "novel/data/Shelf.json");
			var re = await git.createFile({
				owner: "docfeng",
				repos: "page",
				name: "novel/data/Shelf.json",
				txt: json
			});
			alert(re);
		},
		
		click:function(obj, order) {
			var order = order ||"click"
			var obj = obj.parentNode;
			var i = obj.parentNode.rowIndex;
			if (order == "click") {
				UI.showList()
				Shelf.show(i);
				var json = this.arr[i];
				var name = json.name;
				var url = json.url;
				var readIndex=json.readIndex;
				//显示目录
				List.show(name, url, []);
				List.json=json;
				List.name=name;
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
			var arr = this.arr;
			if(!arr){
				alert("shelf 没有 arr数据");
				return false;
			}
			var p=[];
			for (var i = 0; i < 10; i++) {
				p.push(this.update(i));
			}
			Promise.all(p).then(function(re){
				alert(JSON.stringify(re,null,4))
			});
		},
		update:function(i) {
			var arr=this.arr;
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
				var arr=arr;
				if(!arr){
					return i+"List.remote 没有arr";
				}
				if(json.updateIndex!=arr.length){
						arr = arr.pop();
						json.updateTitle = arr[1];
						json.updateURL = arr[0];
						json.updateAt = formatDate(new Date());
						json.updateIndex = arr.length;
						Shelf.write(json);
						var str =Shelf.formatUI(json);
						shelf_table.rows[i].innerHTML=str;
						return i+"更新完成";
				}else{
					return i+"没有更新";
				}
			}).catch(function(e){
				return i+"List.remote 错误\n\t"+e;
			});
		}
	}
	return Shelf;
})();
//