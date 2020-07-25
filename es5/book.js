Book= {
	"deleteDB":function(){
		DB.DB.delete('book').then(function(a){
			alert('删除book数据库\n成功');
		}).catch(function(){
			alert('删除book数据库\n失败');
		})
	}
};
if(!Array.isArray){
	 Array.isArray=function(o){
		 return Object.prototype.toString.call(o)== '[object Array]';
	 }
}
Array.inArray=function(search,array){
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}
var getHTML = (function(a){
	var localModel = "";
	APP.get("localModel").then(function(re){
		localModel=re;
	})
	return function(url, para) {
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
})()
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
