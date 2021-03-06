
String.prototype.post=function(str,fun) {
  var xmlHttp=xmlhttp(); 
  xmlHttp.onreadystatechange=function(){
    if(xmlHttp.readyState==4) { 
     fun(xmlHttp.responseText)
    }
  }
  xmlHttp.open("POST",this,true); 
  xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlHttp.send(str); 
}
  
xmlhttp=function(){
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
}

gethtml=async function(url){
  return new Promise(function(resolve){
    var xmlHttp=xmlhttp();
    xmlHttp.timeout=20000;
    xmlHttp.onreadystatechange=function(){
      if(xmlHttp.readyState==4) { 
        var re={html:xmlHttp.responseText,
             url:xmlHttp.responseURL};
             //alert(re.html)
        resolve(re)
      }
    }
    xmlHttp.ontimeout = function(e) {
      prompt(url,url);
      var err=new Error()
      xmlHttp.abort();
      resolve("");
      throw setError("ajax超时20s","url:"+url);
      
      
    };
    xmlHttp.open("GET",url,true); 
    xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlHttp.send(); 
  });
}

String.prototype.get=function(fun) { 
  get(this,fun);
}
  	
post=function(path,str,fun) {  
  var xmlHttp=xmlhttp(); 
  xmlHttp.onreadystatechange=function(){
    if(xmlHttp.readyState==4) { 
     fun(xmlHttp.responseText)
    }
  }
  xmlHttp.open("POST",path,true); 
  xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlHttp.send(str); 
}

get=function(path,fun,timeOutFun) {  
  var xmlHttp=xmlhttp(); 
  xmlHttp.onreadystatechange=function(){
    if(xmlHttp.readyState==4) { 
     fun(xmlHttp.responseText)
    }
  }
  xmlHttp.open("GET",path,true); 
  xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlHttp.send(); 
}

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

Array.prototype.add=function(i,arr){
    var a=this
    return a.slice(0,i).concat(arr,a.slice(i));
}

Array.prototype.del=function(i){
  var arr1=this.slice(0,i)
  var arr2=this.slice(i)
  arr2.shift();
  return arr1.concat(arr2);
}
ajaxWorker=function(arr,fun){
    var worker =new Worker("script/ajaxWorker.js"); 
    worker.onmessage =function (e){
        var data=e.data;
        fun(data)
     }
     worker.onerror=function(e){
            alert("这是异常是：\nfilename:" + e.filename + "\nlin:"+ e.lineno + "\nmessage:" + e.message); 
   }
     worker.postMessage(arr); 
}

get_js=function(js){
  post(js,"",function(a){
    eval(a);
  });
}


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

//获取自定义时间格式
getDate=function(){
  var date=new Date()
  var _date=date.toLocaleDateString();
  var hours=date.getHours();
  var minute=date.getMinutes();
  var second=date.getSeconds();
  date=_date+" "+hours+":"+minute+":"+second;
  return date;
}
formatDate=function(d){
	var year=d.getFullYear(),
	month=d.getMonth()+1,
	date=d.getDate(),
	hours=d.getHours(),
	minutes=d.getMinutes(),
	secondes=d.getSeconds();
	month=month<10?"0"+month:month;
	date=date<10?"0"+date:date;
	hours=hours<10?"0"+hours:hours;
	minutes=minutes<10?"0"+minutes:minutes;
	secondes=secondes<10?"0"+secondes:secondes;
  return `${year}-${month}-${date} ${hours}:${minutes}:${secondes}`
}
//定义静态变量
static=new Proxy({},{
  get:function(oTarget, sKey){
    var re=arguments.callee.caller[sKey];
    return re;
  },
  set:function(oTarget, sKey, vValue){
    arguments.callee.caller[sKey]=vValue;
  } 
});
//动态加载js
includejs=function(src,bool=true){
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
//获取网页源文本
gettext= function(url){
  var xmlHttp=xmlhttp(); 
  var re=""
  xmlHttp.onreadystatechange=function(){
    if(xmlHttp.readyState==4) { 
      re=xmlHttp.responseText;
    }
  }
  xmlHttp.open("GET",url,false); 
  xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlHttp.send(); 
  return re;
}

setError=function(name,message){
  var err=new Error()
  err.name=name;
  err.message=message;
  return err;
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

showEval=function(a){
    if(!window.ifr1){
    var ifr=document.createElement("iframe");
    ifr.id="ifr1";
    document.body.appendChild(ifr);
    ifr.src="http://git.docfeng.top/eval.html"
  
  ifr.style="width:100%;height:100%;position:absolute;top:0px;left:0px;";
    }else{
        ifr1.style.display="block"
    }
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
	async handleEvent(e) {
		var type = e.eventType;
		var fun = this.fun[type];
		if (fun) {
			var re = await fun();
			if (re) {
				delete this.fun[type];
			}
		};
		if(type!="onback"){
			window.history.replaceState(null, null, '');
		}
		//alert(type)
		window.history.pushState('forward', null, '');
		
	},
	remove() {
		window.removeEventListener("back", this, false);
	},
	set(state, fun) {
		window.history.replaceState(state, null, '');
		window.history.pushState('forward', null, '');
		//this.state.push(state);
		this.fun[state] = fun;
	},
	addEvent(fun) {
		var state = "event" + this.num;
		this.num++;
		window.history.replaceState(state, null, '');
		window.history.pushState('forward', null, '');
		//this.state.push(state);
		this.fun[state] = fun;
		return state
	},
	removeEvent(state) {
		if (this.fun[state]) {
			delete this.fun[state];
			//window.history.go(-1)
		}
	},
	fireEvent(state) {
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

fullScreen = function(obj) {
	var el = obj || document.documentElement;
	var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
	if (typeof rfs != "undefined" && rfs) {
		rfs.call(el);
	};
	return;
}
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
//evt.addEvent(function(){document.querySelector("#contextmenu").style.display="none";})