"use strict";

Page = function Page() {
  this.i = 0;
  this.index = 0;
  this.arr = [];
  this.errarr = [];
  this.len = 0;
  this.result = [];
  this.backcall = function () {};
  this.fun();
};
Page.prototype.fun = function () {
  this.setData = function (data, backcall) {
    this.arr = data[1];
    this.i = data[0];
    this.len = this.arr.length;
    this.backcall = backcall;
    this.errarr = [];
    this.download();
  };
  this.getpage = function () {
    var t = this;
    var arr = t.arr.shift();
    var count = 0;
    if (!arr) {
      if (t.index == t.len) {
        if (t.errarr.length > 0) alert("err:" + t.errarr);
      };
      return 0;
    }
    var i = t.i + t.len - t.arr.length - 1;
    var url = arr[0];
    var fun = function fun(html) {
      var json = { "html": html, "url": url };
      t.inipage(json, function (a) {
        //alert(JSON.stringify(a))
        if (a.txt == "") {
          if (count < 3) {
            count++;
            getHTML(url, fun);
          } else {
            //alert("no "+i);
            t.errarr[t.errarr.length] = [i, json.arr, json.html, a.txt];
            t.index++;
            if (t.index == t.len) {
              //warn("结束下载");
            }
            t.errarr[t.errarr.length] = url;
            t.getpage();
          }
        } else {
          data = ["page", a.txt, i, url];
          //alert(data)
          t.backcall(data);
          t.index++;
          if (t.index == t.len) {
            warn("结束下载");
            if (t.errarr.length > 0) alert(t.errarr.length);
          }
          t.getpage();
        }
      });
    };
    getHTML(url, fun);

    /*var fun=function(html){
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
          alert("no "+i);
          t.index++;
          if(t.index==t.len){
            warn("结束下载");
          }
          t.getpage();
        }
      }else{
        data=["page",txt1,i,url]
        t.backcall(data);
        t.index++;
        if(t.index==t.len){
          warn("结束下载");
        }
        t.getpage();
      }
    }    		
    url.get(fun);
    */
  };

  this.inipage = function (arr, fun) {
    var t = this;
    var html = arr.html;
    //替换换行，空格
    html = html.replace(/(<br[^>]*?>[ \s]*){1,}/g, '\n');
    html = html.replace(/&nbsp;/g, ' ');
    //匹配小说名称
    var novelname = html.match(/《([\u4e00-\u9fa5]+)》/);
    novelname = novelname ? novelname[1] : "";
    //匹配章节名称
    var title = html.match(/>(第[^<]*?章[\u0020]*[\u4e00-\u9fa5]+)</);
    title = title ? title[1] : "";
    //匹配正文
    var atxt = html.match(/>([^<]{300,})</g);
    //alert(html)
    //alert(atxt)
    for (var i = 0; i < atxt.length; i++) {
      var elen = atxt[i].match(/[A-Za-z]/g);
      if (!elen || elen.length / atxt[i].length < 0.06) {
        txt = atxt[i];
        txt = txt.match(/>([^<]{100,})</);
      }
    }
    txt = txt ? txt[1] : "";
    //匹配下一章地址
    var reg = /<a[^>]*?href="([^"]*?)"[^>]*?>下[^<]*?</;
    var nexturl = html.match(reg);
    nexturl = nexturl ? nexturl[1] : "";
    nexturl = nexturl.getFullUrl(arr.url);
    //
    var re = { "novelname": novelname,
      "title": title,
      "txt": txt,
      "nexturl": nexturl
      //是否有分章
    };if (nexturl.indexOf("_") > nexturl.length - 8) {
      getHTML(nexturl, function (html) {
        t.inipage({ "html": html, "url": nexturl }, function (a) {
          re.txt += a.txt;
          re.nexturl = a.nexturl;
          fun(re);
        });
      });
    } else {
      fun(re);
    }
  };
  this.download = function () {
    var t = this;
    t.getpage();
    t.getpage();
    t.getpage();
  };
};
page = new Page();
