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
//window.alert = (...args) => { oalert(...args); console.error(new Error('someone alerted'))}