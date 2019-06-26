zipFile=function(){
    	this.index=0;
    this.path="zip";
    this.fun();
}
zipFile.prototype.fun=function(){
  this.ini=function(arr){
    var t=this;
    t.path=win.name;	
    fso.createFolder(t.path);
    fso.createFolder(t.path+"/META-INF");
    fso.createFolder(t.path+"/OPS");
    fso.createFolder(t.path+"/OPS/css");
    fso.copy("1/main.css",t.path+"/OPS/css/main.css");
    fso.copy("1/mimetype",t.path+"/mimetype");
    fso.copy("1/container.xml",t.path+"/META-INF/container.xml")
    fso.copy("1/coverpage.html",t.path+"/OPS/coverpage.html");
    t.arr=arr;
    t.index=0;
    t.copyopf();
    	t.copyncx();
  }

  this.copyopf=function(){
    var t=this;
    var list=t.arr;    
    var path=this.path;
    var opf="";
    var opf2="";
    for(var i=0;i<list.length;i++){
      opf+='<item id="page'+i+'" href="page'+i+'.html" media-type='+
          '"application/xhtml+xml"/>\n';
      opf2+='<itemref idref="page'+i+
           '" linear="yes"/>\n';
    }
    fso.read("1/fb.opf",function(txt){
      var txt=txt.replace("包含文件",opf);
      txt=txt.replace("逻辑目录",opf2);
      txt=txt.replace("书名",win.name);
      path=path+"/OPS/fb.opf"
      fso.write(path,txt,false);
    });
  }
  
  this.copyncx=function(){
  	  var t=this;
    var list=this.arr;
    var ncx="";
    for(var i=0;i<list.length;i++){
      ncx+='<navPoint id="page'+i+
        '" playOrder="'+(i+3)+
        '">\n<navLabel><text>'+list[i][1]+
        '</text></navLabel>\n<content '+
      'src="page'+i+'.html"/>\n</navPoint>\n'; 
    }
    fso.read("1/fb.ncx",function(txt){
      var txt=txt.replace("目录",ncx);
      var path=t.path+"/OPS/fb.ncx";
      fso.write(path,txt,false);
      //var txt=fso.read("1/page.html");
      alert(parseInt((list.length+1)/20));
      /*for(var i=0;i<parseInt((list.length-1)/20)+1;i++){
      var path=this.path+"/OPS/page"+i+".html"
      fso.write(path,txt,false);
    }*/
    });
  }
  	
  	this.copyPage=function(text,i){
  	    var t=this;
  	    if(text==""){
  	        console.log(i+" is blank");
  	        return "";
  	    }else{
  	      this.index++;
  	    		t.len=win.end-win.start;
        win.index=t.index+"/"+t.len;
        win.progress=t.index/t.len*100+"%";
  		   }
  		   text=text.replace(/\n/g,"<br />\n");
  	    //var x=parseInt(i/20);
  	    //var y=i%20;
  	    /*if(!this.pageText){
  	        this.pageText=[];
  	    }
  	    if(!this.pageText[x])
  	    {
  	      this.pageText[x]=[];
  	    }
  	    this.pageText[x][y]=text;
      if(this.pageText[x].length==20){
        var path=this.path+"/OPS/page"+parseInt(i/20)+".html"
        var txt=fso.read(path);
        this.pageText[x].forEach(function(val,index){
          //txt=txt.replace("标题",this.arr[i][1]);
          txt=txt.replace("内容"+index,'<div id="p'+index+'">'+val+"</div>");
        });
        fso.write(path,txt,false);
      }*/
      fso.read("1/page.html",function(txt){
        var path=t.path+"/OPS/page"+i+".html"
        //var txt=fso.read(path);
        //txt=txt.replace("标题",this.arr[i][1]);
        txt=txt.replace("内容0",text);
        fso.write(path,txt,false);
      });
      
     }
}
$(document).ready(function(){
  //msg("zip");
});


















