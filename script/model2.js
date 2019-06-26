var [d,c]=include("script/model1");
inipage=async function(json){
  var text="";
  try{
      var html=json.html.replace(/(<br[^>]*?>[ \s]*){1,}/g,'\n');
      html=html.replace(/(<p>)/g,'');
      html=html.replace(/(<\/p>)/g,'\n');
      html=html.replace(/&nbsp;/g,' ');
      //匹配所有300字以上的正文块
      var txt=html.match(/>([^<]{300,})</g);
      txt=txt?txt:"";
      //如果匹配到正文块
      if(txt){
        //遍历正文块
        for(let i=0;i<txt.length;i++){
          //获取英文字母数量
          var elen=txt[i].match(/[A-Za-z]/g);
          //如果没有得到英文字母数量，或者英文字母占比<0.6;
          if(!elen || elen.length/txt[i].length<0.06){
            text=txt[i];
            text=text.match(/>([^<]{100,})</)
          }
        }  
      }
      text=text?text[1]:"";
      //如果有正文内容
      if(text){
        //匹配下一章地址
        var reg=/<a[^>]*?href="([^"]*?)"[^>]*?>下[^<]*?</;
        var nexturl=html.match(reg);
        nexturl=nexturl?nexturl[1]:"";
        nexturl=nexturl.getFullUrl(json.url);
        //如果有分章
        if(nexturl.indexOf("_")>nexturl.length-8){
          let html=gethtml(nexturl);
          let re_text=await arguments.callee({"html":html,"url":nexturl});
          text+=re_text;
        }
      }
      return text;
  }catch(e){
    return "";
  }
}

var page={
  
  async getpage(url){
    var html = await gethtml(url);
    var text = inipage(html);
    return text;
  }
}
return page;