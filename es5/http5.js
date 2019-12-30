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
        var str=json.str||json.data||null;
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
					var x = new Uint8Array(xmlHttp.response);
					var type=xmlHttp.getResponseHeader("Content-Type");
					if(type.match(/utf-8/i)){
						var str =new TextDecoder('utf-8').decode(x);
					}else{
						var str =new TextDecoder('gbk').decode(x);
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
                   //alert(url)
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
			xmlHttp.responseType="arraybuffer";
            xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
			xmlHttp.overrideMimeType("text/html;charset=utf-8")
            xmlHttp.send(str); 
        });
    }
}
/*var get=function(){
http.cors("http://www.baidu.com").then(function(re){
	alert(re)
});
}
get()*/ 