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
		_read: function(name) {
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
		_write: function(json) {
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
		read: function(name) {
			var t = this;
			return this._read(name).then(function(json) {
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
			return this._write(json);
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
						alert("sss"+re);
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
				//Page.resize()
				window.page(i)
			});
			
			UI.showPage();
		},
		
		update: function(url) {
			fj.tip("开始更新");
			var arr = Book.listarr;
			var name = Book.name;
			var json = Book.json;
			json.url=url||Book.url;
			
			if (!url || !arr) {
				fj.tip("参数错误：\nurl:" + url + "\narr:" + arr, 2)
				return false
			}
			var t = this;
			this.remote(url).then(function(_arr) {
				if (_arr.length == arr.length) {
					fj.tip("目前没有新更新", 1.5);
				} else {
					arr = Book.listarr = _arr;
					t.showarr(arr);
					t.write(name, arr).then(function(re) {
						fj.tip("List写入成功")
					}).catch(function(e) {
						fj.tip("List写入失败" + e)
					})
		
					var title = arr[arr.length - 1][1];
					var url = arr[arr.length - 1][0];
					
					fj.tip("已更新" + title, 2);
					listNew.innerText = title;
					
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
