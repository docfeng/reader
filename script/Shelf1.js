/*
  书架位置:Shelf/Shelf.json;
  书架格式:[
            {
              name:String,
              url:String,
              oldpage{
                    title:String,
                    url:String,
                    Date:String
                  },
              newpage:{
                    title: String,
                    url: String,
                    Date: String
                  },
              update:bool
            }
          ]
*/
Shelf=function(){
    this.hisPath="Shelf/Shelf1.json";
    this.max=2;
    this.fun();
}
Shelf.prototype.fun=function(){
    var t=this;
    //获取书架信息
    fso.read(this.hisPath,function(txt){
      if(!txt){alert("none Shelf");return ;}
        var json=txt
        if(json){
          //alert(json)
        t.json=JSON.parse(json);
      }
    });
    //新增书本
    this.set=function(){
      var arr={
		  	    name:win.name,
        url:win.url,
        olepage:{title:win.olePage,url:"",Date:new Date()},
        newpage:{title:win.newPage,url:"",Date:new Date()},
        update:false
      };
      if(confirm("添加\n"+JSON.stringify(arr))){
        this.addBook(arr);
      }
    }
    this.addBook=function(arr){
      var json=this.json;
      var num=json.length;
      for(var i=0;i<json.length;i++){
            if(json[i].name==arr.name){
                num=i;
            }
      }
      json[num]=arr;
      this.json=json;
      json=JSON.stringify(json);
      fso.write(this.hisPath,json,false,function(re){
           alert(re);
      });
    }
    	//获取书架信息
    this.get=function(){
        fso.read(this.hisPath,function(json){
          if(json=="false"){
             json="[]";
          }
          t.json=JSON.parse(json);
          //alert(json)
          t.show(); 
        });
     }
     //显示书架
     this.show=function(){
       var json=this.json;
       var str="";
       var h="";
       json.forEach(function(arr,i){
                var d=`<h1>${arr.name}</h1>
                <h2>${arr.url}</h2>
                <h2>${arr.oldpage.title}${arr.oldpage.Date}</h2>
                <h2>${arr.newpage.title}</h2>
                <h2>${arr.newpage.Date}</h2>
                <h3>${arr.update}</h3>`;
                h+="<td>"+d+"</td>";
                if(i%2==1 || i==json.length-1){
                    str+="<tr>"+h+"</tr>";
                    h="";
                }
        
       });
       if(shelf_table){shelf_table.innerHTML=str;}
       /*var arr=this.json;
       var str="";
       var h="";
       for(var i in arr){
                var d="<h1>"+arr[i][0]+"</h1>";
                d+="<h2>"+arr[i][1]+"</h2>";
                d+="<h2>"+arr[i][2]+"</h2>";
                d+="<h2>"+arr[i][4]+"</h2>";
                d+="<h2>"+arr[i][6]+"</h2>";
                d+="<h3>"+arr[i][7]+"</h3>";
                h+="<td>"+d+"</td>";
                if(i%2==1 || i==arr.length-1){
                    str+="<tr>"+h+"</tr>";
                    h="";
                }
        }
        if(shelf_table){shelf_table.innerHTML=str;}
        */
     }
     //获取目录信息
     this.getList=function(obj){
         var obj=obj.parentNode;
         var i=obj.parentNode.rowIndex*this.max+obj.cellIndex;
         var json=this.json;
         var name=json[i].name;
         f3_name.value=name;
         //显示目录
         List.read(name,json[i].url);
         if(window.form_1){
               win.name=name;
               win.url=json[i].url;
               win.newPage=json[i].newpage.title;
               win.oldPage=json[i].oldpage.title;
               var event = document.createEvent('HTMLEvents');
               event.initEvent("change", true, true);
               event.eventType = 'message';
               form_1.list_url.dispatchEvent(event);
         }
         
         json.unshift(json.splice(i,1)[0]);
         this.json=json;
         //保存书架
         fso.fso.write(this.hisPath,JSON.stringify(json),false);
         this.show();
         
         /*var his=localStorage.getItem("his");
             if(!his){
               his='{"name":"科技炼器师","index":[0,0]}';
             }
             his=JSON.parse(his);
             his.name=name;
             var his=JSON.stringify(his,null,2);
             alert(his);
             localStorage.setItem("his",his)
        */
         
     }
    //书架页点击处理
    this.tableFun=this.getList;
    //删除书本
    this.del=function(obj){
        this.tableFun=this.getList;
        var obj=obj.parentNode;
        var i=obj.parentNode.rowIndex*this.max+obj.cellIndex;
        if(confirm(i+this.json[i].name)){
          this.json=this.json.del(i);
          alert(JSON.stringify(this.json));
          fso.write(this.hisPath,JSON.stringify(this.json),false);
          this.show();
        }
    }
    //更新书架信息
    this.update=async function(){
        var t=this;
        var json=fso.fso.read(this.hisPath);
        alert("更新")
        var json=JSON.parse(json);
        var index=0;
        var myArr=new Array(json.length-1);
        json.forEach(async function(arr,i,data){
          var url=arr.url;
          /*var html=await gethtml(url);
          if(html==""){console.log("无"+i);return 0;}
          var reg_di=new RegExp('<a[^>]*?href=[\'"]([^"]*?)[\'"].*?>(第[^<]*?)<',"g");
          var urlArr=html.matches(reg_di);
          urlArr=urlArr.pop();
          if(!urlArr){
                alert(html);return;
          };
          urlArr[0]=urlArr[0].getFullUrl(url);
          */
          var urlArr=await getlist2(url);
          urlArr=urlArr.arr;
          bds.savelist(arr.name,urlArr);
          urlArr=urlArr.pop();
          //alert(urlArr)
          json[i].newpage.title=urlArr[1];
          json[i].newpage.url=urlArr[0];
          json[i].update=json[i].oldpage.title.toIndex()==json[i].newpage.title.toIndex();       
          t.json=json;
          t.show();
          index++;
          if(index==data.length){
              //是否保存
              if(confirm("save?")){
                  alert(t.json)
                  fso.fso.write(t.hisPath,JSON.stringify(t.json),false);
              }
                return 0;
          }
        });
    }
    /*this.tableFun=function(obj){
        this.tableFun=this.getList;
        var obj=obj.parentNode;
        var i=obj.parentNode.rowIndex*this.max+obj.cellIndex;
        alert(i);
    }*/
}