
msg=function(x,y,config){
  fixedBody()
  var mtitle="";
  var mbody="";
  if(y){
    mtitle=x;
    mbody=y
  }else{
    mtitle="";
    mbody=x?x:"";
  }
  document.querySelector(".alert_title").innerHTML=mtitle;
  document.querySelector(".alert_body").innerHTML=mbody;
  document.querySelector(".alert").style.display="block";
  //var config={"height":"500px","width":"500px","left":"0px","top":"0px"}
  if(config){
    for (var key in config) {
      if (config.hasOwnProperty(key)){
        document.querySelector(".alert").style[key]=config[key];
      }
    }
  }
}

window.addEventListener("load",function(){
  document.querySelector(".alert_close").onclick=function(){
    document.querySelector(".alert").style.display="none";
    looseBody();
  };
},false);

function fixedBody() {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;';
}

//关闭模态框后调用
function looseBody() {
    var body = document.body;
    body.style.position = 'static';
    var top = body.style.top;
    document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
    body.style.top = '';
}




