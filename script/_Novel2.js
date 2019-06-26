getHTML=function(url,fun){
  //post("http://fujianyixue.win/get.php","url="+url,fun);
  url.get(fun);
}

iniarr=function(arr){
  var my_arr=[];
  for(var i in arr){
    if(!arr[i][1]) break;
    var index=arr[i][1].match(/第(.*?)章/)[1].toNum()
    my_arr[index]=arr[i];
  }
  my_arr.shift();
  return my_arr;
}
var url="https://m.liewen.cc/b/28/28929/15130480.html";
url="https://m.liewen.cc/b/28/28929/"

Novel=function(){
  this.fun();
}

Novel.prototype.fun=function(){
  var t=this;
  this.ini=function(url,fun){
    t.url=url;
    getHTML(url,function(html){
      //匹配小说名称
    var novelname=html.match(/《([\u4e00-\u9fa5]+)》/);
    novelname=novelname?novelname[1]:"";
    t.name=novelname;
      //判断是否目录
      var reg=new RegExp("<a[^>]*?href=\"([^\"]*?)\".*?>(第[^<1-9]*?)<","g");
      var url_arr=html.matches(reg);
       if(url_arr.length<10){
          var listurl=html.match(/<a[^>]*?href="([^"]*?)".*?>目录</)[1];
          listurl=listurl.getFullUrl(url);
          if(listurl){
              t.listurl=listurl;
              getHTML(listurl,function(html){
                 t.inilist(html,function(arr){
                   t.listarr=iniarr(arr);
                   //alert(t.name+"\n"+t.listarr);
                   if(fun)fun()
                 });
              })
          }else{alert("not list")}
        }else{
            t.inilist(html,function(arr){
              t.listarr=iniarr(arr);
              //alert(t.name+"\n"+t.listarr);
              if(fun)fun()
            });
        }
    });
  }
  this.getpage=function(url,fun){
    if(typeof url == 'number'){
       if(this.listarr){
          var url=this.listarr[url][0];
       }
    }
    t.url=url;
    getHTML(url,function(html){
      var json={"html":html,"url":url};
      t.inipage(json,function(a){
        //alert(JSON.stringify(a))
        if(fun)fun(a);
      })
     });
  }
  this.inipage=function(arr,fun){
      var html=arr.html;
    //替换换行，空格
    var txt=html.replace(/(<br[^>]*?>[ \s]*){1,}/g,'\n');
    html=txt.replace(/&nbsp;/g,' ');
    //匹配小说名称
    var novelname=html.match(/《([\u4e00-\u9fa5]+)》/);
    novelname=novelname?novelname[1]:"";
    //匹配章节名称
    var title=html.match(/>(第[^<]*?章[\u0020]*[\u4e00-\u9fa5]+)</);
    title=title?title[1]:"";
    //匹配正文
    var txt=html.match(/<div[^>]*?>([^<>]{100,})</);
    txt=txt?txt[1]:"";
    //匹配下一章地址
    var reg=/<a[^>]*?href="([^"]*?)".*?>下[^<]*?</;
    var nexturl=html.match(reg);
    nexturl=nexturl?nexturl[1]:"";
    nexturl=nexturl.getFullUrl(arr.url);
    //
    var re={"novelname":novelname,
               "title":title,
               "txt":txt,
               "nexturl":nexturl
               }
    //是否有分章
    if(nexturl.indexOf("_")>-1){
      getHTML(nexturl,function(html){
        t.inipage({"html":html,"url":nexturl},function(a){
           re.txt+=a.txt;
           re.nexturl=a.nexturl;
           fun(re);
        })
      });
    }else{
        fun(re);
    }
  }
}

Novel.prototype.getlist=function(){
  var t=this;
  getHTML(this.listurl,function(listhtml){
    t.listhtml=listhtml;
    alert(listhtml)
  });
}
ii=0;
Novel.prototype.inilist=function(html,fun){
     var t=this;
     //获取章节目录
     var reg_di=new RegExp("<a[^>]*?href=\"([^\"]*?)\".*?>(第[^<0-9]*?)<","g");
     var url_arr=html.matches(reg_di);
     for(var i=0;i<url_arr.length;i++){
          url_arr[i][0]=url_arr[i][0].getFullUrl(this.url);
     }
     //alert(html)
     //alert(url_arr)
  var reg=/<a[^>]*?href="([^"]*?)"[^>]*?>([^<第]*?下一页[^<]*?)</;
  var nexturl=html.match(reg);
   if(nexturl){
      nexturl=nexturl[1].getFullUrl(this.url);
      //alert(nexturl)
      ii++;
     // if(ii>4){fun(url_arr);return;}
      getHTML(nexturl,function(html){
           t.inilist(html,function(arr){
               var arr=url_arr.concat(arr)
               //alert(arr)
               fun(arr);
           })
      });
   }else{
      fun(url_arr);
  }
}

/*novel1=new Novel();
novel1.ini(url,function(){novel1.getpage(15,function(a){alert(JSON.stringify(a))})});
//novel1.getpage(15)
*/