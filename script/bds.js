/*
搜索结果:bds/{}/{}.json
目录:bds/{}/list.json;
    Shelf/{}.json
章节:bds/{}/page/page{}.txt;
书架:Shelf/Shelf.json;

本地储存:Shelf/
   书架:Shelf/Shelf.json
   目录:Shelf/{}.json
   搜索|源:Shelf/{}_search.json
   章节:Shelf/{}/page/page{}.txt
   
操作:
  搜索:search [[url,title,realurl]]
    获取搜索 get(name) return arr
                                format(html)
    格式化     format(html) return arr
    获取真实搜索结果 getsearchreal(arr) return [title,url]
    保存搜索结果 save(name,arr[title,url])
    读取搜索结果 read(name) return [title,url]
    
    显示搜索结果 showsearch(arr);
    
  书架:Shelf
    读取书架 readShelf() {name,url,oldpage,newpage,update}
    修改|新增 书架 setShelf(json)
    更新书架 updateShelf() 
    删除书架 deleteShelf();
    保存书架 saveShelf(json)
    
    显示书架 showShelf(json)
    显示第i个书架 showShelf(index);
  
  目录:List [url,title]
    读取目录 readList(name);
    获取|更新 目录 getList(name,url);
             获取目录html getListhtml(url)
             格式化目录   iniList(html,url)
    保存目录 saveList(name,arr);
    
    显示目录 showList(arr);
  
  章节:page
    获取|更新章节 getpage(url)
    读取章节  readpage(index);
    保存章节 savepage(index,text)
    显示章节 showpage();
    
书架流程:
  1.读取书架
  2.显示书架
  3.其他操纵
    1.输入名称点击搜索>>
    2.更新书架>>
      1.获取目录>>>>>>>
      2.更改书架
      3.显示第i个书架
      4.目录全部获取完成，确定是否更新
      5.保存书架
    3.长按第i个，删除书架
      1.确定删除,删除第i个内容
      2.保存书架
      3.显示书架
    4.点击第i个,显示目录
      1.第i个排到第一个
      2.保存书架
      3.显示书架
      4.跳到目录页>>>>>>>>
    5.书架重载
      1.读取书架
      2.显示书架
           
目录流程:
  1.读取目录 | 获取目录
  2.显示目录
  3.其他操纵
    1.换源,跳到search处理
    2.点击第i个,跳到page处理
    3.点击下载
      获取page
      保存page
    4.更新
      1.获取目录
      2.显示目录
      3.保存目录
    5.
    
  
    
    
*/

bds={
  get:async function(str){
      //搜索
      var str=str;
      var html=await http.get("http://www.baidu.com/s?q1="+str+
          "&q2=&q3=&q4=&rn=20&lm=0&ct=0"+
         "&ft=&q5=1&q6=&tn=baiduadv");
       return this.format(html);
  },
  formats(html){
    var arr=[];
    var el = document.createElement( 'html' );
    el.innerHTML =html;
    var d=el.getElementsByTagName("div");
    for(var i=0;i<d.length;i++){
        if(d[i].id && d[i].id<21){
            var a=[];
             a[0]=d[i].querySelector("a").innerHTML;
             a[1]=d[i].querySelector("a").href;
             //a[2]=d[i].querySelector(".c-showurl").innerHTML;
             //a[3]=d[i].outerHTML;
            arr[arr.length]=a;
        }
    }
   return arr
  },
  save(name,arr){
    //保存搜索结果
    if(!fso.fso.exist("Shelf/"+name)){
       if(!fso.fso.exist("Shelf")){
           fso.fso.createFolder("Shelf");
        }
        fso.fso.createFolder("Shelf/"+name);
    }
    return fso.fso.write(`Shelf/${name}/Source.json`,JSON.stringify(arr),false);
  },
  async read(str){
    //获取本地保存的搜索结果
    var json=await fso.read(`Shelf/${name}/Source.json`);
    if(json=="false"){
        json="[]";
    }
    json=this.json=JSON.parse(txt);
    return json;
  },
  saveList(name,arr){
  
  },
  saveShelf(name,arr,url,i){
    var i=i||0;
    var json={
        name:name,
        url:url,
        oldpage:{title:arr[i][1],url:arr[i][0],Date:new Date()},
        newpage:{title:arr[arr.length-1][1],url:arr[arr.length-1][0],Date:new Date()},
        update:false
      };
    Shelf.addBook(json);
  },
  saveall(name,arr,url){
    this.savelist(name,arr);
    this.saveShelf(name,arr,url);
  }
}

