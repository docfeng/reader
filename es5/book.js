var a=function(){/**
 * es5
 * v 1.0
 * gitapi5.js
 * db5.js
 * store.js
 *
 * 
 * table:shelf book-{namme} 
 * shelf:name url creatAt readIndex readTitle readAt readURL updateIndex updateTitle updateAt updateURL || getAt putAt cammentId
 * book-{namme} title url getAt txt putAt 
 * 
 * issue{title:"shelf",body:"",id:0}
 * comment{body:shelf-item,id:0}
 * 
 * book{Shelf,List,Page,Search,Load,}
 * Shelf
 * 
 * List{get,put,read,write,multi,remote,format,update,changeSource}
 * get(name>issue-id)=>arr;
 * put(name>issue-id,arr)=>bool;
 * read(name)=>arr
 * write(name,arr)=>bool;
 * remote(url){format(html,url)}=>arr;
 * multi(name)
 * update
 * changeSource
 * 
 * Page
 * 
 * Search
 * 
 * Load,
 */
}
APP={
	data:{},
	info:{}
}
Book = (function() {
	/* 模式，決定跨域方式 */
	var localModel = "";
	store.getItem("localModel").then(function(url) {
		if (url) {
			localModel = url;
		}
	}).catch(function(e) {
		alert("err:localModel:\n" + e)
	});
	/**
	 * @param {String} url
	 * @param {Object} para
	 * @return {String}
	 */
	var getHTML = function(url, para) {
		var URL = "";
		var xml = false;
		if (para == "real") {
			xml = true;
		}
		if (window.browser && window.browser.MyApp) {
			var url = url;
		} else if (localModel) {
			URL = localModel;
			if ("cors" != localModel) {
				url = URL + "?url=" + encodeURIComponent(url);
			}
		} else {
			URL = "http://gear.docfeng.top/get2.php";//"https://bird.ioliu.cn/v1/";
			url = URL + "?url=" + encodeURIComponent(url);
		}
		return http.get(url, {
			xml: xml,
			"charset":true
		}).then(function(html) {
			var html = html;
			if (!localModel && para == "search") html = eval(html);
			if (!html) {
				return Promise.reject("err:getHTML:\nno html:+" + html + "\nurl:" + url + "\nURL:" + URL);
			}
			return html
		}).catch(function(e) {
			return Promise.reject("err:getHTML:\n" + e);
		});
	}
	/**
	 * @param {Object} str
	 * @return {Boolen}
	 */
	var isJSON = function(str) {
		if (typeof str == 'string') {
			try {
				var obj = JSON.parse(str);
				if (typeof obj == 'object' && obj) {
					return obj;
				} else {
					return false;
				}

			} catch (e) {
				console.log('error：' + str + '!!!' + e);
				return false;
			}
		}
	}
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
				var arr1 = JSON.parse(text);
				var arr2=Book.arr;
				return t.compare(arr1,arr2);
			});
		},
		
		readAll: function() {
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
				fj.tip("name:"+name)
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
		delete: function(json) {
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
		putModel: function() {
			var t = this;
			this.readModel().then(function(re) {
				if (re) {
					return Git.File.put("docfeng", "book-data", "config/corsUrl.txt", re)
				} else {
					return false;
				}
			}).then(function(re) {
				alert("Book.Shelf.putModel" + re);
			}).catch(function(e) {
				alert("err:Book.Shelf.putModel\n" + e)
			})
		},
		getModels: function() {
			var t = this;
			return Git.File.get("docfeng", "book-data", "config/corsUrl.txt").then(function(re) {
				var re = re;
				if (!re) {
					re = [
						"http://gear.docfeng.top/get2.php",
						"http://gear2.docfeng.top/get2.php",
						"http://192.168.123.128/get2.php",
						"http://192.168.123.92:8080/get2.php",
					];
					return re;
				} else {
					return JSON.parse(re);
				}
			}).then(function(re) {
				alert(re)
				t.writeModel(re)
			});
		},
		writeModel: function(re) {
			var re = JSON.stringify(re);
			store.setItem('localModels', re);
		},
		readModel: function() {
			return store.getItem('localModels');
		},

		setModel: function(url) {
			var t = this;
			if (confirm(url)) {
				localModel = url;
				store.setItem('localModel', url);
				this.readModel().then(function(re) {
					if (!re) {
						var re = [];
					} else {
						var re = JSON.parse(re);
					}
					var b = false
					for (var i = 0; i < re.length; i++) {
						if (re[i] == url) b = true;
					}
					if (!b) {
						re.push(url);
						t.writeModel(re);
					}
				});
				//alert(localModel)
			}
		},
		getModel: function() {
			//prompt("localModel", localModel);
			return localModel;
		},
		selectModel: function() {
			var t = this;
			this.readModel().then(function(re) {
				var re = JSON.parse(re);
				fj.select("model", re)
					.then(function(a) {
						if (a) {
							t.setModel(a);
						}

					})
			}).catch(function(e) {
				alert(e)
			})
		}
	}

	var List = {
		get: function(name) {
			var name="book/"+Book.name+"/list/list.json"
			return Git.File.get("docfeng","book-data",name);
		},
		put: function(name,arr) {
			var name="book/"+Book.name+"/list/list.json";
			var arr=arr||Book.listarr;
			var txt=JSON.stringify(arr);
			return Git.File.set("docfeng","book-data",name,txt);
		},
		read: function(name) {
			var t = this;
			return DB.Data.getKey("book", "list", name).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				alert("Book.List.read:\n" + e)
				return Promise.reject(e);
			});
		},
		readAll: function() {
			return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
				DB.DB.close();
				var json = json.reverse();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
						DB.DB.close();
						return true;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List.readAll:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		write: function(json) {
			var t = this;
			return DB.Data.put("book", "list", json).then(function(json) {
				DB.DB.close();
				return true;
			}).catch(function(e) {
				//alert(JSON.stringify(e))
				console.log(e)
				DB.DB.close();
			});
		},
		writeAll: function(json) {
			var t = this;
			var re = [];
			for (var i = 0; i < json.length; i++) {
				var obj = json[i];
				re.push(DB.Data.put("book", "shelf", obj));
			}
			return Promise.all(re);
		},
		add: function(arr) {
			return this.getId().then(function(id) {
				arr.id = id;
				return this.put(arr);
			});
		},
		delete: function(key) {
			return DB.Data.delete("store", "shelf", key).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return Promise.reject(e);
			});
		},
		remote: function(url) {
			var t = this;
			return getHTML(url, "list").then(function(html) {
				if (!html) {
					return Promise.reject("Book.List.remote:error no html");
				} else {
					return t.format1(html, url);
				}
			});
		},
		format1: function(html, url) {
			var html = html.replace(/<img.*?>/g, "");
			var format=function(str){
				var str=str.match(/<a[^>]*?href([^"]*?)=([^"]*?)"([^"]*?)"[^>]*?>(.*?)<\/a>/g);
				var re=[];
				for(var i=0;i<str.length;i++){
					var s=str[i].match(/<a[^>]*?href[^"]*?=[^"]*?"([^"]*?)"[^>]*?>(.*?)<\/a>/);
					s.splice(0,1)
					s[0]=s[0].getFullUrl(url);
					var m=s[1].match(/<[^>]*?>([^<]*?)</);
					if(m){
						s[1]=m[1];
					}
				    re.push(s)
				}
				return re;
			}
			var str=html.match(/<dl[^>]*?>[\s\S]*?<\/dl>/g);
			var re=[];
			if(str){
				for(var i=0;i<str.length;i++){
					var re0=format(str[i]);
					if(re0.length>re.length){
						re=re0;
					}
				}
			}
			str=html.match(/<ul[^>]*?>[\s\S]*?<\/ul>/g);
			if(str){
				for(var i=0;i<str.length;i++){
					var re0=format(str[i]);
					if(re0.length>re.length){
						re=re0;
					}
				}
			}
            if (re.length > 0) {
            	return Promise.resolve(re);
            } else {
            	return Promise.reject("err list.format: no re");
            }
		},
		format2: function(html, url) {
			var t = this;
			var html = html;
			var url = url;
			if (!html || !url) return Promise.reject("err:list.format:参数错误\nurl=" + url + "\nhtml" + html);
			var arr = [];
			var format = function(html) {
				var reg_di = new RegExp("<a[^>]*?href[ ]?=[\"']([^\"'>]*?)[\"'][^>]*?>(第[^\-<]*?)<", "g");
				var arr = html.matches(reg_di);
				for (var i = 0; i < arr.length; i++) {
					arr[i][0] = arr[i][0].getFullUrl(url);
				}
				//下一页地址
				var reg = /<a[^>]*?href=["|']([^"']*?)["|][^>]*?>([^<第]*?下一页[^<]*?)</;
				var nexturl = html.match(reg);
				if (nexturl) {
					nexturl = nexturl[1].getFullUrl(url);
				}
				if (arr.length > 0) {
					return Promise.resolve({
						arr: arr,
						url: nexturl
					});
				} else {
					return Promise.reject("err:list.format-format:arr.length=0");
				}
			}
			fj.tip("开始获取html");
			return format(html).then(function(json) {
				var arr = json.arr;
				//alert("开始分析json:arr:%s\nnexturl:%s".fill(arr,url));
				return arr;
			});
		},
		format: function(html, url) {
			var t = this;
			var html = html;
			var url = url;
			if (!html || !url) return Promise.reject("err:list.format:参数错误\nurl=" + url + "\nhtml" + html);
			var arr = [];
			var format = function(html) {
				var reg_di = new RegExp("<a[^>]*?href[ ]?=[\"']([^\"'>]*?)[\"'][^>]*?>(第[^\-<]*?)<", "g");
				var reg_dl = new RegExp("<dl[^>]*?>([\\s\\S]*?)<\/dl>", "g");
				var arr = html.match(reg_dl);
				if (arr) {
					arr = arr[0].matches(reg_di);
					for (var i = 0; i < arr.length; i++) {
						arr[i][0] = arr[i][0].getFullUrl(url);
					}
				}

				if (!arr || arr.length == 0) {
					alert("Book.List.format:html没有dl\n" + html)
					arr = html.matches(reg_di);
					for (var i = 0; i < arr.length; i++) {
						arr[i][0] = arr[i][0].getFullUrl(url);
					}
				}
				//下一页地址
				var reg = /<a[^>]*?href=["|']([^"']*?)["|][^>]*?>([^<第]*?下一页[^<]*?)</;
				var nexturl = html.match(reg);
				if (nexturl) {
					nexturl = nexturl[1].getFullUrl(url);
				}
				return arr; //{arr:arr,url:nexturl};
			}
			fj.tip("开始获取html");
			return format(html);
		},
		getId: function() {
			return Git.Comment.create("docfeng", "book-data", 1, "test").then(function(text) {
				var json = JSON.parse(text)
				var id = json.id;
				return id;
			});
		},
		createTable: function() {
			alert("开始List创建表格");
			var data = {
				key: "name",
				index: {
					name: true,
					arr: false
				}
			};
			return DB.Table.create("book", "list", data);
		}

	}

	var Page = {
		getList:function(name){
			var path="book/"+name+"/page";
			var t=this;
			return Git.Dir.getFileList("docfeng","book-data",path).then(function(re){
				t.json=re.file;
			})
			//Git.File.put("docfeng","book-data",name,txt)
		},
		put:(function(a){
			var arr=[];
			var json;
			var bool=true;
			var put=function(path,txt){
				return Git.File.put("docfeng","book-data",path,txt).then(function(a){
					if(arr.length>0){
						var arr1=arr.splice(0,1)[0];
						var path=arr1[0];
						var txt=arr1[1];
						put(path,txt).then(function(re){
							arr1[2](re);
						});
					}else{
						bool=true;
					}
					if(a){
						return true;
					}else{
						return false;
					}
					
				})
				
			}
			return function(name,title,txt){
				var path="book/"+name+"/page/"+title+".txt";
				json=json||this.json;
				if(json){
					var b=false;
					for(var i=0;i<json.length;i++){
						if(path==json[i]){
							b=true;
						}
					}
					if(!b){
						var p;
						if(bool){
							bool=false;
							p=put(path,txt);
						}else{
							p=new Promise(function(resolve,reject){
								arr.push([path,txt,function(str){
									resolve(str)
								}]);
							});			
						}
						p.then(function(re){
							if(re){
								json.push(path)
							}
						});
					}
				}
			}
		})(),
		get:function(name,title){
			var name="book/"+name+"/page/"+title+".txt";
			return Git.File.get("docfeng","book-data",name);
		},
		multi: function(name, title,url) {
			var t = this;
			//alert(url)
			return t.read(name, url).then(function(txt) {
				if (txt) {
					return txt.txt;
				} else {
					return Promise.reject("no");;
				}
			}).catch(function() {
				return t.remote(url).then(function(txt) {
					if (txt) {
						Page.write(name, title, url, txt).catch(function(e) {
							alert("err:Page.write:\n" + e)
						});
						return txt;
					} else {
						return Promise.reject("Page.mult:\n txt:" + txt);;
					}

				});
			});
		},
		remote: function(url) {
			var t = this;
			return getHTML(url, "page").then(function(html) {
				if (html) {
					return t.format(html, url).then(function(txt) {
						if (!txt) {
							return Promise.reject("Page.format:没有获取到txt\n" + txt);
						} else {
							return txt;
						}
					}).catch(function(e) {
						return Promise.reject("Page.format:\nerr:" + e);
					});
				} else {
					return Promise.reject("Page.remote:没有获取到HTML\n" + html);
				}
			});
		},
		read: function(name, url) {
			var name = name + url;
			var t = this;
			return DB.Data.getKey("book", "page", name).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.getKey("book", "page", name).then(function(re) {
						DB.DB.close();
						if (re) {
							return re;
						} else {
							return false;
						}
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.page.read:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		write: function(name, title, url, txt) {
			var t = this;
			t.put(name,title,txt);
			var full_name = name + url;
			var json = {
				full_name: full_name,
				name: name,
				title: title,
				txt: txt,
				url: url,
				updated_at: formatDate(new Date())
			}
			return DB.Data.put("book", "page", json).then(function(json) {
				DB.DB.close();
				return true;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.put("book", "page", json).then(function(json) {
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
		formatUI: function(txt) {
			var txt = "<p>" + txt.replace(/\n/g, '</p>\n<p>') + "</p>"
			//document.querySelector("#txt").innerHTML = txt;
			return txt;
		},
		createTable: function() {
			var data = {
				key: "full_name",
				index: {
					full_name: true,
					name: false,
					title: false,
					txt: false,
					url: false,
					updated_at: false
				}
			};
			return DB.Table.create("book", "page", data);
		},
		format: function(html, url) {
			var t = this;
			var txt = "";
			var html = html.replace(/(<br[^>]*?>[ \s]*){1,}/g, '\n');
			html = html.replace(/(<p>)/g, '');
			html = html.replace(/(<\/p>)/g, '\n');
			html = html.replace(/&nbsp;/g, ' ');
			html = html.replace(/&lt;r \/&gt;/g, ' ');
			//匹配正文
			var atxt = html.match(/>([^<]{300,})</g);
			atxt = atxt ? atxt : "";
			for (var i = 0; i < atxt.length; i++) {
				var elen = atxt[i].match(/[A-Za-z]/g);
				if (!elen || elen.length / atxt[i].length < 0.06) {
					txt = atxt[i];
					txt = txt.match(/>([^<]{100,})</)
				}
			}
			txt = txt ? txt[1] : "";
			if (!txt) return Promise.reject("没有txt;\nurl=" + url + "\nhtml=\n" + html);
			return Promise.resolve(txt);
			/* //匹配下一章地址
			var reg = /<a[^>]*?href="([^"]*?)"[^>]*?>下[^<]*?</;
			var nexturl = html.match(reg);
			nexturl = nexturl ? nexturl[1] : "";
			nexturl = nexturl.getFullUrl(url);
			return new Promise(function(result, reject) {
				//是否有分章
				if (nexturl.indexOf("_") > nexturl.length - 8) {
					getHTML(nexturl).then(function(html) {
						this.format(html, url).then(function(_txt) {
							txt += _txt;
							result(txt);
						});
					});
				} else {
					result(txt);
				}
			}); */
		}
	}
	var Search = {
		multi: function(name) {
			var t = this;
			return t.read(name).then(function(json) {
				if (json && json.arr) {
					return json.arr;
				} else {
					return Promise.reject("book.search.read:no json:" + json);;
				}
			}).catch(function() {
				return t.remote(name).then(function(arr) {
					if (arr) {
						return arr;
					} else {
						return Promise.reject("book.search.remote:no arr" + arr);;
					}
				});
			});
		},
		remote: function(name) {
			var t = this;
			//var url = "https://www.baidu.com/s?q1=" + name + "&rn=10";
			var url="https://www.baidu.com/s?ie=UTF-8&wd="+name;
			return getHTML(url, "search").then(function(html) {
				fj.tip("已获取到数据，开始格式化")
				//alert(html)
				return t.format(html);
			}).catch(function(e) {
				return Promise.reject("err:book.search.remote:\n" + e);
			})
		},
		read: function(name) {
			var t = this;
			return DB.Data.getKey("book", "search", name).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.getKey("book", "search", name).then(function(re) {
						DB.DB.close();
						if (re) {
							return re;
						} else {
							return false;
						}
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.search.read:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		write: function(name, arr) {
			var t = this;
			var json = {
				name: name,
				arr: arr
			}
			return DB.Data.put("book", "search", json).then(function(json) {
				DB.DB.close();
				return true;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.put("book", "search", json).then(function(json) {
						DB.DB.close();
						return true;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.Search" + e)
						return false
					});
				});
			});
		},
		formatUI: function(arr) {
			var txt = "";
			return Promise.resolve(txt);
		},
		format: function(html) {
			if (!html) {
				return Promise.reject("book.search.format:no html:\n" + html);
			}
			fj.tip("开始格式化")
			var t = this;
			var html = html.replace(/<img.*?>/g, "");
			var h = document.createElement("html");
			h.innerHTML = html;
			var d = h.getElementsByTagName("div");
			var re = [];
			for (var i = 0; i < d.length; i++) {
				if (d[i].id >= 1) {
					var a = d[i].querySelector("a");
					re.push([a.href, a.innerHTML])
				}
			}
			if (re.length == 0) {
				fj.tip("格式化成功")
				return Promise.reject("book.search.format:no arr:\n" + JSON.stringify(re, null, 4));
			}
			fj.tip("格式化失败")
			return Promise.resolve(re);;
		},
		formatAll: function(arr) {
			var p = [];
			var t = this;
			for (var i = 0; i < arr.length; i++) {
				var url = arr[i][0];
				p.push(this.checkCharset(url));
			}
			return Promise.all(p).then(function(a) {
				var r = [];
				var p = [];
				for (var i = 0; i < a.length; i++) {
					if (a[i]) {
						r.push(re[i]);
						p.push(t.getRealPath(arr[i][0], arr[i][1]))
					}
				}
				return Promise.all(p);
			}).catch(function(a) {
				alert("err:book.search.formatAll:\n" + a)
				return Promise.reject("err:book.search.formatAll:\n" + a);
			});
		},
		checkCharset: function(url) {
			return List.remote(url).then(function(a) {
				if (a) {
					return true;
				} else {
					return false;
				}
			}).catch(function(a) {
				alert("err:book.search.checkCharset:\n" + a)
				return Promise.reject("err:book.search.checkCharset:\n" + a);
			});
		},
		getRealPath: function(url) {
			var t = this;
			var url=url;
			return getHTML(url, "real").then(function(json) {
				url = json.xml.getResponseHeader("url");
				url = url || json.xml.responseURL;
				return List.format1(json.html, url);
			}).then(function(arr) {
				console.log("url",url,"arr",arr)
				return [url, arr];
			}).catch(function(a) {
				return Promise.reject("book.search.getRealPath:\n" + a);;
			});
		},
		createTable: function() {
			var data = {
				key: "name",
				index: {
					name: true,
					arr: false
				}
			};
			return DB.Table.create("book", "search", data);
		}

	}
	var download = {

	}
	var Book= {
		"Shelf": Shelf,
		"List": List,
		"Page": Page,
		"Search": Search,
		"download": download,
		"deleteDB":function(){
			DB.DB.delete('book').then(function(a){
				alert('删除book数据库\n成功');
			}).catch(function(){
				alert('删除book数据库\n失败');
			})
		}
	};
	return Book;
})();

String.prototype.fill = function(arr) {
	var str = this
	for (var i = 0; i < arr.length; i++) {
		str = str.replace("%s", arr[i]);
	}
	return str;
}
var a=function(){
/* getAll: function() {
			var t = this
			return Git.Issue.get("docfeng", "book-data", 1).then(function(text) {
				var json1 = JSON.parse(text);
				json1 = JSON.parse(json1.body);
				var time1 = json1[0].readAt;
				return t.readAll().then(function(json2) {
					var time2 = json2[0].readAt
					if (time1 == time2) {
						alert("沒有改變")
					} else {
						var j = []
						for (var i1 = 0; i1 < json1.length; i1++) {
							var b = false;
							for (var i2 = 0; i2 < json2.length; i2++) {
								if (json1[i1].name == json2[i2].name) {
									b = true;
									if (json1[i1].readAt > json2[i2].readAt) {
										// 网络更新时间>本地更新时间，用网络的版本
										j.push(json1[i1]);
									}
								}
							}
							// 如果本地沒有查到name，用网络的版本
							if (!b) {
								j.push(json1[i1]);
							}
						}
						return t.writeAll(j);
					}
				});
			});
		}, */
		/* putAll: function(arr) {
			return this.readAll().then(function(arr) {
				var text = JSON.stringify(arr, null, 4)
				return Git.Issue.put("docfeng", "book-data", 1, "shelf", text, ["shelf"]);
			});
		}, */
		/* same: function() {
			var t = this;
			this.getAll().then(function() {
				t.putAll()
			});
		}, */
}
var tttt = function() {
	Book.Search.get("唐残").then(function(arr) {
		var re = arr[1];
		//alert(re)
		var arr2 = arr[0];
		var re1 = [];
		for (var i = 0; i < re.length; i++) {
			if (re[i]) {
				var b = arr2[i];
				b.push(re[i]);
				re1.push(b)
			}
		}
		alert(JSON.stringify(re1, null, 4))
		return re1
	}).then(function(a) {
		var url = a[0][0];
		Book.Search.getRealPath(url).then(function(url) {
			return Book.list.get(url)
				.then(function(arr) {
					var url = arr[0][0];
					return Book.page.get(url)
				}).then(function(txt) {
					alert(txt)
				}).catch(function(e) {

				});
			alert(e);
		})
	}).catch(function(a) {
		alert(a)
	});


	Book.List.getAll().then(function(re) {
		alert(re)
	}).catch(function(e) {
		alert(e)
	});

	Book.List.readAll().then(function(re) {
		alert(re)
		alert(JSON.stringify(re))
	}).catch(function(e) {
		alert(e)
	});
}
