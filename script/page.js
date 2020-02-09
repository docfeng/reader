Page = {
	gets: function(url) {
		var t = this;
		return new Promise(function(result, reject) {
			var re = t.read(url);
			re.then(function(txt) {
				result(txt);
			});
			re.catch(function() {
				var re = t.get(url);
				re.then(function(txt) {
					t.save(url, txt)
					result(txt);
				})
				re.catch(function(e) {
					reject(e);
				})
			});
		});
	},
	get: function(url) {
		var t = this;
		return new Promise(function(result, reject) {
			getHTML(url).then(function(html) {
				if (html) {
					var re = t.format(html, url);
					re.then(function(txt) {
						result(txt);
					});
					re.catch(function(txt) {
						reject(txt);
					});
				} else {
					reject(false);
				}
			});
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
getHTML = function(url) {
	return http.get(url, {
		cors: true,
		corsUrl: "http://gear.docfeng.top/get2.php"
	});
}
/* var url = "https://www.biqugex.com/book_94452/453477216.html"
var re=Page.gets(url)
re.then(function(a) {
	alert(a)
})
re.catch(function(a) {
	alert(a)
}) */
window.addEventListener("load", function(e) {
	var url = "https://www.biqugex.com/book_94452/453477216.html"
	var re = Page.gets(url);
	re.then(function(txt) {
		Page.show(txt);
		alert(txt)
	})
	re.catch(function(e) {
		alert(e)
	})
}, false);