funcs={
  //显示书架
  getShelf(){
      
  },
  getfilelist(){
    //获取文件列表
    var arr=bds.getfilelist();
    //显示
    this.showt1(arr);
  },
  //保存搜索结果
  savesearch(){
    var arr=this.arr;
    bds.savesearch(this.name,arr);
  },
  //百度搜索
  async search(str){
    var str=str||this.name||"";
    if(!str)return 0;
    var arr=await bds.get(str);
    this.arr=arr;
    this.showt2(arr);
  },
  //获取本地搜索结果
  getsearch(name){
    var arr=bds.getsearch(name||this.name);
    this.arr=arr;
    this.showt2(arr);
  },
  //书架页点击事件,获取本地搜索结果,并显示
  async tfun1(obj){
        var obj=obj.parentNode;
        var i=obj.rowIndex;
        var str=f6_table1.rows[i].cells[0].innerHTML;
        this.name=str;
        this.getsearch();
  },
  //搜索页点击事件,显示目录
  async tfun2(obj){
      var obj=obj.parentNode;
      var i=obj.parentNode.rowIndex;
      var str=this.name;
      var arr=this.arr;
      var t=this;
      //如果本地没有结果;
      if(!arr[i][3]){
        var json=await bds.getlisthtml(arr[i][0]);
        var url=arr[i][0]=json.url;
        arr[i][3]=true;
        this.showt2(arr);
        var basepath="bds/"+str+"/"+json.url.match(/https?:\/\/([^\/]*?)\//)[1];
        fso.write(basepath+".txt",json.html,false,function(a){alert(true)});
        bds.savesearch(str,arr);
        inilist(json,function(arr){
          t.listarr=arr;
          //显示目录
          //t.showt3(arr);
          List.show(str,arr,url);
          //保存目录;
          bds.saveall(str,arr,url);
          //保存源
          fso.fso.write(basepath+".json",JSON.stringify(arr),false);
        });
        
      }else{
        var listbasepath="bds/"+str+"/"+arr[i][0].match(/https?:\/\/([^\/]*?)\//)[1];
        if(fso.fso.exist(listbasepath+".json")){
          var arr2=fso.fso.read(listbasepath+".json");
          arr2=JSON.parse(arr2);
          this.listarr=arr2;
          //显示目录
          List.show(str,arr2,arr[i][0]);
          //this.showt3(arr2);
          //保存目录
          bds.savelist(str,arr2);
          bds.saveShelf(str,arr2,arr[i][0]);
        }else{
          var html=fso.fso.read(listbasepath+".txt");
          var url=arr[i][0];
          inilist({html:html,url:url},function(arr){
            fso.fso.write(listbasepath+".json",JSON.stringify(arr),false);
            t.listarr=arr;
            //显示目录
            //t.showt3(arr);
            List.show(str,arr,url);
            //保存目录
            bds.saveall(str,arr,url);
            //alert(arr)
          });
        }
      }
      win.url=this.arr[i][0];
  },
  //搜索页双击事件,重载目录
  async tfun2_2(obj){
      var obj=obj.parentNode;
      var i=obj.parentNode.rowIndex;
      var str=this.name;
      var arr=this.arr;
      var t=this;
      var json=await bds.getlisthtml(arr[i][0]);
      var basepath="bds/"+str+"/"+json.url.match(/https?:\/\/([^\/]*?)\//)[1];
      fso.write(basepath+".txt",json.html,false,function(a){alert(true)});
      inilist(json,function(arr){
          t.listarr=arr;
          //显示目录
          //t.showt3(arr);
          List.show(str,arr,json.url);
          //保存目录
          bds.savelist(str,arr);
          bds.saveShelf(str,arr,json.url)
          fso.fso.write(basepath+".json",JSON.stringify(arr),false);
      });
  },
  //目录页点击事件,小说内容
  async tfun3(obj){
      var obj=obj.parentNode;
      var i=obj.parentNode.rowIndex;
      var str=this.name;
      var arr=this.listarr;
      var pageurl=arr[i][0];
      var pagename=arr[i][1];
      this.showpage(pageurl);
  },
  tfun4(obj){
      var obj=obj.parentNode;
      var i=obj.parentNode.rowIndex;
      var str=this.name;
      var arr=this.listarr;
      i+=arr.length-20;
      var pageurl=arr[i][0];
      var pagename=arr[i][1];
      this.showpage(pageurl);
  },
  //显示书架
  showt1(arr){
    var txt="";
    for(var i=0;i<arr.length;i++){
      txt+="<tr><td>"+arr[i]+"</td></tr>";
    }
    f6_table1.innerHTML=txt;
  },
  //小说搜索结果
  showt2(arr){
    var txt1=""
    for(var i=0;i<arr.length;i++){
      var txt2="<tr><td><h3>"+arr[i][0]+"</h3><h4>"+arr[i][1]+"</h4><h4>"+arr[i][2]+"</h4></td></tr>";
      txt1+=txt2;
    }
    f6_table2.innerHTML=txt1;
  },
  //显示目录
  showt3(arr){
    var txt1=""
    for(var i=0;i<30;i++){
      var txt2="<tr><td><h3>"+arr[i][0]+"</h3><h4>"+arr[i][1]+"</h4><h4>"+arr[i][2]+"</h4></td></tr>";
      txt1+=txt2;
    }
    f6_table3.innerHTML=txt1;
    this.showt4(arr);
  },
  //显示目录(最新20)
  showt4(arr){
    var txt1=""
    for(var i=arr.length-20;i<arr.length;i++){
      var txt2="<tr><td><h3>"+arr[i][0]+"</h3><h4>"+arr[i][1]+"</h4><h4>"+arr[i][2]+"</h4></td></tr>";
      txt1+=txt2;
    }
    f6_table4.innerHTML=txt1;
  },
  //显示文章内容
  async showpage(title,url){
      var json=await bds.getpage(url);
      //alert(JSON.stringify(json));
      var config={left:"0px",top:"0px",width:"100%",height:"100%"};
      var txt=json.txt.replace(/\n/g,"<br/>");
      //alert(txt)
      var nextbutton=`<input type="button" onclick="funcs.showpage('${json.nexturl}')" value="next">`
      txt=`<div style="text-align:left;height:580px;overflow-x:hidden;overflow-y:scroll;">${txt}${nextbutton}</div>`;
      var title=title||json.title;
      msg(title,txt,config);
  },
  set name(str) {
      f6_txt1.value=str;
  },
  get name() {
      return f6_txt1.value;
  }
}

window.addEventListener("load",function(){
  funcs.getShelf();
},false);



bdstoa=function(json){
  var reg=new RegExp("<a[^>]*?>((?!<\/a>).)*?"+json.str+
        "((?!<\/a>).)*?<\/a>","g");
  var arr=json.html.match(reg);
  var urls=[];
  for(var i=0;i<arr.length;i++){
    arr[i]=arr[i].replace(/<[\/]?em>/g,"");
    var url=arr[i].match(/<a[^>]*?"(.*?)"[^>]*?>(.*?)<\/a>/);
    url.shift();
    urls[urls.length]=url;
  }
  return urls;
}

bdstoa2=function(json){
  var divs=json.html.replace(/<[\/]?em>/g,"");
  divs=divs.match(/<div[^>]*?id="[\d]+"[^>]*?>[\s\S]*?<\/div><\/div>/g);
  //alert(divs[0])
  var urls=[];
  for(var i=0;i<divs.length;i++){
    var reg=new RegExp("<a[^>]*?\"(.*?)\"[^>]*?>((?:(?!<\/a>).)*?"+json.str+
        "(?:(?!<\/a>).)*?)<\/a>");
    var arr=divs[i].match(reg);
    try{
      arr.shift();
    }catch(e){
      alert(divs[i])
      alert(arr)
      break;
    }
    var reg1=new RegExp("<a[^>]*?href=\"("+"[^>]*?"+")\"[^>]*?>((?=http|www).*?)<\/a>");
    var arr1=divs[i].match(reg1);
    //if(i==0){alert(arr1);alert(arr)}
    if(arr1&&arr[0]==arr1[1]){
      var url="";
      try{
        url=arr1[2].match(/(?:https?:\/\/)?([^\/]*?)\//)[1];
      }catch(e){
        url=arr1[2];
      }
      arr[arr.length]=url;
    }
    urls[urls.length]=arr;
  }
  return urls;
}

showbds=function(arr){
  var txt1=""
  for(var i=0;i<arr.length;i++){
    var txt2="<tr><td><h3>"+arr[i][0]+"</h3><h4>"+arr[i][1]+"</h4><h4>"+arr[i][2]+"</h4></td></tr>";
    txt1+=txt2;
  }
  f6_table2.innerHTML=txt1;
}

/*bds("我要做门阀").then(function(a){
  urls=a
});
*/
ajax=function(path,fun,timeOutFun) {  
    var xmlHttp=xmlhttp();
  xmlHttp.onreadystatechange=function(){
   // alert(xmlHttp.statusText)
    if(xmlHttp.readyState==4) { 
     fun({html:xmlHttp.responseText,
             url:xmlHttp.responseURL});
    }
  }
  xmlHttp.open("GET",path,true); 
  xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlHttp.send(); 
}
class AJAX{
  constructor(){
    this.json={};
    window.xmls||(window.xmls=[xmlhttp(),xmlhttp(),xmlhttp(),xmlhttp(),xmlhttp()]);
    window._xmls||(window._xmls=[]);
  }
  getxml(){
    for(var i=0;i<xmls.length;i++){
      if(xmls[i].readyState==4||xmls[i].readyState==0){
        return xmls[i];
      }
    }
    return false;
  }
  open(method,path,bool){
    this.json.method=method;
    this.json.path=path;
    this.json.bool=bool;
  }
  set T(fun){
    this.json.t=fun;
  }
  set F(fun){
    this.json.f=fun;
  }
  begin(xml,json){
    var js=json;
    var t=this;
    xml.onreadystatechange=function(){
        if(this.readyState==4) { 
          if(js.t)js.t(this.responseText);
          if(_xmls.length>0){
            var json=_xmls.shift();
            t.begin(this,json);
          }
        }
    }
    xml.open(json.method,json.path,json.bool);
    xml.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xml.send();
  }
  send(){
    var xml=this.getxml();
    if(xml==false){
       _xmls[_xmls.length]=this.json;
    }else{
      var json=this.json;
      this.begin(xml,json);
    }
  }
};
inilist=function(json,fun){
  var html=json.html;
  var url=json.url;
  var my_arr=[];
  var name="";
  var H="";
  var fun2=function(html){
     //获取名称
     if(!name){
         name=html.match(/<title>([^<]*?)[_|-|最新|章节|目录|全文阅读][^<]*?</);
         if(name)name=name[1];
     }
     if(!H)H=html;
     //获取目录
     //alert(html)
     var reg_di=new RegExp("<a[^>]*?href=[\"']([^\"'>]*?)[\"'][^>]*?>(第[^\-<]*?)<","g");
     var url_arr=html.matches(reg_di);
     for(var i=0;i<url_arr.length;i++){
          url_arr[i][0]=url_arr[i][0].getFullUrl(url);
     }
     //alert(url_arr)
     if(!url_arr)return 0;
     //alert(url_arr)
     my_arr[my_arr.length]=url_arr;
     //if(!confirm(my_arr)){return 0;}
     //下一页地址
     var reg=/<a[^>]*?href=["|']([^"']*?)["|][^>]*?>([^<第]*?下一页[^<]*?)</;
     var nexturl=html.match(reg);
     //alert(nexturl)
     if(nexturl){
       nexturl=nexturl[1].getFullUrl(url);
       //alert(nexturl);
       //alert(my_arr)
       getHTML(nexturl,fun2);
     }else{
          var index=0;
          //alert(my_arr)
          if(my_arr.length>1&&my_arr[0].length>3){
              for(var i=0;i<my_arr[0].length;i++){
                    if(my_arr[0][i][0]==my_arr[1][i][0]){
                        index++;
                    }
              }
              var arr=[];
              for(var i=0;i<my_arr.length;i++){
                  for(var i2=0;i2<index;i2++){
                      my_arr[i].shift();
                  }
                  arr=arr.concat(my_arr[i]);
              }
              my_arr=arr;
          }
          //alert(my_arr)
          if(my_arr.length==1){my_arr=my_arr[0]}
          //alert(my_arr)
          fun(my_arr,name,H);
     }
  }
  fun2(html);
}


getpage_async=async function(url){
  var json=await gethtml(url);
  var html=json.html
  return new Promise((resolve)=>{
      ini({"html":html,"url":url},function(json){
        resolve(json);
      });
  });
}
  
ini=function(json,fun){
  try{
      var txt="";
      var html=json.html.replace(/(<br[^>]*?>[ \s]*){1,}/g,'\n');
      //alert(html)
      html=html.replace(/(<p>)/g,'');
      html=html.replace(/(<\/p>)/g,'\n');
      html=html.replace(/&nbsp;/g,' ');
      //匹配小说名称
      var novelname=html.match(/《([\u4e00-\u9fa5]+)》/);
      novelname=novelname?novelname[1]:"";
      //匹配章节名称
      var title=json.html.match(/>(第[^<]*?章[\u0020]*[\u4e00-\u9fa5]+)[^<]*?</);
      title=title?title[1]:"";
      //匹配正文
      var atxt=html.match(/>([^<]{300,})</g);
      atxt=atxt?atxt:"";
      //alert(html)
      //alert(atxt)
      for(var i=0;i<atxt.length;i++){
        var elen=atxt[i].match(/[A-Za-z]/g);
        if(!elen || elen.length/atxt[i].length<0.06){
          txt=atxt[i];
          txt=txt.match(/>([^<]{100,})</)
        }
      }  

      txt=txt?txt[1]:"";
      //匹配下一章地址
      var reg=/<a[^>]*?href="([^"]*?)"[^>]*?>下[^<]*?</;
      var nexturl=html.match(reg);
      nexturl=nexturl?nexturl[1]:"";
      nexturl=nexturl.getFullUrl(json.url);
      //
      var re={"novelname":novelname,
               "title":title,
               "txt":txt,
               "url":json.url,
               "nexturl":nexturl
               }
      //是否有分章
      if(nexturl.indexOf("_")>nexturl.length-8){
        getHTML(nexturl,function(html){
          ini({"html":html,"url":nexturl},function(a){
           re.txt+=a.txt;
           re.nexturl=a.nexturl;
           fun(re);
          })
        });
      }else{
        fun(re);
      }
  }catch(e){
    //alert(e.message);
    var re={"novelname":"",
               "title":"",
               "txt":"",
               "url":"",
               "nexturl":""
    };
    fun(re);
  }
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
         if(url2.slice(0,2)=="//"){
           re=url2;
         }else{
           re=root_url+url2;
         }
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



//bdstohtml(urls[3][0]).then(function(a){alert(JSON.stringify(a))});