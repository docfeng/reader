/**
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

Book = (function() {
	var getHTML = function(url, para) {
		var URL = "";
		switch (para) {
			case "search":
				URL = "https://bird.ioliu.cn/v1/";
				break;
			case "real":
				URL = "http://gear.docfeng.top/get2.php";
				break;
			case "list":
				URL = "https://bird.ioliu.cn/v2/";
				break;
			case "page":
				URL = "http://gear.docfeng.top/get2.php";//"https://bird.ioliu.cn/v2/";
				break;
			default:
				URL = "http://gear.docfeng.top/get2.php";
				break;
		}
		url=URL+"?url="+url;
		return http.get(url).then(function(html){
			return html
		});;
	}
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

		},
		getAll: function() {
			return Git.Comment.get("docfeng", "book-data", 1).then(function(text) {
				var json = JSON.parse(text);
				var re = [];
				for (var i = 0; i < json.length; i++) {
					var item = isJSON(json[0].body);
					if (item) {
						item.updated_at = json[0].updated_at;
						re.push(item)
					} else {
						Git.Comment.del("docfeng", "book-data", json[0].id);
					}
				}
				return re;
			});
		},
		put: function(json) {
			var id = json.id;
			if (!id) {
				return this.add(json);
			}
			var txt = JSON.stringify(json);
			return Git.Comment.put("docfeng", "book-data", id, txt).then(function(text) {
				return true;
			});
		},
		putAll: function(arr) {
			var id = arr.id;

		},
		readAll: function() {
			var t=this;
			return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
				DB.DB.close();
				var json = json.reverse();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.ini().then(function() {
					return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
						DB.DB.close();
						return json;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List.readAll:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		read: function(name) {
			var t = this;
			return DB.Data.getKey("book", "shelf", name).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.ini().then(function() {
					return DB.Data.getKey("book", "shelf", name).then(function(json) {
						DB.DB.close();
						return true;
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List.read:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		writeAll: function(json) {
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
		add: function(arr) {
			return this.getId().then(function(id) {
				arr.id = id;
				return this.put(arr);
			});
		},
		delete: function(key) {
			return DB.Data.delete("book", "shelf", key).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return Promise.reject(e);
			});
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
			alert("开始创建表格");
			return Promise.all([this.createShelfTable(), this.createListTable(), this.createPageTable()]);
		}
	}

	var List = {
		get: function(id) {

		},
		getAll: function() {
			return Git.Comment.get("docfeng", "book-data", 1).then(function(text) {
				var json = JSON.parse(text);
				var re = [];
				for (var i = 0; i < json.length; i++) {
					var item = isJSON(json[0].body);
					if (item) {
						item.updated_at = json[0].updated_at;
						re.push(item)
					} else {
						Git.Comment.del("docfeng", "book-data", json[0].id);
					}
				}
				return re;
			});
		},
		put: function(json) {
			var id = json.id;
			if (!id) {
				return this.add(json);
			}
			var txt = JSON.stringify(json);
			return Git.Comment.put("docfeng", "book-data", id, txt).then(function(text) {
				return true;
			});
		},
		puAll: function(arr) {

		},
		read: function(name) {
			var t = this;
			return DB.Data.getKey("book", "list", name).then(function(json) {
				DB.DB.close();
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.getKey("book", "list", name).then(function(bool) {
						DB.DB.close();
						if (bool) {
							return bool;
						} else {
							return false;
						}
					}).catch(function(e) {
						DB.DB.close();
						alert("Book.List.read:\n" + e)
						return Promise.reject(e);
					});
				});
			});
		},
		readAll: function() {
			return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
				DB.DB.close();
				var json = json.reverse();
				return json;
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
				DB.DB.close();
				return t.createTable().then(function() {
					return DB.Data.put("book", "list", json).then(function(json) {
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
		writeAll: function(json) {
			var t = this;
			return DB.Table.select("book", "shelf").catch(function(e) {
				DB.DB.close();
				return t.createTable();
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
				if (!html) return Promise.reject("error no html");
				var charset = html.match(/charset=([^"]+)"/);
				charset = charset && charset[1].toLowerCase();
				switch (charset) {
					case "gbk":
					case "gb2312":
						return Promise.reject("error charset:" + charset)
						break;
					case "utf-8":
						return t.format(html, url);
						break;
					default:
						//return List.format(html,url);
						return Promise.reject("error charset:" + charset);
				}
			});
		},
		format: function(html, url) {
			var html=html.replace(/<img.*?>/g,"");
			var ele = document.createElement("html");
			ele.innerHTML = html;
			var b = document.createElement("base");
			b.href = url.getBaseUrl();
			document.head.appendChild(b);
			var a = [];
			var ul = ele.querySelectorAll("ul");
			for (var i = 0; i < ul.length; i++) {
				var _a = ul[i].querySelectorAll("a");
				if (_a.length > a.length) {
					a = _a;
				}
			}
			var ul = ele.querySelectorAll("dl");
			for (var i = 0; i < ul.length; i++) {
				var _a = ul[i].querySelectorAll("a");
				if (_a.length > a.length) {
					a = _a;
				}
			}
			var re = [];
			for (var i1 = 0; i1 < a.length; i1++) {
				re.push([a[i1].href, a[i1].innerHTML])
			}
			document.head.removeChild(b);
			if (re.length > 0) {
				return re;
			} else {
				return Promise.reject("err list.format: no re");
			}
		},
		getId: function() {
			return Git.Comment.create("docfeng", "book-data", 1, "test").then(function(text) {
				var json = JSON.parse(text)
				var id = json.id;
				return id;
			});
		},
		createTable: function() {
			alert("开始创建表格");
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
		multi: function(name,url) {
			var t = this;
			//alert(url)
			return t.read(name,url).then(function(txt) {
				if(txt){
					/* alert("read\n"+txt.txt)
					alert("read\n"+JSON.stringify(txt)) */
					return txt.txt;
				}else{
					return Promise.reject("no");;
				}
			}).catch(function() {
				return t.remote(url).then(function(txt) {
					if(txt){
						return txt;
					}else{
						return Promise.reject("no remote");;
					}
					
				});
			});
		},
		remote: function(url) {
			var t = this;
			return getHTML(url, "page").then(function(html) {
				//alert(html)
				if (html) {
					return t.format(html, url).then(function(txt) {
						return txt;
					}).catch(function(txt) {
						return txt;
					});
				} else {
					return Promise.reject(false);
				}
			});
		},
		read: function(name,url) {
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
			return Promise.resolve(txt);
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
			if(!txt)return Promise.reject(false);
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
				if(json){
					/* alert("read\n"+txt.txt)
					alert("read\n"+JSON.stringify(txt)) */
					//alert(json.arr)
					return json.arrA;
				}else{
					return Promise.reject("no");;
				}
			}).catch(function() {
				return t.remote(name).then(function(arr) {
					if(arr){
						return arr;
					}else{
						return Promise.reject("no remote");;
					}
				});
			});
		},
		remote: function(name) {
			var t=this;
			var url = "https://www.baidu.com/s?q1=" + name + "&rn=10";
			return getHTML(url, "search").then(function(html) {
				var html = eval(html);
				return t.format(html);
			});
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
				arr : arr
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
			var txt="";
			return Promise.resolve(txt);
		},
		format: function(html) {
			var t=this;
			var html=html.replace(/<img.*?>/g,"");
			var h = document.createElement("html");
			h.innerHTML = html;
			var d = h.getElementsByTagName("div");
			var re = [];
			var p = [];
			for (var i = 0; i < d.length; i++) {
				if (d[i].id >= 1) {
					var a = d[i].querySelector("a");
					re.push([a.href, a.innerHTML])
					p.push(this.checkCharset(a.href));
				}
			}
			return Promise.all(p).then(function(a) {
				var r = [];
				var p=[];
				for (var i =0;i< a.length; i++) {
					if(a[i]){
						r.push(re[i]);
						p.push(t.getRealPath(re[i][0],re[i][1]))
					}
				}
				
				return Promise.all(p);
			}).catch(function(a) {
				alert(a)
				return a;
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
				return false;
			});
		},
		getRealPath: function(url,title) {
			var para = {
				cors: true,
				corsUrl: "http://gear.docfeng.top/get2.php",
				xml: true
			};
			return http.get(url, para).then(function(json) {
				var url = json.xml.getResponseHeader("url");
				return [url,title];
			}).catch(function(a) {
				return a;
			});

		},
		createTable: function() {
			var data = {
				key: "name",
				index: {
					name: true,
					arr:false
				}
			};
			return DB.Table.create("book", "search", data);
		}
		
	}
	var download = {

	}
	return {
		"Shelf": Shelf,
		"List": List,
		"Page": Page,
		"Search": Search,
		"download": download
	};
})();

String.prototype.fill = function(arr) {
	var str = this
	for (var i = 0; i < arr.length; i++) {
		str = str.replace("%s", arr[i]);
	}
	return str;
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
