var book = (function() {
	var searchURL = "https://bird.ioliu.cn/v1/",
		checkURL = "",
		realURL = "http://gear.docfeng.top/get2.php",
		listURL = "https://bird.ioliu.cn/v2/",
		pageURL = "https://bird.ioliu.cn/v2/";
	var shelf = {

	}
	var list = {
		get: function(url) {
			return http.get(url, {
					cors: true,
					corsUrl: listURL
				})
				.then(function(html) {
					if (!html) return Promise.reject("error no html");
					var charset = html.match(/charset=([^"]+)"/);
					charset = charset && charset[1].toLowerCase();
					switch (charset) {
						case "gbk":
						case "gb2312":
							return Promise.reject("error charset:" + charset)
							break;
						case "utf-8":
							return list.format(html, url);
							break;
						default:
							//return list.format(html,url);
							return Promise.reject("error charset:" + charset);
					}
				});
		},
		format: function(html, url) {
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
	}
	var page = {
		multi: function(url) {
			var t = this;
			return t.read(url)
				.then(function(txt) {
					return txt;
				})
				.catch(function() {
					return t.get(url)
						.then(function(txt) {
							t.save(url, txt)
							return txt;
						});
				});
		},
		get: function(url) {
			var t = this;
			return http.get(url, {
					cors: true,
					corsUrl: pageURL
				})
				.then(function(html) {
					if (html) {
						return t.format(html, url)
							.then(function(txt) {
								return txt;
							})
							.catch(function(txt) {
								return txt;
							});
					} else {
						return Promise.reject(false);
					}
				});
		},
		read: function(url) {
			return new Promise(function(result, reject) {
				var txt = localStorage.getItem(url);
				if (txt) {
					result(txt);
				} else {
					reject(false);
				}
			});
		},
		save: function(url, txt) {
			return new Promise(function(result, reject) {
				localStorage.setItem(url, txt);
				result(true);
			});
		},
		show: function(txt) {
			var txt = "<p>" + txt.replace(/\n/g, '</p>\n<p>') + "</p>"
			document.querySelector("#txt").innerHTML = txt;
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
			//匹配下一章地址
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
			});
		}
	}
	var search = {
		get: function(name) {
			var url = "https://www.baidu.com/s?q1=" + name + "&rn=10";
			return http.get(url, {
					cors: true,
					corsUrl: searchURL
				})
				.then(function(html) {
					var html = eval(html);
					return search.format(html);
				});
		},
		format: function(html) {
			var h = document.createElement("html");
			h.innerHTML = html;
			var d = h.getElementsByTagName("div");
			var re = [];
			var p = [];
			for (var i = 0; i < d.length; i++) {
				if (d[i].id >= 1) {
					var a = d[i].querySelector("a");
					re.push([a.href, a.innerHTML])
					p.push(search.checkCharset(a.href));
				}
			}
			return Promise.all(p).then(function(a) {
				var r = [re, a];
				//alert(a.length)
				//alert(a[0])
				return r;
			}).catch(function(a) {
				alert(a)
				return a;
			});
		},
		checkCharset: function(url) {
			return list.get(url).then(function(a) {
				if (a) {
					//alert(a);
					return true;
				} else {
					return false;
				}
			}).catch(function(a) {
				return false;
			});
		},
		getRealPath: function(url) {
			return http.get(url, {
					cors: true,
					corsUrl: realURL,
					xml: true
				})
				.then(function(json) {
					var url = json.xml.getResponseHeader("url");
					return url;
				}).catch(function(a) {
					return a;
				});

		}
	}
	var download = {

	}
	var book = {
		"shelf": shelf,
		"list": list,
		"page": page,
		"search": search,
		"download": download
	};
	return book;
})()


book.search.get("唐残").then(function(arr) {
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
	book.search.getRealPath(url).then(function(url) {
		return book.list.get(url)
			.then(function(arr) {
				var url = arr[0][0];
				return book.page.get(url)
			}).then(function(txt) {
				alert(txt)
			}).catch(function(e) {

			});
		alert(e);
	})
}).catch(function(a) {
	alert(a)
});
