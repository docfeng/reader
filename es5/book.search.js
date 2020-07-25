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
			this.getRealPath(url).then(function(re){
				fj.tip("已获取目录数据，开始显示",1)
				var url=re[0];
				search_url.value=url;
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
				console.log(name,url,arr);
				Shelf.updateAt(name,url,arr).then(function(re){
					fj.tip("添加书本成功",2)
				}).catch(function(e){
					fj.tip("添加书本失败",2)
				})
				//UI.showList()
				List.write(name,arr);
				alert("name="+name+"\nurl="+url+"\narr:"+JSON.stringify(arr,null,4))
				window.history.go(-1);	
				setTimeout(function(){
					UI.showList();
				},1000);
			}).catch(function(e){
				alert("search.add:err:\n"+e)
			});
			
		    //f6_table.rows[i].innerHTML=`<tr><td><h4>${json[i][0]}</h4><h3>${json[i][1]}</h3></td></tr>`;
		}

	}
	