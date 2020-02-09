
String.prototype.getFullUrl=function(url1){
   var re="";
   //alert(this)
   //alert(url1)
   var url=url1.match(/(http[s]?:\/\/[^\/]*?)\//);
   var path=url1.match(/http[s]?:.*\//);
   if(url)
   {
    var root_url=url[1];
   }else{
      url=url1.match(/(http:\/\/[^\/]*?)\//);
   }
   
   var url2=this.replace(/ /g,'');
   switch(url2.slice(0,1)){
       case "/":
         re=root_url+url2;
         break;
       case ".":
         re=url1+url2;
         break;
       default :
         if(url2.slice(0,4)=="http"){
           re=url2;
         }else{re=path+url2;}
   }
   return re;
}

String.prototype.getBaseUrl=function(){
    return this.match(/(https?:\/\/[^\/]*?)\//)[1];
}

String.prototype.matches=function(reg){
    var reg=eval("("+reg+")");
    var str=this;
    var re=[];
    do
    {
      var r=reg.exec(str);
      if(r){
          r.shift()
          re[re.length]=r;
      }
    }
    while (r!=null) 
    return re;
}
String.prototype.toIndex=function(){
	var num=this.match(/第(.*?)章/);
	if(num){
		var num=num[1].toNum();
	}else{num=0;}
	return num;
}
String.prototype.toNum=function(){
    var num=parseInt(this);
    var to_num=function(str){
        switch(str){
            case "零":return 0;break;
            case "一":return 1;break;
            case "两":return 2;break;
            case "二":return 2;break;
            case "三":return 3;break;
            case "四":return 4;break;
            case "五": return 5;break;
            case "六":return 6;break;
            case "七":return 7;break;
            case "八":return 8;break;
            case "九":return 9;break;
            default :return 0;
        }
    }
    if(num>=0){return num;}
    var num=0;
    var str=this;
    str=str.replace("零","");
    if(str.match("千")){
        var _str=str.split("千");
        num=num+to_num(_str[0])*1000;
        str=_str[1];
    }
    if(str.match("百")){
        var _str=str.split("百");
        num=num+to_num(_str[0])*100;
        str=_str[1];
    }
    if(str.match("十")){
        var _str=str.split("十");
        var ten=to_num(_str[0]);
        ten=ten==0?1:ten;
        num=num+ten*10;
        str=_str[1];
    }
        num=num+to_num(str);
        return num;
}

/* Array.prototype.add=function(i,arr){
    var a=this
    return a.slice(0,i).concat(arr,a.slice(i));
}

Array.prototype.del=function(i){
  var arr1=this.slice(0,i)
  var arr2=this.slice(i)
  arr2.shift();
  return arr1.concat(arr2);
} */


//两个字符串的相似程度，并返回相差字符个数
strSimilarity2Number=function(s, t){
	var n = s.length, m = t.length, d=[];
	var i, j, s_i, t_j, cost;
	if (n == 0) return m;
	if (m == 0) return n;
	for (i = 0; i <= n; i++) {
		d[i]=[];
		d[i][0] = i;
	}
	for(j = 0; j <= m; j++) {
		d[0][j] = j;
	}
	for (i = 1; i <= n; i++) {
		s_i = s.charAt (i - 1);
		for (j = 1; j <= m; j++) {
			t_j = t.charAt (j - 1);
			if (s_i == t_j) {
				cost = 0;
			}else{
				cost = 1;
			}
		d[i][j] = Minimum (d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + cost);
		}
	}
	return d[n][m];
}
//两个字符串的相似程度，并返回相似度百分比
strSimilarity2Percent=function(s, t){
	var l = s.length > t.length ? s.length : t.length;
	var d = strSimilarity2Number(s, t);
	return (1-d/l).toFixed(4);
}
Minimum=function(a,b,c){
	return a<b?(a<c?a:c):(b<c?b:c);
}

String.prototype.fill = function(arr) {
	var str = this
	for (var i = 0; i < arr.length; i++) {
		str = str.replace("%s", arr[i]);
	}
	return str;
}
//获取自定义时间格式
var formatDate = function(d) {
	var date = d || new Date()
	var yyyy = date.getFullYear();
	var mm = date.getMonth() + 1;
	var dd = date.getDate();
	var hours = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	hours = hours < 10 ? "0" + hours : hours;
	minute = minute < 10 ? "0" + minute : minute;
	second = second < 10 ? "0" + second : second;
	date = yyyy + "-" + mm + "-" + dd + " " + hours + ":" + minute + ":" + second;
	return date;
}
var formatUTCDate = function(d) {
	var date = d || new Date()
	var yyyy = date.getUTCFullYear();
	var mm = date.getUTCMonth() + 1;
	var dd = date.getUTCDate();
	var hours = date.getUTCHours();
	var minute = date.getUTCMinutes();
	var second = date.getUTCSeconds();
	date = yyyy + "-" + mm + "-" + dd + "T" + hours + ":" + minute + ":" + second + "Z";
	return date;
}

//定义静态变量
/* static=new Proxy({},{
  get:function(oTarget, sKey){
    var re=arguments.callee.caller[sKey];
    return re;
  },
  set:function(oTarget, sKey, vValue){
    arguments.callee.caller[sKey]=vValue;
  } 
}); */
//动态加载js
includejs=function(src,bool){
	var bool=bool||true;
  if(bool){
    var oHead = document.getElementsByTagName('HEAD').item(0);
            var oScript= document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src=src; 
            oHead.appendChild( oScript);
  }else{
    var js=gettext(src);
    eval(js);
  } 
}
//动态加载css
includecss=function(src){
            var oHead = document.getElementsByTagName('HEAD').item(0);
            var oLink= document.createElement("link");
            oLink.type = "text/css";
            oLink.rel = "stylesheet";
            oLink.href=src; 
            oHead.appendChild( oLink); 
}
        
/*导入模块
  var [c,b]=include("script/model1");
*/
include=function(url){
  var str=gettext(url+".js");
  return new Function(str)();
}


hash=function(){
    var re={};
    var hash=location.hash.replace("#","").split(";");
    for(var i=0;i<hash.length;i++){
        var h=hash[i].split("="); 
        re[h[0]]=h[1];
    }
    return re;
}

window.onerror = function(sMessage, sUrl, sLine) {
     alert("发生错误！\n" + sMessage + "文件:" + sUrl + "\n 行号:" + sLine);
     return true;
}

var browser = (function () {
    var u = navigator.userAgent;
    return {//移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        UCBrowser: u.indexOf('UCBrowser') > -1, //UC浏览器
        MyApp: u.indexOf('MyApp001') > -1, //我的程序
        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
})();

evt = {
	num: 0,
	fun:{},
	/* async */
	handleEvent:function(e) {
		var type = e.eventType;
		var fun = this.fun[type];
		var t=this;
		if (fun) {
			var re=fun();
			if (re) {
				delete t.fun[type];
			}
		};
		if(type!="onback"){
			window.history.replaceState(null, null, '');
		}
		//alert(type)
		window.history.pushState('forward', null, '');
		
	},
	remove:function() {
		window.removeEventListener("back", this, false);
	},
	set:function(state, fun) {
		window.history.replaceState(state, null, '');
		window.history.pushState('forward', null, '');
		//this.state.push(state);
		this.fun[state] = fun;
	},
	addEvent:function(fun) {
		var state = "event" + this.num;
		this.num++;
		window.history.replaceState(state, null, '');
		window.history.pushState('forward', null, '');
		//this.state.push(state);
		this.fun[state] = fun;
		return state
	},
	removeEvent:function(state) {
		if (this.fun[state]) {
			delete this.fun[state];
			//window.history.go(-1)
		}
	},
	fireEvent:function(state) {
		var event = document.createEvent('HTMLEvents');
		event.initEvent("back", true, true);
		event.eventType = state;
		document.dispatchEvent(event);
	}
}

window.addEventListener('back', evt, false);

if (window.history && window.history.pushState&&window.top==window) {
	window.addEventListener('popstate', function(e) {
		var state = e.state;
		//alert(window.history.state)
		if(!state){
			window.history.go(-1);
		}else if (typeof state == "string") {
			//alert(state)
			evt.fireEvent(state);
		} else {
			alert(JSON.stringify(state))
		}
	}, false);
	if(!window.history.state){
		window.history.replaceState('onback', null, '');
		window.history.pushState('forward', null, '');
	}
}

/* fullScreen = function(obj) {
	var el = obj || document.documentElement;
	var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
	if (typeof rfs != "undefined" && rfs) {
		rfs.call(el);
	};
	return;
} */
//退出全屏
exitScreen = function() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
	if (typeof cfs != "undefined" && cfs) {
		cfs.call(el);
	}
}
//evt.addEvent(function(){document.querySelector("#contextmenu").style.display="none";})var a=function(){/**
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
			var t = this;
			return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
				DB.DB.close();
				var json = json.reverse();
				Book.arr=json;
				return json;
			}).catch(function(e) {
				DB.DB.close();
				return t.ini().then(function() {
					return DB.Data.getIndex("book", "shelf", "readAt", null).then(function(json) {
						DB.DB.close();
						Book.arr=json;
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
				});
				

			} else {
				t.write(json);
				return Git.Comment.put("docfeng", "book-data", json.id, JSON.stringify(json, null, 4));
			}
		},
		readAt:function(name,title,url,index){
			//保存记录
			if(!Book.json||Book.json.name!=name){
				var t=this;
				alert(name)
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
			fj.tip("开始创建表格");
			return Promise.all([this.createShelfTable(), this.createListTable(), this.createPageTable()]);
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
				return DB.Table.has("book", "list").then(function(foo1) {

					return false;
				}).catch(function(e) {
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
				})
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
			/* var ele = document.createElement("html");
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
				var title=a[i1].innerHTML
				var m=title.match(/<[^>]*?>([^<]*?)</);
				if(m){
					title-m[0];
				}
				re.push([a[i1].href, title])
			}
			document.head.removeChild(b); */
			
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
			return getHTML(url, "real").then(function(json) {
				var url = json.xml.getResponseHeader("url");
				url = url || json.xml.responseURL;
				var arr = List.format1(json.html, url);
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
/**
 * es5
 * v1.0
 * 
 * DB{open,names,delete,close}
 * open_db(name)  打开数据库 return:false 失败;create新建;open 打开
 * open(name)  打开数据库 return:false 失败;create新建;open 打开
 * names(name) 获取数据库所以表名称;return array
 * delete(name) 删除数据库 return true false
 * close() 关闭数据库 return true;
 * 
 * Table{create,select,clear,delete}
 * create(db_name, store_name, json)创建数据表 name 名称 
 * 		json {key:"name",index:{name:true,val:false}}
 * 		return:false 失败;create新建;open 打开
 * select(db_name, store_name) 选择数据表 return true false;
 * clear(db_name, store_name) 清空数据表
 * delete(db_name, store_name) 删除数据表
 * 
 * Data{add,put,delet,count,getAll,getKey,getIndex,getIndexKeys}
 * add(db_name, store_name, json, key)修改key值
 * put(db_name, store_name, json, key?)添加修改key return true false
 * delete(db_name, store_name, key)删除key
 * count(db_name, store_name)记录数量
 * getAll(db_name, store_name)获取全部记录
 * getKey(db_name, store_name, key) return json
 * getIndex(db_name, store_name, index_name,index_value) 
 * getIndexKeys(db_name, store_name, index_name,index_value)
 * 
 * getcursor
 * update_cursor
 *       db1.update_cursor({name:777},function(cursor){
          if(cursor.value.val==9990){return {name:777,value:888};}
          return false;
        }).then(function(re){alert(re)});
 * 
 * delete_cursor
 * 
 */

DB = (function() {
	var P = function(request) {
		return new Promise(function(resolve, reject) {
			request.onsuccess = function() {
				resolve(request.result);
			};
			request.onerror = function(event) {
				reject(event);
			}
		});
	}
	var DB = {
		open_db: function(db_name) {
			this.db_name = db_name;
			if (!window.indexedDB) {
				window.alert("你的浏览器不支持IndexDB,请更换浏览器");
				return Promise.reject("你的浏览器不支持IndexDB,请更换浏览器");;
			}
			var request = indexedDB.open(db_name);
			var t = this;
			return new Promise(function(resolve, reject) {
				var status = false;
				//打开数据失败
				request.onerror = function(event) {
					alert("不能打开数据库,错误代码: " + event.target.errorCode);
					reject("不能打开数据库,错误代码: " + event.target.errorCode);
				};
				//打开数据库
				request.onsuccess = function(event) {
					//此处采用异步通知. 在使用curd的时候请通过事件触发
					var db=t.db = this.result;
					resolve(db)
					/* if (status) {
						resolve("create");
					} else {
						resolve("open");
					} */
				};
				request.onupgradeneeded = function(a) {
					status = true;
					/* var db = this.result;
					if (!db.objectStoreNames.contains("test")) {
						var store = db.createObjectStore("test", {
							keyPath: "name"
						});
						store.createIndex("name", "name", {
							unique: true
						});
						store.createIndex("val", "val");
						//store.put({name: "Quarry Memories", val: "Fred", isbn: 123456});
						//store.put({name: "Water Buffaloes", val: "Fred", isbn: 234567});
						// store.put({name: "Bedrock Nights", val: "Barney", isbn: 345678});
					} */
				}
			});
		},
		open: function(name) {
			return this.open_db(name).then(function(db) {
				return db;
			});
		},
		names: function(db_name) {
			return this.open(db_name).then(function(db) {
				var names = db.objectStoreNames;
				var re = [];
				for (var i = 0; i < names.length; i++) {
					re.push(names.item(i));
				}
				return re;
			});
		},
		delete: function(name) {
			var request = indexedDB.deleteDatabase(name);
			return new Promise(function(resolve, reject) {
				//删除数据失败
				request.onerror = function(event) {
					alert("不能删除数据库,错误代码: " + event.target.errorCode);
					reject(false);
				};
				//删除数据库
				request.onsuccess = function(event) {
					resolve(true);
				};
			});
		},
		close: function() {
			this.db.close();
			return true;
		},
	}
	var Table={
		create: function(db_name, store_name, json) {//json:{key:string,index:{name:bool,...}}
			return DB.open(db_name).then(function(db) {
				var version = db.version + 1;
				db.close();
				return version;
			}).then(function(version) {
				var request = indexedDB.open(db_name, version);
				return new Promise(function(resolve, reject) {
					var status = "";
					request.onerror = function(event) {
						reject("不能打开数据库,错误代码: " + event.target.errorCode);
					};
					request.onsuccess = function(event) {
						this.result.close();
						if (status) {
							resolve("create");
						}
						resolve("open");
					};
					request.onupgradeneeded = function(a) {
						status = true;
						var db = this.result;
						if (!db.objectStoreNames.contains(store_name)) {
							var store = db.createObjectStore(store_name, {
								keyPath: json.key
							});
							if (json.index) {
								for (var key in json.index) {
									if (!store.indexNames.contains(key)) {
										store.createIndex(key, key, {
											unique: json.index[key]
										});
									}
								}
							}
						}
					}
				});
			});
		},
		select: function(db_name, store_name) {
			return DB.open(db_name).then(function(db) {
				if (db.objectStoreNames.contains(store_name)) {
					var store = db.transaction(store_name, "readwrite").objectStore(store_name);
					return store;
				} else {
					return Promise.reject(false);
				}
			});
		},
		clear: function(db_name, store_name) {
			return this.select(db_name, store_name).then(function(store) {
				var request = store.clear();
				DB.close();
				return P(request);
			});
		},
		delete: function(db_name, store_name) {
			return DB.open(db_name).then(function(db) {
				var version = db.version + 1;
				db.close();
				return version;
			}).then(function(version) {
				var request = indexedDB.open(db_name, version);
				return new Promise(function(resolve, reject) {
					request.onupgradeneeded = function(a) {
						var db = this.result;
						var request = db.deleteObjectStore(store_name);
						this.result.close();
						resolve(true);
					}
				});
			});
		},
		has: function(db_name, store_name) {
			return DB.open(db_name).then(function(db) {
				if (db.objectStoreNames.contains(store_name)) {
					db.close();
					return true;
				} else {
					db.close();
					return Promise.reject(false);
				}
			});
		},
		
	}
	var Data={
		add: function(db_name, store_name, json, key) {
			return Table.select(db_name, store_name).then(function(store) {
				var request = store.add(json, key);
				return P(request);
			});
		},
		put: function(db_name, store_name, json, key) {
			return Table.select(db_name, store_name).then(function(store) {
				if (key) {
					var request = store.put(json, key);
				} else {
					var request = store.put(json);
				};
				return P(request);
			});
		},
		delete: function(db_name, store_name, key) {
			return Table.select(db_name, store_name).then(function(store) {
				var request = store.delete(key);
				return P(request);
			});
		},
		count: function(db_name, store_name) {
			return Table.select(db_name, store_name).then(function(store) {
				var request = store.count();
				return P(request);
			});
		},
		getAll: function(db_name, store_name) { //return json;
			return Table.select(db_name, store_name).then(function(store) {
				var request = store.getAll();
				return P(request);
			});
		},
		getKey: function(db_name, store_name, key) { //return item=>json;
			return Table.select(db_name, store_name).then(function(store) {
				if (key) {
					var request = store.get(key);
				} else {
					var request = store.getAll();
				}
				return P(request);
			});
		},
		getIndex: function(db_name, store_name, index_name,index_value) { //return items=>array[{key:value}]
			return Table.select(db_name, store_name).then(function(store) {
				var index = store.index(index_name);
				var request = index.getAll(index_value);
				return P(request);
			});
		},
		getIndexKeys: function(db_name, store_name, index_name,index_value) { //return items=>array[key]
			return Table.select(db_name, store_name).then(function(store) {
				var index = store.index(index_name);
				var request = index.getAllKeys(index_value);
				return P(request);
			});
		},
	}
	
	var Cursor={
		get: function(db_name, store_name, json) {
			return Table.select(db_name, store_name).then(function(store) {
				if (json) {
					for (var key in json) {
						var index = store.index(key);
						var request = index.openCursor(IDBKeyRange.only(json[key]));
					}
				} else {
					var request = store.getAll(); //getAllKeys
				}
				return new Promise(function(resolve){
					var re = [];
					request.onsuccess = function() {
						var cursor = request.result;
						if (cursor) {
							//alert(cursor.primaryKey)//key
							//cursor.delete();
							//request = cursor.update(updateData);
							re[re.length] = cursor.value;
							cursor.continue();
						} else {
							resolve(re);
						}
					}
					request.onerror = function(event) {
						resolve(event);
					}
				});
			});
		},
		update: function(db_name, store_name, json, fun) {
			return Table.select(db_name, store_name).then(function(store) {
				if (json) {
					for (var key in json) {
						var index = store.index(key);
						var request = index.openCursor(IDBKeyRange.only(json[key]));
					}
				} else {
					var request = store.getAll(); //getAllKeys
				}
				return new Promise(function(resolve){
					var i = 0;
					request.onsuccess = function() {
						var cursor = request.result;
						if (cursor) {
							var data = fun(cursor);
							if (data) {
								var  request = cursor.update(data);
								i++;
							}
							cursor.continue();
						} else {
							resolve(i);
						}
					}
					request.onerror = function(event) {
						resolve(event);
					}
				});
			});
		},
		delete: function(db_name, store_name, json) {
			return Table.select(db_name, store_name).then(function(store) {
				if (json) {
					for (var key in json) {
						var index = store.index(key);
						var request = index.openCursor(IDBKeyRange.only(json[key]));
					}
				} else {
					var request = store.getAll(); //getAllKeys
				}
				return new Promise(function(resolve){
					var i = 0;
					request.onsuccess = function() {
						var cursor = request.result;
						if (cursor) {
							var request = cursor.delete();
							request.onsuccess = function() {
								// i++;
							};
							++i;
							cursor.continue();
						} else {
							resolve(i);
						}
					}
					request.onerror = function(event) {
						resolve(event);
					}
				});
			});
		}
	}
	
	return {"DB":DB,"Data":Data,"Cursor":Cursor,"Table":Table};
})();

var tttttt = function() {
	DB.Data.getAll("store", "store").then(function(json) {
		alert(json)
		alert(JSON.stringify(json[3]))
		DB.close();
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Data.getKey("store", "store", "Shelf/小额灵魂交易所/page11.txt").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Data.delete("store", "store", "Shelf/小额灵魂交易所/page11.txt").then(function(json) {
		alert(true)
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	var data={name:"ttt",val:"test"}
	DB.Data.put("store", "store", data).then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Data.getIndex("store", "store", "val","test").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Data.getIndex("store", "store", "val",null).then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Table.delete("store", "test").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Table.clear("store", "test2").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Table.delete("store", "用户").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	var data={
		key:name,
		index:{name:true,id:true}
	}
	DB.Table.create("store", "test",data).then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Table.select("store", "test").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	 
}
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.ES6Promise=e()}(this,function(){"use strict";function t(t){var e=typeof t;return null!==t&&("object"===e||"function"===e)}function e(t){return"function"==typeof t}function n(t){I=t}function r(t){J=t}function o(){return function(){return process.nextTick(a)}}function i(){return"undefined"!=typeof H?function(){H(a)}:c()}function s(){var t=0,e=new V(a),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}function u(){var t=new MessageChannel;return t.port1.onmessage=a,function(){return t.port2.postMessage(0)}}function c(){var t=setTimeout;return function(){return t(a,1)}}function a(){for(var t=0;t<G;t+=2){var e=$[t],n=$[t+1];e(n),$[t]=void 0,$[t+1]=void 0}G=0}function f(){try{var t=require,e=t("vertx");return H=e.runOnLoop||e.runOnContext,i()}catch(n){return c()}}function l(t,e){var n=arguments,r=this,o=new this.constructor(p);void 0===o[et]&&k(o);var i=r._state;return i?!function(){var t=n[i-1];J(function(){return x(i,o,t,r._result)})}():E(r,o,t,e),o}function h(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(p);return g(n,t),n}function p(){}function v(){return new TypeError("You cannot resolve a promise with itself")}function d(){return new TypeError("A promises callback cannot return that same promise.")}function _(t){try{return t.then}catch(e){return it.error=e,it}}function y(t,e,n,r){try{t.call(e,n,r)}catch(o){return o}}function m(t,e,n){J(function(t){var r=!1,o=y(n,e,function(n){r||(r=!0,e!==n?g(t,n):S(t,n))},function(e){r||(r=!0,j(t,e))},"Settle: "+(t._label||" unknown promise"));!r&&o&&(r=!0,j(t,o))},t)}function b(t,e){e._state===rt?S(t,e._result):e._state===ot?j(t,e._result):E(e,void 0,function(e){return g(t,e)},function(e){return j(t,e)})}function w(t,n,r){n.constructor===t.constructor&&r===l&&n.constructor.resolve===h?b(t,n):r===it?(j(t,it.error),it.error=null):void 0===r?S(t,n):e(r)?m(t,n,r):S(t,n)}function g(e,n){e===n?j(e,v()):t(n)?w(e,n,_(n)):S(e,n)}function A(t){t._onerror&&t._onerror(t._result),T(t)}function S(t,e){t._state===nt&&(t._result=e,t._state=rt,0!==t._subscribers.length&&J(T,t))}function j(t,e){t._state===nt&&(t._state=ot,t._result=e,J(A,t))}function E(t,e,n,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=e,o[i+rt]=n,o[i+ot]=r,0===i&&t._state&&J(T,t)}function T(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,o=void 0,i=t._result,s=0;s<e.length;s+=3)r=e[s],o=e[s+n],r?x(n,r,o,i):o(i);t._subscribers.length=0}}function M(){this.error=null}function P(t,e){try{return t(e)}catch(n){return st.error=n,st}}function x(t,n,r,o){var i=e(r),s=void 0,u=void 0,c=void 0,a=void 0;if(i){if(s=P(r,o),s===st?(a=!0,u=s.error,s.error=null):c=!0,n===s)return void j(n,d())}else s=o,c=!0;n._state!==nt||(i&&c?g(n,s):a?j(n,u):t===rt?S(n,s):t===ot&&j(n,s))}function C(t,e){try{e(function(e){g(t,e)},function(e){j(t,e)})}catch(n){j(t,n)}}function O(){return ut++}function k(t){t[et]=ut++,t._state=void 0,t._result=void 0,t._subscribers=[]}function Y(t,e){this._instanceConstructor=t,this.promise=new t(p),this.promise[et]||k(this.promise),B(e)?(this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?S(this.promise,this._result):(this.length=this.length||0,this._enumerate(e),0===this._remaining&&S(this.promise,this._result))):j(this.promise,q())}function q(){return new Error("Array Methods must be provided an Array")}function F(t){return new Y(this,t).promise}function D(t){var e=this;return new e(B(t)?function(n,r){for(var o=t.length,i=0;i<o;i++)e.resolve(t[i]).then(n,r)}:function(t,e){return e(new TypeError("You must pass an array to race."))})}function K(t){var e=this,n=new e(p);return j(n,t),n}function L(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function N(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function U(t){this[et]=O(),this._result=this._state=void 0,this._subscribers=[],p!==t&&("function"!=typeof t&&L(),this instanceof U?C(this,t):N())}function W(){var t=void 0;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var n=t.Promise;if(n){var r=null;try{r=Object.prototype.toString.call(n.resolve())}catch(e){}if("[object Promise]"===r&&!n.cast)return}t.Promise=U}var z=void 0;z=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var B=z,G=0,H=void 0,I=void 0,J=function(t,e){$[G]=t,$[G+1]=e,G+=2,2===G&&(I?I(a):tt())},Q="undefined"!=typeof window?window:void 0,R=Q||{},V=R.MutationObserver||R.WebKitMutationObserver,X="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),Z="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,$=new Array(1e3),tt=void 0;tt=X?o():V?s():Z?u():void 0===Q&&"function"==typeof require?f():c();var et=Math.random().toString(36).substring(16),nt=void 0,rt=1,ot=2,it=new M,st=new M,ut=0;return Y.prototype._enumerate=function(t){for(var e=0;this._state===nt&&e<t.length;e++)this._eachEntry(t[e],e)},Y.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===h){var o=_(t);if(o===l&&t._state!==nt)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===U){var i=new n(p);w(i,t,o),this._willSettleAt(i,e)}else this._willSettleAt(new n(function(e){return e(t)}),e)}else this._willSettleAt(r(t),e)},Y.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===nt&&(this._remaining--,t===ot?j(r,n):this._result[e]=n),0===this._remaining&&S(r,this._result)},Y.prototype._willSettleAt=function(t,e){var n=this;E(t,void 0,function(t){return n._settledAt(rt,e,t)},function(t){return n._settledAt(ot,e,t)})},U.all=F,U.race=D,U.resolve=h,U.reject=K,U._setScheduler=n,U._setAsap=r,U._asap=J,U.prototype={constructor:U,then:l,"catch":function(t){return this.then(null,t)}},U.polyfill=W,U.Promise=U,U});if(!window.Promise){ES6Promise.polyfill()}fj = (function() {
	if (!document.querySelector("#msg_box")) {
		/* var style = document.createElement("style");
		style.id = "msg_box"
		style.type = "text/css";
		style.innerHTML =``;
		document.getElementsByTagName("HEAD").item(0).appendChild(style); */
	}
	var createBox = function(code, fun, cancelFun) {
		var win = document.createElement("div");
		win.classList.add("Dialog");
		//win.style.display = "block";
		document.body.appendChild(win);
		var s = evt.addEvent(function(a) {
			document.body.removeChild(win);
			win = null;
			cancelFun && cancelFun();
			return true;
		});
		win.innerHTML = code;
		fun && fun(win, s);
	}
	var obj = [];
	var createWin = function() {
		var obj = {};
		var win = document.createElement("div");
		var box = document.createElement("div");
		var header = document.createElement("div");
		var section = document.createElement("div")
		var footer = document.createElement("div");
		var certain = document.createElement("input");
		var cancel = document.createElement("input");

		win.classList.add("Dialog");
		box.classList.add("contain");
		header.classList.add("header");
		section.classList.add("body");
		footer.classList.add("footer");

		certain.type = "button";
		cancel.type = "button";
		certain.value = "确定";
		cancel.value = "取消";

		box.addEventListener("click", function(e) {
			var event = e || window.event;
			event.stopPropagation();
		}, false);

		var s = evt.addEvent(function(a) {
			document.body.removeChild(win);
			obj.cancel();
			obj = null;
			win = null;
			return true;
		});

		certain.onclick = function(a) {
			evt.removeEvent(s);
			document.body.removeChild(win);
			win = null;
			obj.certain()
			obj = null;
		}

		cancel.onclick = function(a) {
			evt.removeEvent(s);
			document.body.removeChild(win);
			win = null;
			obj.cancel();
			obj = null;
		}

		win.onclick = function(a) {
			evt.removeEvent(s);
			document.body.removeChild(win);
			win = null;
			obj.cancel();
			obj = null;
		};
		footer.append(cancel, certain);
		box.append(header, section, footer);
		win.appendChild(box);
		win.style.display = "block";
		//alert(name)
		document.body.appendChild(win);

		obj.win = win;
		obj.section = section;
		obj.header = header;

		box = null;
		section = null;
		header = null;
		footer = null;
		certain = null;
		cancel = null;

		return obj;
	}
	
	var querySelector=function(query){
		switch (typeof query){
			case "string":
				this.obj=document.querySelector(query);
				break;
			case "object":
				this.obj=query;
				break;
			default:
				break;
		}
		this.hide=function(a){
			this.obj.style.visibility="hidden";
		}
		this.show=function(a){
			this.obj.style.visibility='visible';
		}
		this.toggle=function(a){
			this.obj.style.visibility=window.getComputedStyle(this.obj,null).visibility=="hidden"?"visible":"hidden";
		}
	}


	var $ = function(query){
		return new querySelector(query);
	}
	$.createBox = createBox;
	$.createWin = function(name, html, fun) {
		var code =
			'\
          <div class="contain type-2" onclick="window.event.stopPropagation();">\
              <div class="header">\
				<div class="title">%s</div>\
				<div class="close">X</div>\
			</div>\
              <div class="body">\
                  %s\
              </div>\
              <div class="footer">\
                  <div class="ok">确定</div>\
                  <div class="no">取消</div>\
              <div>\
          </div>\
              '.fill([name, html]);
		var iniFun = function(obj, s) {
			obj.onclick = obj.querySelector(".no").onclick = function() {
				evt.removeEvent(s);
				obj.parentNode.removeChild(obj);
				fun.cancel();
				obj = null;
			}
			obj.querySelector(".ok").onclick = function(a) {
				evt.removeEvent(s);
				obj.parentNode.removeChild(obj);
				fun.certain(obj);
				obj=null;
			}
			fun.ini(obj)
		}
		var cancelFun = function() {
			fun.cancel();
		}
		$.createBox(code, iniFun, cancelFun);
	}
	$.iframe = function(url) {
		var code = '<iframe style="width:100%;height:100%;background:white;" url="'+url+'"></iframe>';
		var iniFun = function(obj) {
			obj.querySelector("iframe").contentWindow.location.href = url;
			fullScreen(obj);
		}
		this.createBox(code, iniFun);
	}
	$.select = function(name, data, index) {
		var obj = createWin()
		var section = obj.section;
		var win = obj.win;
		var re = index ? data[index] : data[0];
		var d = document.createElement("div");
		d.classList.add("select_box");
		obj.header.innerHTML = name;
		d.onclick = function(e) {
			var ele = e.srcElement;
			if (ele == d) return;
			re = ele.innerHTML;
		}
		for (var i = 0; i < data.length; i++) {
			var a = data[i];
			var s = document.createElement("div")
			s.innerHTML = a;
			d.appendChild(s);
		}
		section.appendChild(d);

		return new Promise(function(resolve) {
			obj.certain = function(a) {
				resolve(re);
			}

			obj.cancel = function(a) {
				resolve(false);
			}
		});
	}
	/**
	 * @param {String} name
	 * @param {Array} data
	 * @param {Number} index
	 */
	$.select = function(name, data, index, bool) {
		return new Promise(function(resolve) {
			var html = ""
			for (var i = 0; i < data.length; i++) {
				var a = data[i];
				html += '<div class="item" data-index='+i+'>'+a+'</div>';
			}
			var code = '<div class="select_box">'+html+'</div>';
			var fun = {};
			fun.cancel = function() {
				resolve(false);
			}
			fun.certain = function(obj) {
				var re=[];
				var o=obj.querySelector(".select_box").querySelectorAll(".selected");
				for(var i=0;i<o.length;i++){
					re.push(o[i].innerHTML)
				}
				if(!bool)re=re[0]||false;
				resolve(re);
			}
			fun.ini = function(obj) {
				obj.querySelector(".select_box").onclick = function(e) {
					var ele = e.srcElement;
					if (ele == this) return;
					if(!bool){
						//单选
						var o=obj.querySelector(".select_box").querySelectorAll(".item");
						for(var i=0;i<o.length;i++){
							o[i].classList.remove("selected");
						}
						ele.classList.add("selected");
					}else{
						//多选  未完成
						ele.classList.toggle("selected");
					}
				}
			}
			$.createWin(name, code, fun);
		});
	}
	/**
	 * @param {String} title
	 * @param {Array} arr
	 */
	$.input = function(title,arr) {
		var re = {};
		var obj = createWin()
		var section = obj.section;
		var header=obj.header;
		header.innerHTML=title||"";
		var win = obj.win;
		for (var i = 0; i < arr.length; i++) {
			var a = arr[i];
			var name = a[0];
			var data = a[1];
			var value = "";
			var dataList = ""; //a[2];
			if (data) {
				if (data instanceof Array) {
					if (a[2] && typeof a[2] == "number") {
						value = data[a[2]];
					} else {
						value = data[0];
					}
					dataList = data;
				} else {
					value = data;
				}
			}
			var d = document.createElement("div")
			d.innerHTML = name;
			re[name] = value || "";
			var text = document.createElement("input");
			text.type = "text";
			text.value = value || "";
			text.oninput = function(e) {
				re[name] = text.value;
			}
			d.appendChild(text);
			if (dataList) {
				var s = document.createElement("input");
				s.type = "button";
				s.value = "选择";
				s.onclick = function(e) {
					$.select(name, dataList, 0).then(function(r){
						text.value = r;
						re[name] = r;
					})
					//alert(r)
				}
				d.appendChild(s);
			}
			section.appendChild(d);
		}

		return new Promise(function(resolve) {
			obj.certain = function(a) {
				resolve(re);
			}

			obj.cancel = function(a) {
				resolve(false);
			}
		});
	}

	$.addBottomEvent = (function() {
		var fun;
		var Y = 0;
		var Y2 = 0;
		var time;
		var u = {
			//切换事件
			handleEvent: function(e) {
				switch (e.type) {
					case "touchstart":
						this.start(e);
						break;
					case "touchmove":
						this.move(e);
						break;
					case "touchend":
						this.end(e);
						break;
					case "webkitTransitionEnd":
					case "msTransitionEnd":
					case "oTransitionEnd":
					case "otransitionend":
					case "transitionend":
						this.transitionEnd(e);
				}
				e.stopPropagation && e.stopPropagation();
			},
			start: function(e) {
				var o = e.touches[0];
				var y = o.pageY;
				var h = window.innerHeight;
				if (h - y < 20) {
					time = new Date();
					Y = Y2 = y;
					document.addEventListener("touchmove", this, !1),
						document.addEventListener("touchend", this, !1)
				}
			},
			move: function(e) {
				var o = e.touches[0];
				Y2 = o.pageY;
				if (!(e.touches.length > 1)) {
					e.disableScroll && e.preventDefault();
					//var o = e.touches[0];
				}
			},
			end: function(e) {
				var o = e.touches[0];
				var t = new Date - time;
				if (t < 500 && (Y - Y2) > 60 && fun) {
					fun(e)
				}
				Y = 0;
				Y2 = 0;
				document.removeEventListener("touchmove", this, !1);
				document.removeEventListener("touchend", this, !1);
			}
		};
		document.addEventListener("touchstart", u, !1);
		return function(f) {
			fun = f;
		}
	})()
	var Dialog=function(obj){
		var t=this;
		var obj=obj;
		var contain=obj.querySelector(".contain");
		if(!contain.classList.contains("type-3")){
			contain.onclick = function() {
				window.event.stopPropagation();
			}
		}
		var no= function() {
			obj.classList.add("hide");
			t.no&&t.no(obj);
			obj = null;
		}
		var ok= function(a) {
			obj.classList.add("hide");
			t.ok&&t.ok(obj);
			obj=null;
		}
		var close_button=obj.querySelector(".close");
		close_button&&(close_button.onclick=no);
		var no_button=obj.querySelector(".no");
		no_button&&(no_button.onclick=no);
		obj.onclick =  no;
		var ok_button=obj.querySelector(".ok");
		ok_button&&(ok_button.onclick =ok);
		this.show=function(){
			obj.classList.remove("hide");
		}
		this.hide=function(){
			obj.classList.remove("hide");
			obj.classList.add("hide");
		}
		this.title=function(txt){
			var title=obj.querySelector(".title");
			title&&(title.innerHTML=txt);
		}
	}
	$.Dialog=function(obj){
		return new Dialog(obj);
	}
	var timeout1;
	$.tip=function(str,time,bool,fun){
			var time = time ? 1000* time: 1000;
		    var m=document.querySelector("body");
			if(timeout1)window.clearTimeout(timeout1);
		    m.classList.remove("msg-on");
		    var msg = document.querySelector("#msg-cnt");
			if(!msg){
				var msg = document.createElement("div");
				msg.classList.add("msg-cnt");
				msg.id="msg-cnt";
				document.body.appendChild(msg);
			}
		    //index ? i.attr("class", "msg-cnt msg-type-" + index) : 
			msg.classList.add("msg-cnt");
		    msg.innerHTML="<span>" + str + "</span>";//.off("animationend"),
		    m.classList.add("msg-on");
		    var fun = fun;
		    timeout1=window.setTimeout(function() {
		        m.classList.remove("msg-on"),
		        fun && fun()
		    },
		    time)
	}
	return $;
})()

var tt=function(){
	fj.input("login",[["name","docfeng"],["psw"],["author"]]).then(function(a){
		alert(JSON.stringify(a))
	})
	fj.select("test",["test1","test2","test3"],2).then(function(a){
		alert(JSON.stringify(a))
	})
	fj.tip("test",3)
}
/* 
 <div class="Dialog hide" id="rrr">
 	<div class="contain type-1">
 		<div class="header">
 			<div class="title">333</div>
 			<div class="close">X</div>
 		</div>
 		<div class="body">
 			wwwwww
 		</div>
 		<div class="footer">
 			<div class="ok">ok</div>
 			<div class="no">no</div>
 		</div>
 	</div>
 	
 </div>
 */
window.addEventListener("load",function(){
	/* var d=fj.Dialog(shelf_control);
	d.no=function(a){
		var src=event.srcElement;
		var obj;
		src.classList.contains("item")&&(obj=src)
		src.parentNode.classList.contains("item")&&(obj=src.parentNode)
		obj&&(alert(obj.dataset.index))
	}
	d.show() */
})/**
 * es5
 * v1.0
 * 
 * User{ini,get,set,login,logout}
 * ini()=>users||err;
 * get(name)=>auther||err;
 * set(name,psw)=>author
 * login(name,psw)=>author
 * logout(name)
 * 
 * Repos(getAll,get,creat,del)
 * getAll(user)=>[item];item:{id,node_id,name,full_name,private,owner{login,id,...},...}
 * getAll2(user)=>[item];item:{}
 * get(user,repos)=>item;
 * creat()
 * del()
 * 
 * Issue{get,getAll,del,put,create,read,write}
 * get(user, repos, number)=>json
 * getAll(user, repos, number)=>[json];
 */
var formatDate = function(d) {
	var date = d || new Date()
	var yyyy = date.getFullYear();
	var mm = date.getMonth() + 1;
	var dd = date.getDate();
	mm = mm < 10 ? "0" + mm : mm;
	dd = dd < 10 ? "0" + dd : dd;
	var hours = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	hours = hours < 10 ? "0" + hours : hours;
	minute = minute < 10 ? "0" + minute : minute;
	second = second < 10 ? "0" + second : second;
	date = yyyy + "-" + mm + "-" + dd + " " + hours + ":" + minute + ":" + second;
	return date;
}
var formatUTCDate = function(d) {
	var date = d || new Date()
	var yyyy = date.getUTCFullYear();
	var mm = date.getUTCMonth() + 1;
	var dd = date.getUTCDate();
	var hours = date.getUTCHours();
	var minute = date.getUTCMinutes();
	var second = date.getUTCSeconds();
	date = yyyy + "-" + mm + "-" + dd + "T" + hours + ":" + minute + ":" + second + "Z";
	return date;
}
Git = (function() {
	var ajax = function(user, type, url, xml, data) {
		return User.get(user).then(function(author) {
			var json = {
				url: url,
				method: type,
				str: data && JSON.stringify(data),
				xml: xml,
				head: {
					Authorization: author
				}
			}
			//alert(JSON.stringify(json))
			return http.ajax(json);
		});
	}

	var User = {
		ini: (function() {
			var users = {};
			return function() {
				if (Object.keys(users).length == 0) {
					return store.getItem("users").then(function(_users) {
						if (_users) {
							users = JSON.parse(_users);
							return users;
						} else {
							return User.login();
						}
					})
				} else {
					return Promise.resolve(users);
				}
			}
		})(),
		get: function(name) {
			if (!name) return Promise.reject("err: user.get(name) \n no name");
			return this.ini().then(function(users) {
				if (users[name]) {
					var author = users[name];
					return author;
				} else {
					return Promise.reject("err: user.get(name) \n no users[name]");
				}
			});
		},
		set: function(name, psw) {
			var author = "Basic " + btoa(name + ":" + psw);
			return this.get().then(function() {
				users[name] = author;
				alert(JSON.stringify(users));
				return true;
			}).then(function() {
				store.setItem("users", JSON.stringify(users));
				return author;
			});
		},
		login: function(name, psw) {
			return store.getItem("users").then(function(_users) {
				var user;
				if (_users) {
					users = JSON.parse(_users);
				} else {
					users={};
				}
				if(confirm("login?")){
					var name = name || prompt("用户名", "docfeng");
					var author = author || prompt("author:" + name);
					if(!author){
						var psw = psw || prompt("密码:" + name);
						author = "Basic " + btoa(name + ":" + psw);
					}else{
						author = "token " + author;
					}
					users[name]=author;
					if(confirm("保存?")){
					  store.setItem("users", JSON.stringify(users));
					  return users;
					}else{
						return Promise.reject("err:uesr.ini() no cash");
					}
				}else{
					return Promise.reject("err:uesr.ini() no cash");
				}
			});
		},
		logout: function(name) {
			delete users[name];
			return store.setItem("users", JSON.stringify(users));
		}
	}

	var Repos = {
		//获取公开repos
		getAll2: function(user) {
			var url = "https://api.github.com/users/%s/repos".fill([user]);
			return ajax(user, "get", url);
		},
		//获取全部repos
		getAll: function(user) {
			var url = "https://api.github.com/user/repos";
			return ajax(user, "get", url);
		},
		get: function(user, repos) {
			var url = "https://api.github.com/repos/%s/%s".fill([user, repos]);
			return ajax(user, "get", url);
		},
		create: function() {

		},
		del: function() {

		}
	}

	var Dir = {
		getUserList: function() {
			var dir = [];
			for (var i in users) {
				dir[dir.length] = i;
			}
			return dir;
		},
		getReposList: function(user) {
			return Repos.getAll(user).then(function(repo) {
				var repo = JSON.parse(repo);
				var dir = [];
				for (var i = 0; i < repo.length; i++) {
					dir.push(repo[i].name);
				}
				return dir;
			});
		},
		getFileList: function(user, repos, file) {
			return File.getList(user, repos, file).then(function(repo) {
				//alert(JSON.stringify(repo,null,4))
				var re = {};
				var dir = [];
				var file = [];
				for (var i = 0; i < repo.length; i++) {
					if (repo[i].type == "file") {
						file[file.length] = repo[i].path;
					} else {
						//type="dir";
						dir[dir.length] = repo[i].path;
					}
				}
				re.file = file;
				re.dir = dir;
				return re;
			});
		},
		get: function(user, repos, name) {
			var name = name || "";
			if (!user) {
				return this.getUserList()
			}
			if (!repos) {

			} else {

			}
		}
	}
	var shas = {};
	var File = {
		getsha: function(user, repos, file) {
			if (Object.keys(shas).length == 0) {
				return this.getList(user, repos, file).then(function() {
					return true;
				});
			}
			return false;
		},
		getList: function(user, repos, path) {
			var path = path || "";
			var url = "https://api.github.com/repos/%s/%s/contents/%s".fill([user, repos, path]);
			return ajax(user, "get", url).then(function(text) {
				var re = JSON.parse(text);
				for (var i = 0; i < re.length; i++) {
					if (re[i].type == "file") {
						shas[re[i].path] = re[i].sha;
					}
				}
				return re;
			});
		},

		get: function(user, repos, file, branch) {
			var branch = branch || "master";
			var url = "https://api.github.com/repos/%s/%s/contents/%s?ref=%s".fill([user, repos, file, branch]);
			return ajax(user, "get", url).then(function(text) {
				var json = JSON.parse(text);
				var re = "";
				if (json.content) {
					var re = window.atob(json.content);
					re = decodeURIComponent(escape(re));
				}
				if (json.sha) {
					shas[json.path] = json.sha;
				}
				return re;
			});
		},
		create: function(user, repos, file, txt, message, branch) {
			var branch = branch || "master";
			var url = "https://api.github.com/repos/%s/%s/contents/%s".fill([user, repos, file, branch]);
			var sha = shas[file];
			var data = {
				"message": message || "add" + file,
				"content": window.btoa(unescape(encodeURIComponent(txt))),
				"sha": sha,
				"branch": branch
			}
			//console.log(url,data.content,txt)
			return ajax(user, "put", url, true, data).then(function(re) {
				var status = re.xml.status;
				var bool;
				switch (status) {
					case 200:
						//alert("写入成功");
						bool=true
						break;
					case 201:
						//alert("创建成功");
						bool=true
						break;
					case 422:
						//alert("false");
						bool=false
						break;
					default :
						bool=false
				}
				var json = JSON.parse(re.html);
				var re = "";
				if (json.content) {
					re = json.content.sha;
					shas[name] = re;
				}
				console.log(url,"bool",bool)
				return bool;
			});
		},
		put: function(user, repos, file, txt, message, branch) {
			return this.create(user, repos, file, txt, message, branch);
		},
		del: function(user, repos, file, message, branch) {
			//status:200 true;404 false;422参数错误
			var branch = branch || "master";
			var url = "https://api.github.com/repos/%s/%s/contents/%s".fill([user, repos, file, message, branch]);
			var sha = shas[file];
			if (!sha) {
				return Promise.reject("不存在文件sha");
			}
			var data = {
				"message": message || "delete " + file,
				"sha": sha,
				"branch": branch
			}
			return ajax(user, "DELETE", url, true, data).then(function(re) {
				var status = re.xml.status;
				switch (status) {
					case 200:
						alert("删除成功");
						delete shas[name];
						break;
					case 404:
						alert("没有文件");
						break;
					case 422:
						alert("参数错误");
						break;
				}
				return re;
			});
		}
	}

	var Issue = {
		getAll: function(user, repos, number) {
			var number = number ? "/" + number : "";
			var url = "https://api.github.com/repos/%s/%s/issues%s".fill([user, repos, number]);
			return ajax(user, "get", url);
		},
		get: function(user, repos, number) {
			return this.getAll(user, repos, number);
		},
		del: function(number) {

		},
		put: function(user, repos, number, title, body, labels, state) {
			var url = "https://api.github.com/repos/%s/%s/issues/%s".fill([user, repos, number]);
			var data = {
				"title": title,
				"body": body,
				"labels": labels
			}
			return ajax(user, "PATCH", url, false, data);
		},
		create: function(user, repos, title, body, labels) {
			var url = "https://api.github.com/repos/%s/%s/issues".fill([user, repos]);
			var data = {
				"title": title,
				"body": body,
				"labels": labels
			}
			return ajax(user, "post", url, false, data);
		},
		checkChange: function(user, repos, number, time) {
			var url = "https://api.github.com/repos/%s/%s/issues/%s".fill([user, repos, number]);
			return checkChange(user, url, time);
		}
	}

	var Comment = {
		gets: function(user, repos, issue,count) {
			if (!user || !repos || !issue) return false;
			var count=count||100;
			var url = "https://api.github.com/repos/%s/%s/issues/%s/comments?per_page=%s".fill([user, repos, issue,count]);
			return ajax(user, "get", url);
		},
		get: function(user, repos, number) {
			if (!user || !repos || !number) return false;
			var url = "https://api.github.com/repos/%s/%s/issues/comments/%s".fill([user, repos, number]);
			return ajax(user, "get", url);
		},
		del: function(user, repos, number) {
			if (!user || !repos || !number) return false;
			var url = "https://api.github.com/repos/%s/%s/issues/comments/%s".fill([user, repos, number]);
			return ajax(user, "DELETE", url, true).then(function(re) {
				//204成功
				var status = re.xml.status;
				switch (status) {
					case 204:
						return Promise.resolve("删除成功");;
						break;
					default:
						return Promise.reject("删除失败");
				}
			});;
		},
		put: function(user, repos, number, str) {
			if (!user || !repos || !number) return false;
			var url = "https://api.github.com/repos/%s/%s/issues/comments/%s".fill([user, repos, number]);
			var data = {
				"body": str
			}
			return ajax(user, "PATCH", url, false, data);
		},
		create: function(user, repos, issues, str) {
			if (!user || !repos || !issues) return Promise.reject(false);
			var url = "https://api.github.com/repos/%s/%s/issues/%s/comments".fill([user, repos, issues]);
			var data = {
				"body": str
			}
			return ajax(user, "post", url, false, data);
		},
		getSince: function(user, repos, issues, time) {
			if (!user || !repos || !issues || !time) return Promise.reject(false);
			var time = formatUTCDate(time);
			var url = "https://api.github.com/repos/%s/%s/issues/%s/comments?since=%s".fill([user, repos, issues, time]);
			return ajax(user, "get", url);
		}
	}

	var checkChange = function(user, url, time) {
		return User.get(user).then(function(author) {
			alert(author)
			var json = {
				url: url,
				method: "head",
				xml: true,
				head: {
					Authorization: author
					//"If-Modified-Since": new Date().toUTCString()//"Sun, 11 Aug 2013 19:48:59 GMT"
				},
			}
			if (time) {
				json.head["If-Modified-Since"] = time.toUTCString();
			}
			return http.ajax(json).then(function(re) {
				alert(re.xml.status)
				alert(re.html)
				alert(re.xml.getAllResponseHeaders())
				getLimit(re).then(function(re) {
					alert(re);
				});
				if (re.xml.status == "304") {
					return true;
				} else {
					return false;
				}
			});
		});
	}
	var getLimit = function(re) {
		if (re) {
			return Promise.resolve([re.xml.getResponseHeader("X-RateLimit-Remaining"),
				re.xml.getResponseHeader("X-RateLimit-Limit"),
				re.xml.getResponseHeader("X-RateLimit-Reset")
			]);
		} else {
			var json = {
				url: "https://api.github.com/rate_limit",
				method: "head",
				xml: true
			}
			return http.ajax(json).then(function(re) {
				return Promise.resolve([re.xml.getResponseHeader("X-RateLimit-Remaining"),
					re.xml.getResponseHeader("X-RateLimit-Limit"),
					re.xml.getResponseHeader("X-RateLimit-Reset")
				]);
			});
		}
	}
	var load = {
		download: function(name, url) {
			var anchor = document.createElement("a");
			if ('download' in anchor) {
				anchor.style.visibility = "hidden";
				anchor.href = url;
				anchor.download = name;
				document.body.appendChild(anchor);
				var evt = document.createEvent("MouseEvents");
				evt.initEvent("click", true, true);
				anchor.dispatchEvent(evt);
				document.body.removeChild(anchor);
			} else {
				window.open(url);
			}
		},
		downloadFile: function(name, user, repos, file) {
			var url = "https://raw.githubusercontent.com/" + user + "/" + repos + "/master/" + file;
			this.download(name, url);
		},
		downloadRepos: function(name, user, repos) {
			//var url=`https://codeload.github.com/${user}/${repos}/legacy.zip/master`;
			var url = "https://codeload.github.com/" + user + "/" + repos + "/zip/master/";
			//downloadFile(name,url)
			window.open(url)
		},
		downloadBlob: function(value, type, name) {
			var blob;
			if (typeof window.Blob == "function") {
				blob = new Blob([value], {
					type: type
				});
			} else {
				var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
				var bb = new BlobBuilder();
				bb.append(value);
				blob = bb.getBlob(type);
			}
			var URL = window.URL || window.webkitURL;
			var bloburl = URL.createObjectURL(blob);

			var anchor = document.createElement("a");
			if ('download' in anchor) {
				anchor.style.visibility = "hidden";
				anchor.href = bloburl;
				anchor.download = name;
				document.body.appendChild(anchor);
				var evt = document.createEvent("MouseEvents");
				evt.initEvent("click", true, true);
				anchor.dispatchEvent(evt);
				document.body.removeChild(anchor);
			} else if (navigator.msSaveBlob) {
				navigator.msSaveBlob(blob, name);
			} else {
				location.href = bloburl;
			}
		}
	}
	var gitapi = {
		User: User,
		Repos: Repos,
		Dir: Dir,
		Issue:Issue,
		Comment:Comment,
		File:File,
		load: load
	}
	return gitapi;
})()

String.prototype.fill = function(arr) {
	var str = this
	for (var i = 0; i < arr.length; i++) {
		str = str.replace("%s", arr[i]);
	}
	return str;
}

var tttt = function() {
	Git.Repos.getAll("docfeng").then(function(html) {
		alert(html)
	}).catch(function(e) {
		alert(e)
	});
	Git.Repos.get("docfeng", "book-data").then(function(html) {
		alert(html)
	})


	Git.File.create("docfeng", "book-data", "book/test/page1.txt", "test").then(function(author) {
		alert(author)
	});
	Git.File.getList("docfeng", "book-data").then(function(json) {
		prompt("", json[0].sha)
		alert(JSON.stringify(json))
	});

	Git.File.getList("docfeng", "book-data", "book/").then(function(json) {
		prompt("", json[0].sha)
		alert(JSON.stringify(json))
	});
	Git.File.get("docfeng", "book-data", "book/test/page1.txt").then(function(txt) {
		alert(txt)
	});
	Git.File.put("docfeng", "book-data", "book/test/page1.txt", "test2").then(function(author) {
		alert(author)
	})
	Git.File.del("docfeng", "book-data", "book/test/page1.txt").then(function(author) {
		alert(author)
	})

	Git.Issue.create("docfeng", "book-data", "shelf", "test", ["shelf"]).then(function(text) {
		alert(text)
		//alert(JSON.stringify(json))
	});
	Git.Issue.getAll("docfeng", "book-data").then(function(text) {
		alert(text)
	});
	Git.Issue.get("docfeng", "book-data", 1).then(function(text) {
		var json = JSON.parse(text);
		alert(json.body)
		alert(json.updated_at)
		alert(json.created_at)
		alert(JSON.stringify(json))
	});
	Git.Issue.put("docfeng", "book-data", 1, "shelf", "test22222", ["shelf"]).then(function(json) {
		alert(json)
	});
	var d = new Date("2019-07-23 17:16:00");
	Git.Issue.checkChange("docfeng", "book-data", 1, d).then(function(json) {
		alert(json)
	})

	Git.Comment.create("docfeng", "book-data", 1, "test").then(function(text) {
		alert(text)
		var json = JSON.parse(text)
		prompt(json.id)
		//alert(JSON.stringify(json))
	});
	Git.Comment.put("docfeng", "book-data", 514108986, "test1111").then(function(text) {
		alert(text)
		//alert(JSON.stringify(json))
	});
	Git.Comment.gets("docfeng", "book-data", 1).then(function(text) {
		alert(text)
		var json = JSON.parse(text)
		json = json[0];
		prompt(json.id)
		alert(json.body)
		alert(json.updated_at)
		prompt("", json.updated_at)
		alert(json.created_at)
	});
	Git.Comment.get("docfeng", "book-data", 1).then(function(text) {
		alert(text)
		var json = JSON.parse(text)
		json = json[0];
		prompt(json.id)
		alert(json.body)
		alert(json.updated_at)
		prompt("", json.updated_at)
		alert(json.created_at)
	});
	Git.Comment.del("docfeng", "book-data", 514119799).then(function(re) {
		window.re = re;
		alert(re.xml.statue)
		//alert(JSON.stringify(json))
	});
	Git.Comment.create("docfeng", "book-data", 1, "test").then(function(text) {
		alert(text)
		var json = JSON.parse(text)
		var id = json.id;
		alert(id)
		Git.Comment.del("docfeng", "book-data", id).then(function(re) {
			alert(re)
		});
	});
	var d = new Date("2019-07-23T17:23:10");
	Git.Comment.getSince("docfeng", "book-data", 1, d).then(function(re) {
		alert(re)
		var json = JSON.parse(re);
		for (var i = 0; i < json.length; i++) {
			alert(new Date(json[i].updated_at))
		}
	}).catch(function(e) {
		alert(e)
	});
}
//chrome.openFile("../git/noveldownload/noveldownload.html");
//es5
//version2.1
http={
    corsUrl:"https://bird.ioliu.cn/v2/",
    xmlhttp:function(){
        var xmlHttp=null; 
        try { // Firefox, Opera 8.0+, Safari 
            xmlHttp=new XMLHttpRequest();
        }catch (e) { // Internet Explorer 
            try { 
                xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); 
            }catch (e) { 
                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
           } 
        } 
        if (xmlHttp==null) { 
            alert ("您的浏览器不支持AJAX！"); 
            return; 
        }
        return xmlHttp;
    },
    get:function(url,json){
        var json=json||{};
        var t=this;
        json.url=url;
        json.method="get";
        return new Promise(function(resolve,reject){
            var p=t.ajax(json);
            p.then(function(re){
                resolve(re);
            })
        });
    },
    cors:function(url,json){
        var json=json||{cors:true};
        json.url=url;
        json.method="get";
        var t=this;
        return  new Promise(function(resolve,reject){
            var p=t.ajax(json);
            p.then(function(re){
                resolve(re);
            })
        });
    },
    getJSON:function(url,json){
        var json=json||{};
        json.url=url;
        json.method="get";
        var t=this;
        return  new Promise(function(resolve,reject){
            var p=t.ajax(json);
            p.then(function(re){
                resolve(JSON.parse(re));
            })
        });
    },
    post:function(url,str,json){
        var json=json||{};
        json.str=str;
        json.url=url;
        json.method="post";
        var t=this;
        return  new Promise(function(resolve,reject){
            var p=t.ajax(json);
            p.then(function(re){
                resolve(re);
            })
        });
    },
    ajax:function(json){
        var  json=json;
        var method=json.method||json.type||"get";
        var async=json.async||true;
        var cors=json.cors||false;
        var url=json.url||"";
        var data=json.str||json.data||null;
        if(cors){
            var corsUrl=json.corsUrl||this.corsUrl;
            url=corsUrl+"?url="+url
        }
        var xml=json.xml||false;
        var xmlHttp=this.xmlhttp();
		if(json.timeout){
			xmlHttp.timeout=json.timeout;
		}
        return new Promise(function(resolve,reject){
            xmlHttp.onreadystatechange=function(){
                if(xmlHttp.readyState==4) { 
                    var re="";
					if(json.charset){
						var type=xmlHttp.getResponseHeader("Content-Type");
						if(IEVersion()!=-1){
							if(!type.match(/utf-8/i)){
								var str =gbk2utf8(xmlHttp.responseBody);
							}
						}else{
							var x = new Uint8Array(xmlHttp.response);
							if(type.match(/utf-8/i)){
								var str =new TextDecoder('utf-8').decode(x);
							}else{
								var str =new TextDecoder('gbk').decode(x);
							}
						}
					}else{
						var str =xmlHttp.responseText;
					}
                    if(xml){
                        var re={
                            html:str,//xmlHttp.responseText,
                            url:xmlHttp.responseURL,
                            xml:xmlHttp
                        };
                    }else{
                       // re=xmlHttp.responseText;
					   re=str
                    }
                    resolve(re)
                }
             }
            xmlHttp.ontimeout = function(e) {
                xmlHttp.abort();
                reject("timeout"+url);
            };
            xmlHttp.open(method,url,true); 
            if(json.head){
                for(var p in json.head){
                    xmlHttp.setRequestHeader(p,json.head[p]);
                }
            }
			if(json.charset&&IEVersion()==-1){
				xmlHttp.responseType="arraybuffer";
				xmlHttp.overrideMimeType("text/html;charset=utf-8")
			}
            xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
            xmlHttp.send(data); 
        });
    }
}
gbk2utf8=function(body){
 var stm=new ActiveXObject("adodb.stream")
 stm.Type=1
 stm.mode=3
//stm.charset="gbk"
 stm.open()
 stm.Write(body)
 stm.Position = 0
 stm.Type= 2;
 stm.charset="gbk"
 
 var re = stm.readtext()
 stm.Close()
 stm=null;
 return  re;
}
		function IEVersion() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) {
                    return 7;
                } else if(fIEVersion == 8) {
                    return 8;
                } else if(fIEVersion == 9) {
                    return 9;
                } else if(fIEVersion == 10) {
                    return 10;
                } else {
                    return 6;//IE版本<=7
                }   
            } else if(isEdge) {
                return 'edge';//edge
            } else if(isIE11) {
                return 11; //IE11  
            }else{
                return -1;//不是ie浏览器
            }
        }
/*var get=function(){
http.cors("http://www.baidu.com").then(function(re){
	alert(re)
});
}
get()*/ 
//var oalert = window.alert
//window.alert = (...args) => { oalert(...args); console.error(new Error('someone alerted'))}window.onload = function() {
	if (browser.MyApp) chrome.computer();
	Shelf.showAll().then(function(){
		Shelf.sameSince().then(function(re){
			Shelf.showAll();
		});;
	});
	var json={
		src:shelf_div,
		title:shelf_div.querySelector(".refreshText"),
		/* src:down_src,
		title:down_title, */
		move:function(x,y) {
			var title=this.title;
			y<60&&(title.innerHTML = "下拉刷新...");
			y>120&&(title.innerHTML = "设置");
			if(y>60&&y<120){
				var re=x/window.innerWidth;
				switch (true){
					case re<1/3:
						title.innerHTML = "释放立即刷新...1";
						break;
					case re>2/3:
						title.innerHTML = "释放立即刷新...2";
						break;
					default:
						title.innerHTML = "释放立即刷新...3";
						break;
				}
			}
		},
		end:function(x,y) {
			//var re=parseInt(window.innerWidth/x);
			//alert(re)
			if(y>120){
				UI.showSetting();
			}
			if(y>60&&y<120){
				var re=x/window.innerWidth;
				switch (true){
					case re<1/3:
						alert(1)
						break;
					case re>2/3:
						alert(3)
						break;
					default:
						alert(2);
						break;
				}
			}
		}
	}
	addDownFlush(json);
}

window.onresize = function() {}
//window.addeventlistener("resize",function(){alert()},false);
/* document.oncontextmenu = function() {
	event.returnValue = false;
	UI.show("#contextmenu");
} */

addDownFlush = function(json){
	var obj = json.src;
	var title = json.title
	var Y = 0;
	var M = 0;
	var X = 0;
	var isMobile = navigator.userAgent.indexOf("Mobile")>-1;
	var u = {
	    //切换事件
	    handleEvent: function(e) {
	        switch (e.type) {
			case "mousedown":
	        case "touchstart":
	            this.start(e);
	            //show("start");
	            break;
			case "mousemove":
	        case "touchmove":
	            this.move(e);
	            //show("move");
	            break;
			case "mouseup":
	        case "touchend":
	            this.end(e);
	            break;
	        case "webkitTransitionEnd":
	        case "msTransitionEnd":
	        case "oTransitionEnd":
	        case "otransitionend":
	        case "transitionend":
	            //d(this.transitionEnd(t))
	        }
	        e.stopPropagation && e.stopPropagation();
	    },
	    start: function(e) {
			if(e.touches){
				Y = e.touches[0].pageY;
				X =  e.touches[0].pageX;
				obj.addEventListener("touchmove", this, !1),
				obj.addEventListener("touchend", this, !1);
			}else{
				Y = e.pageY;
				X=e.pageX;
				obj.addEventListener("mousemove", this, !1),
				obj.addEventListener("mouseup", this, !1);
			}
			this.setCapture && this.setCapture();
			return 0;
	    },
	    move: function(e) {
			if(e.touches){
				M = e.touches[0].pageY - Y;
				X =  e.touches[0].pageX;
			}else{
				M = e.pageY - Y;
				X=e.pageX;
			}
			document.title=M
			if (isTop() && M > 0) {
				title.style.height = "20px";
				obj.style.transform = "translateY(20px)";
				obj.style.transition = "all ease 0.5s";
				json.move(X,M);
			} else {
				obj.style.transform = "translateY(0)";
				title.style.height = "0px";
				title.innerHTML = "";
			}
	    },
	    end: function(e) {
			if (isTop() && M > 0) {
				if (M > 60) {
					json.end(X,M);
					e.stopPropagation||e.stopPropagation()
					e.preventDefault&&e.preventDefault();
				} else {
					//document.title = "end"
				}
				obj.style.transform = "translateY(0)";
				title.style.height = "0px";
				title.innerHTML = "";
			}
			M = 0;
			if(e.touches){
				obj.removeEventListener("touchmove", u, !1),
				obj.removeEventListener("touchend", u, !1)
			}else{
				obj.removeEventListener("mousemove", u, !1),
				obj.removeEventListener("mouseup", u, !1)
			}
			e.srcElement.releaseCapture && e.srcElement.releaseCapture();
	    }
	};
	obj.addEventListener("touchstart", u, !1)
	obj.addEventListener("mousedown", u, !1)
	obj.onselectstart=function(e){
		return false;
	}; 
	var isTop = function() {
		var t = obj.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
		//alert("t:"+t)
		return t === 0 ? true : false;
	}
}

get_radio = function(obj) {
	for (var i = 0; i < obj.length; i++) {
		if (obj[i].checked) {
			return obj[i].value;
		}
	}
	return false;
}

shiftDiv = function(div) {
	if (_reg.style.display == "" || _reg.style.display == "block") {
		div.style.display = "none";
	} else {
		div.style.display = "block";
	}
}

/* window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
     window.applicationCache .swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false); */

UI = {
	show: function(id) {
		//document.querySelector(id).style.display = "flex";
		if(window.getComputedStyle(document.querySelector(id),null).visibility=="hidden"){
			document.querySelector(id).style.visibility='visible';
		}
		evt.addEvent(function() {
			document.querySelector(id).style.visibility="hidden";
		});
	},
	showSetting:function(){
		this.show('#contextmenu')
	},
	showList:function(){
		this.show('#listDiv')
	},
	showPage:function(){
		document.querySelector("#main_contain").style.visibility='visible';
	},
	hidePage:function(){
		document.querySelector("#main_contain").style.visibility="hidden"
		evt.addEvent(function() {
			document.querySelector("#main_contain").style.visibility='visible';
		});
		//document.querySelector("#main_contain").style.display="none";
	},
	showSearch:function(){
		this.show('#searchDiv')
	},
	showMain:function(){
		document.querySelector("#main_contain").style.visibility='visible';
	},

	toast: function() {
		var task = [];
		var bool = true;

		function toast(msg) {
			task[task.length] = msg;
			var show = function() {
				bool = false;
				var msg = task.shift();
				setTimeout(function() {
					document.getElementsByClassName('toast-wrap')[0].getElementsByClassName('toast-msg')[0].innerHTML = msg;
					var toastTag = document.getElementsByClassName('toast-wrap')[0];
					toastTag.className = toastTag.className.replace('toastAnimate', '');
					setTimeout(function() {
						toastTag.className = toastTag.className + ' toastAnimate';
						if (task.length > 0) {
							show();
						} else {
							bool = true;
						}
					}, 1000);
				}, 1500);
			}
			if (bool) {
				show();
			}
		}
		return toast;
	}()
}

msg=function(x,y,config){
  fixedBody()
  var mtitle="";
  var mbody="";
  if(y){
    mtitle=x;
    mbody=y
  }else{
    mtitle="";
    mbody=x?x:"";
  }
  document.querySelector(".msg_title").innerHTML=mtitle;
  document.querySelector(".msg_body").innerHTML=mbody;
  document.querySelector(".msg").style.display="block";
  //var config={"height":"500px","width":"500px","left":"0px","top":"0px"}
  if(config){
    for (var key in config) {
      if (config.hasOwnProperty(key)){
        document.querySelector(".msg").style[key]=config[key];
      }
    }
  }
}

window.addEventListener("load",function(){
  document.querySelector(".msg_close").onclick=function(){
    document.querySelector(".msg").style.display="none";
    looseBody();
  };
},false);

function fixedBody() {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;';
}

//关闭模态框后调用
function looseBody() {
    var body = document.body;
    body.style.position = 'static';
    var top = body.style.top;
    document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
    body.style.top = '';
}




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
				Page.resize()
				window.page(i)
			});
			
			UI.hidePage();
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
				console.log(name,url,arr);
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
					var d=fj.Dialog(shelf_control);
					d.no=function(a){
						var src=event.srcElement;
						var obj;
						src.classList.contains("item")&&(obj=src)
						src.parentNode.classList.contains("item")&&(obj=src.parentNode);
						if(obj){
							switch(obj.dataset.index){
								case "1"://"删除":
								    t.delete(index);
								    break;
								case "2"://"移动":
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
						}
					}
					d.show()
					/* fj.select(json.name,["删除","移动"]).then(function(re){
						
					}) */
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
//
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
				List.arr = arr;
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
			    <h4><span class='highlight'>最��?</span>%s</h4>\
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
			listUrl.innerText= url;
		},
		showarr: function(arr) {
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
		//目录滚动到第i��?
		scroll: function(i) {
			var h = list_table.rows[i].offsetTop
			list_table.parentNode.scrollTop = h
		},

		click: async function(obj) {
			var obj = obj.parentNode;
			var i = obj.parentNode.rowIndex; //*this.max+obj.cellIndex;
			var name = this.name;
			var arr = this.arr[i];
			var title = arr[1];
			var url = arr[0];
			var json = await Shelf.read(name);
			json.readTitle = title;
			json.readURL = url;
			json.readIndex = i;
			json.readAt = formatDate(new Date());
			Shelf.write(json);

			Page.name = name;
			Page.arr = this.arr;
			Page.resize()
			Page.multiIndex(i).then(function(re) {
				//alert(re)
				//Page.show(re)
				Page.resize()
				window.page(i)
			}).catch(function(e) {
				alert("err:Page.multiIndex" + e)
			})
			/* var list=await novel.getList().;
			window.page(novel.index1);
			setTimeout(function(){
				novel.index2=novel.index2==0?1:novel.index2;
				//alert(novel.index2)
			  window.section(novel.index2);
			},200); */

			/* var his={name:name,index:[i,0]};
			his=JSON.stringify(his,null,2);
			localStorage.setItem("his",his)
			pageDiv.querySelector("iframe").contentWindow.location.href = "page.html"; */
			//alert()
			UI.hidePage();
			//document.querySelector("#main_contain").style.display="none"
			//UI.show("#pageDiv");
			//fullScreen(document.querySelector("#pageDiv"))
		},
		update: async function(url) {
			var json = await this.get(url);
			if (json.length == this.arr.length) {
				console.add("目前没有新更��?);
			} else {
				var arr = this.arr = json;
				this.showarr(arr);
				var newpage = arr[arr.length - 1];
				this.save();
				console.add("已更��? + newpage[1]);
				listNew.innerText = newpage[1];
			}
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



Page=(function(a){
	var _Page=Book.Page;
	var Arr,Json;
	var Page ={
		multi: function(name,url) {
			return _Page.multi(name,url);
		},
		multiIndex: function(i) {
			var name=this.name;
			var arr=this.arr;
			var title=arr[i][1];
			var url=arr[i][0];
			return _Page.multi(name,url).then(function(txt){
				Page.write(name, title, url, txt).then(function(re){
					//alert(re)
				}).catch(function(e){
					alert("err:Page.multiIndex:\n"+e)
				})
				return txt;
			});
		},
		remote: function(url) {
			return _Page.remote(url);
		},
		read: function(name,url) {
			return _Page.read(name,url);
		},
		write: function(name, title, url, txt) {
			return _Page.write(name, title, url, txt);
		},
		show: function(txt) {
			var txt=this.formatUI(txt);
			//document.querySelector("#txt").innerHTML = txt;
		},
		formatUI: function(txt) {
			var txt = "<p>" + txt.replace(/\n/g, '</p>\n<p>') + "</p>"
			//document.querySelector("#txt").innerHTML = txt;
			return txt;
		},
		showList:function(name,arr){
		  var arr=arr||this.arr;
		  var name=name||this.name;
		  if(!name||!arr){
			  alert("err:Page.showList\n参数错误;\nname:"+name+"\narr:"+arr)
			  return "err:Page.showList\n参数错误";
		  }
			  
		  var config={"height":(document.body.clientHeight-8)+"px","width":"60%","left":"0px","top":"0px"}
		  var url_arr=arr;
		  var str="";
		  var err=[];
		  for(var i=0;i<url_arr.length;i++){
		      if(!url_arr[i]||!url_arr[i][1]){
		        err[err.length]=i+":"+url_arr[i];
		      }else{
		        var d="<h4>"+url_arr[i][1]+"</h4>";
		        d+="<h5>"+url_arr[i][0]+"</h5>";
		        //h+="<td>"+d+"</td>";
		        str+="<tr><td>"+d+"</td></tr>";
		      }
		  }
		
		  str='<div style="height:580px;overflow-x:hidden;overflow-y:scroll;"><table style="width:100%;height:100%" onclick="Page.closeList(event.srcElement)">'+str+"</table></div>";
		  msg(name,str,config);
		  //目录滚动到第i��?
		  var i=this.index1;
		  var table1=document.querySelector(".msg_body").childNodes[0].childNodes[0];
		  var h=table1.rows[i].offsetTop;
		  table1.parentNode.scrollTop=h;
		},
		//关闭目录,显示文章
		closeList:function(obj){
		    var obj=obj.parentNode;
		    var i=obj.parentNode.rowIndex;
		    window.page(i);
		    $(".msg").css("display","none");
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
				alert(e)
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
			//显示目录��?
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
		
		click: async function(obj, order = "click") {
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
				List.read(name).then(function(list_arr){
					if (!list_arr) {
						return List.remote(url);
					}else{
						return list_arr;
					}
				}).then(function(list_arr){
					List.write(name, list_arr);
					List.show(name, url, list_arr);
					List.scroll(readIndex); 
					//更新，保存书��?
					/* var arr = json.splice(i, 1)[0];
					arr.readAt = formatDate(new Date());
					json.unshift(arr);
					this.show({
						json: json
					})
					this.setKeyData(arr); */
				});
			}
			if (order == "delete") {
				this.delete(i);
			}
		},
		
		update: async function() {
			var json = this.json || await this.read();
			var t = this;
			console.add("开始更��?);
			var count = 0;
			for (var i = 0; i < 10; i++) {
				this.update1(json[i], i);
			}
		},
		update1: async function(arr, i) {
			var arr = arr;
			var url = arr.url;
			var name = arr.name;
			console.add(name)
			var urlArr = await Shelf.get(url);
			//alert(urlArr)
			if (!urlArr) {
				console.add(`>>${i}.${name}Shelf未获��?<br>-------<br>`);
			} else {
				var len=urlArr.length;
				if(arr.updateIndex!=len){
					Shelf.save(name, urlArr);
					try {
						//最新章��?
						console.add(name+"已更��?)
						urlArr = urlArr.pop();
						
						arr.updateTitle = urlArr[1];
						arr.updateURL = urlArr[0];
						arr.updateAt = formatDate(new Date());
						arr.updateIndex = len;
						
						this.show({
							index: i
						});
						this.setKeyData(arr);
					} catch (e) {
						console.add(`>>${i}.${name}出错;<br>-------<br>`);
					}
				}else{
					console.add(name+"没有更新")
				}
			}
			//是否保存
			/*count++;
			if(count==15&&confirm("save?\n"+this.json)){
			    fso.write(this.hisPath,JSON.stringify(this.json),false);
			}*/
		}
	}
	return Shelf;
})();
///*
  耳机按键:nextPage();
  跳到第i章:window.page(i);
  跳到第i页:window.section(i,t);
  上一页:window.uppage()
  下一页:window.next();
  
*/

ini = function(index) {
	//alert(url+index)
	var index2 = prompt("页面", 0);
	window.page(parseInt(index) - 1)
	setTimeout(function() {
		window.section(parseInt(index2));
	}, 1000);
}

function keyCode(i) {
	alert(i)
}
//监听耳机按键
function nextPage() {
	//alert(next)

	if (window.ds) {
		window.clearTimeout(ds);
	}
	var next = function() {
		window.ds = setTimeout(function() {
			window.next();
		}, 500);
	}
	var uppage = function() {
		window.ds = setTimeout(function() {
			window.uppage();
		}, 500);
	}
	if (!window.time1) {
		window.time1 = new Date();
		next();
	} else {
		var t2 = new Date();
		var t = t2 - window.time1;
		window.time1 = t2
		if (t < 400) {
			window.uppage();
			window.uppage()
		} else {
			window.next();
		}
	}

}
window.onkeydown = function(e) {
	switch (e.keyCode) {
		case 40: //下
			window.next();
			break;
		case 38: //上
			window.uppage();
			break;
	}
}
showMsg = geth(2).showMsg;
//showMsg("fffggf");

show = function(str) {
		e = $("#page-nav");
		e.html(str)
	}

	//初始化界面
	! function() {
		function setFontSize(t, n) {
			var ft = $("#cfg-font"),
				ut = ft.find(".fs-add"),
				ht = ft.find(".fs-rdu"),
				mt = ft.find(".fs-dft");
			var e = fontSize.range,
				t = 1 * t;
			if ("number" == typeof t) {
				0 > t && (t = 0);
				t > e && (t = e);
				0 == t ? ht.addClass("disabled") : ht.removeClass("disabled");
				t == e ? ut.addClass("disabled") : ut.removeClass("disabled");
				t == fontSize.dft ? mt.addClass("cur") : mt.removeClass("cur");
				fontSize.cur = t;
				if (!n) {
					var a = $("body").attr("class").replace(/\s*fstep-\d\s*/g, " fstep-" + t + " ");
					$("body").attr("class", a);
					cacl(Z)
				}
			}
		}
		//设置控制
		function settingControl() {
			$(window).on("resize orientationchange", function(t) {
				body.removeClass("cfg-on").removeClass("fn-on");
				"lr" == Direction && cacl(Z);
			})

			//设置页面底部
			$(".fb-icon").on("click", "li>a, li>div", function() {
				var n = $(this).find(".icon");
				n.addClass("icon-taped");
				setTimeout(function() {
						n.removeClass("icon-taped")
					},
					500);
			});

			//字体设置
			$("#cfg-font").on("click", "menuitem", function(e) {
				e.preventDefault();
				var n = $(this),
					size = fontSize.cur,
					o = fontSize.dft;
				if (!n.hasClass("disabled") && !n.hasClass("cur")) {
					n.hasClass("fs-add") && setFontSize(size + 1);
					n.hasClass("fs-rdu") && setFontSize(size - 1);
					n.hasClass("fs-dft") && setFontSize(o);
				}
			});
			//背景色
			$("#cfg-bg").on("click", "menuitem", function(e) {
				e.preventDefault();
				var n = $(this);
				if (!n.hasClass("cur")) {
					bgcolor = n.data("cls");
					var classlist = $("body").attr("class").replace(/\s*bg-\d\s*/g, " " + bgcolor + " "); //替换class
					$("body").attr("class", classlist);
					n.addClass("cur").siblings("menuitem").removeClass("cur")
				}
			});
			//设置底部:关灯,开灯,设置
			$("#fn-btm").on("click", "li.night div", function(e) {
				e.preventDefault();
				$("body").removeClass("rd-day").addClass("rd-night");
				Day_Night = "night";
			}).on("click", "li.day div", function(e) {
				e.preventDefault();
				$("body").removeClass("rd-night").addClass("rd-day");
				Day_Night = "day";
			}).on("click", "li.li-cfg div", function(e) {
				e.preventDefault();
				body.toggleClass("cfg-on");
				return false;
			});
			//设置滑动模式：左右、上下
			$("#cfg-mode").on("click", "menuitem", function(t) {
				var n = $(this);
				if (!n.hasClass("cur")) {
					var e = n.hasClass("mode-lr"),
						o = $("#rd-txt");
					setCur(n);
					body.removeClass("fn-on cfg-on");
					if (e) {
						Direction = "lr";
						body.addClass("page-lr");
						cacl();
					} else {
						Direction = "ud";
						pageIndex = 1;
						body.removeClass("page-lr");
						o.removeAttr("style");
					}
					body.removeClass("tip-off").addClass("tip-on"), H = !0
				}
			})

			var tap_hdl = $("#tap-hdl"); //点击控制面板
			//点击左边pg-lft,点击右边pg-rit,点击中间.fn-div
			tap_hdl.on("click", ".fn-div", function(t) {
				t.preventDefault();
				body.toggleClass("fn-on").removeClass("cfg-on").removeClass("idx-on");
				V = !1;
			}).on("touchmove", function(t) {
				body.removeClass("cfg-on").removeClass("fn-on")
			})
			//上一页、下一页
			tap_hdl.on("click", "div", function(t) {
				var n = $(this);
				n.hasClass("pg-lft") && !z() && nextPage(); //upPage(),
				n.hasClass("pg-rit") && !z() && nextPage();
				return false
			})

			//上下滑动,上一页,下一页事件
			tap_hdl.on("click", ".pg-up", function(t) {
				!z() && P(); //全部修改成下一章P(),
				return false;
			}).on("click", ".pg-dn", function(t) {
				!z() && D();
				return false;
			})
		}
		//页面点击、窗口关闭时设置cookie
		function y() {
			function o() {
				//var t = ["fstep-" + fontSize.cur, bgcolor, "page-" + Direction, "rd-" + Day_Night];
			}
			window.onbeforeunload = function() {
				o();
			}
			$("#cfg-pnl menuitem").on("click", function() {
				o()
			})
		}

		function z() {
			//判断是否含有cfg-on,如果没有,移除cfg-on fn-on
			var t = body.hasClass("cfg-on");
			var a = t && body.removeClass("cfg-on").removeClass("fn-on"),
				t;
			return a
		}

		//上下控制:上
		function P(t) {
			var n = body.scrollTop(),
				e = $(window).height(),
				o = $("#rd-top").height(); //阅读页顶部条
			//body.height();
			n > 0 ? body.scrollTop(n - (e - o)) : upChapter()
		}

		//上下控制:下
		function D(t) {
			var n = body.scrollTop(),
				e = $(window).height(),
				o = $("#rd-top").height(), //阅读页顶部条
				i = body.height();
			i > n + e ? body.scrollTop(n + (e - o)) : nextChapter()
		}

		function setCur(obj) {
			$(obj).addClass("cur").siblings().removeClass("cur")
		}




		var B = geth(2),
			j = getn(7),
			N = B.supportAnimate().supported,
			U = B.cookie,
			pageCount = 1,
			Direction = "", //lr or ud
			Day_Night = "", //day or night
			pageIndex = 1,
			Z = 0,
			pageLeft = -342,
			H = !1, //上下false;左右true
			bgcolor = "bg-2", //背景色
			body = $("body"),
			fontSize = {
				range: 6,
				cur: 3,
				dft: 3
			},
			st = {
				init: function() {
					//初始化阅读界面
					this.formatPage();
					//初始化控制界面
					this.reactCtls();
				},
				formatPage: function() {
					var body = $("body");
					//history.pushState(null, null, t))
					if (body.hasClass("page-lr")) {
						Direction = "lr";
						cacl(Z);
						setCur($("#cfg-mode").find(".mode-lr"));
					} else {
						Direction = "ud";
						setCur($("#cfg-mode").find(".mode-ud"));
					}
					Z && body.scrollTop(body.height() * Z - 32),
						Day_Night = "day"; //body.hasClass("rd-night") ? "night": "day";

					var e = body.attr("class");
					//设置字体大小
					var s = e.match(/fstep-\d/);
					setFontSize(s ? s[0].split("-")[1] : 3, "noset");
					//设置背景色
					var d = e.match(/bg-\d/);
					d = d ? d[0].split("-")[1] : 2;
					bgcolor = "bg-" + d;
					setCur($("#cfg-bg").find(".bg-" + d));
					//$("html").addClass("chn-" + u)
				},
				clearRead: function() {
					body.removeClass("fn-on").removeClass("cfg-on").removeClass("idx-on"),
						V = !1
				},
				reactCtls: function() {
					//屏幕幕布 l(),
					//未知h(),
					settingControl() //设置底部、设置背景色
					//y()//页面点击、窗口关闭时设置cookie
				}
			}
		st.init();






		//屏幕换页动画
		function move(obj, t, x, y, fun) {
			//动画持续n秒;
			var obj = $(obj);
			obj.css("-webkit-transition", "-webkit-transform " + t + "ms ease");
			obj.css("-o-transition", "-o-transform " + t + "ms ease");
			obj.css("-moz-transition", "-moz-transform " + t + "ms ease");
			obj.css("-ms-transition", "-ms-transform " + t + "ms ease");
			obj.css("transition", "transform " + t + "ms ease");

			//沿x轴滚动x,沿y轴滚动y;
			var x = "number" == typeof x ? x + "px" : x;
			var y = "number" == typeof y ? y + "px" : y;
			obj.css("-webkit-transform", "translate3d(" + x + ", " + y + ",0)");
			obj.css("-moz-transform", "translate3d(" + x + ", " + y + ",0)");
			obj.css("-o-transform", "translate3d(" + x + ", " + y + ",0)");
			obj.css("-ms-transform", "translate3d(" + x + ", " + y + ",0)");
			obj.css("transform", "translate3d(" + x + ", " + y + ",0)");
			//如果fun为function,t秒后执行fun;
			"function" == typeof fun && setTimeout(fun, t);
		}
		Page.move = function(obj, t, x, y, fun) {
			move(obj, t, x, y, fun)
		}
		//rd-txt在t秒内沿横轴移动-x个屏幕距离;
		function scroll(x, t) {
			var width = $(window).width();
			var obj = "#rd-txt";
			var x = x || pageIndex;
			var t = t || 0;
			var len = -width * (x - 1);
			pageLeft = len
			//obj对象t毫秒内沿x轴移动len长度，y轴移动0长度;
			move(obj, t, len, 0);
		}
		//计算界面,移动到第(t*总页数)页;
		function cacl(t) {
			if ("lr" == Direction) {
				var obj = $("#rd-txt");
				win_width = $(window).width();
				win_height = B.isMobile.iOS() ? window.innerHeight : $(window).height();
				obj.css({
					height: win_height,
					width: win_width
				});
				//rd-txt长度;
				var txt_width = document.getElementById("rd-txt").scrollWidth;
				//计算页数
				pageCount = Math.ceil(txt_width / win_width);
				t && (pageIndex = Math.max(Math.floor(t * pageCount), 1), scroll(pageIndex, 0));
				//显示页码
				$("#page-nav").html(pageIndex + "/" + pageCount);
				//alert(e.html())
				window.scrollTo(0, 1);
			}
		}
		//上一章
		function upChapter() {
			window.page(Page.index1 - 1);
		}
		//下一章
		function nextChapter() {
			window.page(Page.index1 + 1);
		}
		window.page = function(i) {
			//页数等于第1页;
			pageIndex = 1;
			if (i < 0) i = 0;
			if (i + 1 == Book.listarr.length) {
				fj.tip("已阅读到书本末尾")
			}
			if (i + 1 > Book.listarr.length) {
				fj.tip("已阅读到书本末尾")
				return Promise.reject("已阅读到书本末尾");
			}
			return Page.multiIndex(i).then(function(txt) {
				if (!txt) return Promise.reject("err:window.page:\nno txt\n" + txt);
				txt = Page.formatUI(txt);
				Page.index1 = i;
				$("#rd-txt").html(txt);
				$("#page-name").html(Book.listarr[i][1] + ":    " + Book.name);
				$("#novelName").html(Book.name);
				Z = (pageIndex / pageCount).toFixed(2); //保留小数点2位
				scroll(pageIndex, 0);
				void cacl();
			}).catch(function(e) {
				alert("err:window.page:\nno txt\n" + e)
			});
		}
		//上一页
		function upPage(t) {
			pageIndex--;
			window.section(pageIndex, t);
		}
		//下一页
		function nextPage(t) {
			pageIndex++;
			window.section(pageIndex, t);
		}
		window.next = nextPage;
		window.uppage = function() {
			pageIndex--;
			window.section(pageIndex, 0);
		}
		window.section = function(i, t) {
			document.body.classList.remove("fn-on", "cfg-on");
			//body.removeClass("fn-on cfg-on");
			pageIndex = i;
			if (0 >= pageIndex) {
				//如果页面<=0,上一章;
				//pageIndex = 1;
				//upChapter();
				window.page(Page.index1 - 1).then(function(foo1) {
					window.section(pageCount, 0)
				});
			} else if (pageIndex > pageCount) {
				//如果页码>页数,下一章;
				pageIndex = pageCount;
				nextChapter()
			} else {
				Z = (pageIndex / pageCount).toFixed(2);
				scroll(pageIndex, 0==t?0:(t || 400))
				void cacl();
			}
			Page.index2 = pageIndex;
			return;
		};
		Page.resize = function() {
			document.body.classList.remove("cfg-on", "fn-on")
			//body.removeClass("cfg-on").removeClass("fn-on");
			"lr" == Direction && cacl(Z);
		};
		(function() {
			var t = {},
				n = {},
				o = !1,
				tap_hdl = document.getElementById("tap-hdl"),
				a = document.getElementById("rd-txt"),
				r = tap_hdl.getBoundingClientRect().width || tap_hdl.offsetWidth,
				s = $(tap_hdl).height(),
				c = function() {},
				d = function(t) {
					setTimeout(t || c, 0)
				},
				l = 0,
				f = 0,
				isMobile = navigator.userAgent.indexOf("Mobile") > -1,
				u = {
					//切换事件
					handleEvent: function(e) {
						switch (e.type) {
							case "mousedown":
							case "touchstart":
								this.start(e);
								break;
							case "mousemove":
							case "touchmove":
								this.move(e);
								break;
							case "mouseup":
							case "losecapture":
							case "touchend":
								d(this.end(e));
								break;
							case "webkitTransitionEnd":
							case "msTransitionEnd":
							case "oTransitionEnd":
							case "otransitionend":
							case "transitionend":
								d(this.transitionEnd(e))
						}
						e.stopPropagation()
					},
					start: function(e) {
						if (!H) { //判断是否上下模式
							if (e.touches) {
								var a = e.touches[0];
							} else {
								var a = e;
							}
							t = {
									x: a.pageX,
									y: a.pageY,
									time: +new Date
								},
								o = void 0,
								n = {}
							if (e.touches) {
								tap_hdl.addEventListener("touchmove", this, !1);
								tap_hdl.addEventListener("touchend", this, !1);
							} else {
								tap_hdl.addEventListener("mousemove", this, !1);
								tap_hdl.addEventListener("mouseup", this, !1);
							}
						}
					},
					move: function(e) {
						if (e.touches) {
							var r = e.touches[0];
							var bool = !(e.touches.length > 1 || e.scale && 1 !== e.scale)
						} else {
							var r = e;
							var bool = !(e.scale && 1 !== e.scale);
						}
						if (bool) {
							//i.preventDefault();
							n = {
								x: r.pageX - t.x,
								y: r.pageY - t.y
							};
							"undefined" == typeof o && (o = !!(o || Math.abs(n.x) < Math.abs(n.y)))
							if (!o && "lr" == Direction) {
								e.preventDefault();
								if (1 == pageIndex && n.x > 0) return;
								if (pageIndex == pageCount && n.x < 0) return;
								move(a, 0, pageLeft + n.x, 0)
							}
						}
					},
					end: function(e) {
						var a = +new Date - t.time,
							c = !1;
						"lr" == Direction && (c = Number(a) < 250 && Math.abs(n.x) > 20 || Math.abs(n.x) > r / 4);
						"ud" == Direction && (c = Number(a) < 250 && Math.abs(n.y) > 20 || Math.abs(n.y) > s / 4);
						if (!o && "lr" == Direction) {
							var d = 1 == pageIndex && n.x > 0 || pageIndex == pageCount && n.x < 0;
							if (d) return void(1 == pageIndex && n.x > 0 ? upPage(200) /* upChapter() */ : pageIndex == pageCount && n.x <
								0 && nextChapter());
							c ? (n.x > 0 && upPage(200), n.x < 0 && nextPage(200)) : scroll(pageIndex, 200)
						}
						if (o && "ud" == Direction) {
							var h = $(window);
							n.y < 0 && (f--, f = Math.max(f, 0));
							n.y > 0 && (l--, l = Math.max(l, 0));
							n.y < 0 && body.scrollTop() + h.height() >= body.height() && (l++, l >= 2 && nextChapter());
							n.y > 0 && body.scrollTop() <= 0 && (f++, f >= 2 && upPage(200) /* upChapter() */ )
						}
						if (e.touches) {
							tap_hdl.removeEventListener("touchmove", u, !1);
							tap_hdl.removeEventListener("touchend", u, !1);
						} else {
							tap_hdl.removeEventListener("mousemove", u, !1);
							tap_hdl.removeEventListener("mouseup", u, !1);
						}
					}
				};
			//if(isMobile){
			tap_hdl.addEventListener("touchstart", u, !1)
			//}else{
			tap_hdl.addEventListener("mousedown", u, !1);
			//}
		})();

		//初始化
		window.addEventListener("load", function() {
			//点击显示目录
			document.getElementById("idx-zd").onclick = function() {
				Page.showList();
				return;
			}
		}, false);
	}();
store = {
	create: function() {
		var data = {
			key: "name",
			index: {
				name: true,
				val: false
			}
		};
		return DB.Table.create("store", "store", data).then(function(json) {
			DB.DB.close();
			return true;
		}).catch(function(e) {
			DB.DB.close();
			return Promise.reject(false);;
		});
	},
	setItem: function(name, value) {
		var json = {
			"name": name,
			"val": value
		};
		return DB.Data.put("store", "store", json).catch(function(e) {
			return store.create().then(function() {
				return DB.Data.put("store", "store", json)
			})
		}).then(function(foo1) {
			DB.DB.close();
			return true;
		}).catch(function(e) {
			DB.DB.close();
			return false;
		});
	},
	getItem: function(name) {
		return DB.Data.getKey("store", "store", name).catch(function(e) {
			return store.create().then(function() {
				return DB.Data.getKey("store", "store", name);
			})
		}).then(function(json){
			DB.DB.close();
			return json.val;
		}).catch(function(e) {
			DB.DB.close();
			return false;
		});
	},
	clear: function() {
		return DB.Table.clear("store", "store").catch(function(e) {
			return store.create().then(function() {
				return DB.Table.clear("store", "store")
			})
		}).then(function(json) {
			DB.DB.close();
			return json.val;
		}).catch(function(e) {
			DB.DB.close();
			return false;
		});
	}
}
