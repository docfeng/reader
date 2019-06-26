self.importScripts("base.js?i=0");

onmessage = function (event) { 
    var data=event.data;
    page.arr=data[1];
    page.i=data[0];
    page.len=page.arr.length;
    page.download();
}

Page=function(){
	this.i=0;
	this.index=0;
	this.arr=[];
	this.len=0;
	this.result=[];
	this.fun();
}
Page.prototype.fun=function(){
  this.getpage=function(){
    var t=this;
    var arr=t.arr.shift();
    var count=0;
    if(!arr){
       if(t.index==t.len){
          postMessage(["message","close2"]);
          self.close();
        }
      return 0;
    }
    var i=t.i+t.len-t.arr.length-1;
    var url=arr[0];
    var fun=function(html){
      var txt1=html.replace(/(<br[^>]*?>[ \s]*){1,}/g,'\n');
      txt1=txt1.replace(/&nbsp;/g,' ');
      txt1=txt1.replace(/<script>.*?<\/script>/g,'');
      txt1=txt1.match(/>([^<>]{100,})</);
      txt1=txt1?txt1[1]:"";
      txt1=txt1.replace(/\n/g,'<br />\n');
      if(txt1==""){
        if(count<3){
          count++;
          url.get(fun);
        }else{
          postMessage(["message","no "+i]);
        }
      }else{
        data=["page",txt1,i,url]
        postMessage(data);
        t.index++;
      }
      t.getpage();
    }    		
    url.get(fun);
  }
  	
  this.download=function(){
    var t=this;
    t.getpage();
    t.getpage();
    t.getpage();
  }
}
page=new Page()


/*var name = setInterval("postData()",1000); 
postData=function(){
	postMessage(["message","setInterval"]);
}
*/

















