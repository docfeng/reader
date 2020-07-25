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
		},
		preArr:[],
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
				if(i2<arr.length&&!this.preArr[i2]){
					this.preArr[i2]=true;
					this.preread(i2);
				}
			}
			return this.multi(name, title,url);
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
			return this.multi(name,title, url);
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
			//document.querySelector("#listDiv2").style.display="flex";
			fj("#listDiv2").show()
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
	