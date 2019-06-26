//var start = new Date().getTime();
var index=0;
onmessage = function (event) { 
    var arr=event.data;
    arr.forEach(function(url,i){
        var text=get(url,function(html){
          postMessage([i,html]);
          index++;
          if(index==arr.length){
            postMessage("close");
            self.close();
          }
        });
        
    	});
    //	var end = new Date().getTime();
    
}

get=function(path,fun) {
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
  xmlHttp.timeout=20000;
  xmlHttp.onreadystatechange=function(){
    if(xmlHttp.readyState==4) { 
        fun(xmlHttp.responseText);
        xmlhttp="";
    }
  }
  xmlHttp.ontimeout = function(e) {
    postMessage("close");
    xmlHttp.abort();
  };
  //xmlHttp.onerror = function(e) { ... };
  //xmlHttp.upload.onprogress = function(e) { ... };
  xmlHttp.open("GET",path,true); 
  xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlHttp.send();
}

/*var name = setInterval("postData()",1000); 
postData=function(){
	postMessage(["message","setInterval"]);
}
*/




