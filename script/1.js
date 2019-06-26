if(!window.novel){
    novel={"base":{"name":"",
            "list_url":"","base_url":""},
          list:[]}
}
Regs=[];
/*Reg={"domin":"www.qu.la",
     "mulu":["/<dd>[^>]*?\"([^\"]*?)\">([^<]*?)</g","/href=\"([^\"]*?)\">([^<]*?)</"],
     "page":"/<div id=\"content\">([\\s\\S]*?)<\\/div>/"};
*/
Novel = function (){
	  var interval;
	  var page_txt="";
	  var domin="";
	  var page_next="";
}

getShelf=function(){
  var g=fso.getList("novel/novels/json");
  var t=""; 
  var reg=/(.*?)\./;
  g=JSON.parse(g);
  for(i in g)
  {
    t+="<div onclick='novel_name.value=this.innerHTML;my_win.shift();read_list()'>"+g[i].match(reg)[1]+"</div>";
  }
  my_win.setInnerHTML(t);
}

get_search_page  =function (){ 
   novel.base.name=novel_name.value;
   var url="http://zhannei.baidu.com/"+
           "cse/search?q="+
            page_name.value+
      "&click=1&s=920895234054625192&nsid=";
   post(url,"",    
       function(a){
          txt.value=search_txt=a;
      }); 
}

test_search_reg=function(){
  var reg=eval(search_reg.value);
  //var reg=/<div class="result-item[^<]*?<div[^']*?'([^']*?)'/
  novel.base.list_url=search_txt.match(reg)[1];
  list_url.value=novel.base.list_url;
  alert(list_url.value);
}
                                                 
get_list_page=function (){
  post(list_url.value,"",function(a){
     txt.value=list_txt=a;
     });
}

test_list_reg=function(){
  var reg=eval(list_reg0.value);
  var a=list_txt.match(reg);
  if(!a){alert("false");return;}
  reg=eval(list_reg1.value);
  var list=[];
  var b=a[0].match(reg);
  if(!b){alert(a);return;}
  var base_url=prompt(b[1],list_url.value);
  section_url.value=base_url+b[1];
  //alert(base_url);
  for(var i in a)
  {
    var b=a[i].match(reg);
    if(!b){alert(a);return;}
    list[list.length]=[
          base_url+b[1],b[2]];
  }
  novel.list=list;
  novel.base={"name":novel_name.value,
          "list_url":list_url.value,
          "base_url":base_url};
  alert(JSON.stringify(novel));
}

save_list=function (){
  if(confirm(JSON.stringify(novel))){
   var name="novel/novels/json/"+
            novel_name.value+".json";
   alert(name)
   fso.createFile(name);
   fso.write(name,
            JSON.stringify(novel),false);
   alert(true);
  }
}

get_section_page=function (){
  //var i=parseInt(page_index.value);
  var url=section_url.value;
  post(url,"",
      function(a){
        txt.value=section_txt=a;
      }
  );
}

test_section_reg = function (){
    var reg=eval(section_reg.value);
    var r=section_txt.match(reg);
    if(r){alert(r[1])}else{alert(false)}
}

del_page=function(){
  var name=page_name.value;
  name="novel/novels/txt/"+name+".txt";
  var a=fso.delete(name);
  alert(a);
}

save_page=function(){
  zt.value="开始";
  var begin=parseInt(num_begin.value);
  var end=parseInt(num_end.value);
  var name="novel/novels/txt/"+
           novel_name.value+".txt";
  var reg=eval(Reg.page);
  var fun=function(){
    var url=novel.list[begin][0];
    post(url,"",
       function(a){
         var a1=a.match(reg)[1];
         a1=a1.replace(/<br.*?>/g,"\n");
         a1=a1.replace(/&nbsp;/g,"");
         a1=a1.replace(/ /g,"");
         a1=novel.list[begin][1]+"\n"+a1;
         if(!fso.write(name,a1,true)){
           alert("false");
           return;
         }
         if(begin==end){
           zt.value="完成";
           alert("完成")
           return;
         }
         begin++;
         zt.value=begin;
         fun();
       }
    );
  }
  fun();
}



read_list = function (){
  var name="novel/novels/json/"+
            novel_name.value+".json";
  var txt=fso.read(name);
  novel=JSON.parse(txt);
  list_url.value=novel.base.list_url;
  alert(txt);
  var t="";
  for(var i in novel.list)
  {
      t+="<div onclick='novel_name.value=this.innerHTML;my_win.shift();'>"+novel.list[i][1]+"</div>";
  }
  my_win.setInnerHTML(t);

}
get_js("novel/regs.js");

//alert()












function(){}
