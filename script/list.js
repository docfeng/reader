//v1.01
/*
目录:List 
  目录位置:Shelf/{name}.json;
  目录格式:[
            [url,title]
          ]
    读取目录 read(name);
    获取目录 get(url); return arr
             获取目录html http.get(url) return html
             格式化目录   format({html,url}) return arr
    更新目录 update(name)
             获取目录 get(url);
             保存目录 save();
             显示目录 show();
    保存目录 save(name,arr);
    
    
    显示目录 show(name,arr,url);
    显示目录2 showarr(arr);
    滚动到i scroll(i);
    点击事件 click()
*/
/*Regs=[
    [
		"https://m.qu.la",
		{
			"name":'<title>(.*?)<',
			"links":'<a[^>]*?href="([^"]*?)".*?>(第[^<]*?)<'
		},
		{
			"reg1":"",
			"reg2":""
		} 
	]
]
*/

if(!window.MyObject)window.MyObject={}

window.MyObject.List={
    path:"Shelf/",
    arr:[],
    html:"",
    //读取目录
    read:function(name){
        var name=name||win.name;
        if(!name){
			return Promise.reject("List.read参数name错误");
		}
        var path=`Shelf/${name}.json`;
		return fso.read(path).then(function(txt){
			if(txt=="false"||!txt){
				return Promise.reject("读取内容为空");
			}
			this.arr=JSON.parse(txt);
			return Promise.resolve(this.arr);
		});
    },
	//获取目录
	get:async function(url){
		var t=this;
	    var url=url||win.url
	    if(!url){
	        return Promise.reject("没有url");
	    }
	    this.url=url;
		var listURL = "https://bird.ioliu.cn/v2/"
	    return http.get(url, {
	    		cors: true,
	    		corsUrl: listURL
	    	}).then(function(html){
	    	if(!html){return Promise.reject("http没有获取到html");}
			return t.format({html,url});
	    }).then(function(arr){
	    	if(!arr){return Promise.reject("list.format没有arr");}
			this.arr=arr;
			return Promise.resolve(arr);
	    });	    
	},
    //保存目录
    save:function(name,arr){
        var name=name||this.name||win.name;
        var arr=arr||this.arr;
        if(!name||!arr){
            alert("List.save\n参数错误")
        }
        fso.write(`Shelf/${name}.json`,JSON.stringify(arr),false);
    },
    //显示目录
    show:function(name,url,arr){
        var url_arr=arr||this.arr;
        this.arr=url_arr;
        var name=name||this.name;
        this.name=name;
        var url=url||win.url;
        this.showarr(arr);
        f4_name.value=name;
        f4_count.value=url_arr.length;
        f4_url.value=url;
    },
    showarr:function(arr){
        var url_arr=arr||this.arr;
        var str="";
        var err=[];
        for(var i=0;i<url_arr.length;i++){
            if(!url_arr[i]||!url_arr[i][1]){
                err[err.length]=i+":"+url_arr[i];
            }else{
                var d="<h4>"+url_arr[i][1]+"</h4>";
                d+="<h5>"+url_arr[i][0]+"</h5>";
                str+="<tr><td>"+d+"</td></tr>";
            }
        }
        list_table.innerHTML=str;
    },
    //目录滚动到第i个
    scroll:function(i){
        var h=list_table.rows[i].offsetTop
        list_table.parentNode.scrollTop=h
    },
    
    format:async function(json){
        var html=json.html;
        var url=json.url;
        var arr=[];
        var fun=async function(html){
            var reg_di=new RegExp("<a[^>]*?href[ ]?=[\"']([^\"'>]*?)[\"'][^>]*?>(第[^\-<]*?)<","g");
            let arr=html.matches(reg_di);
            for(var i=0;i<arr.length;i++){
                arr[i][0]=arr[i][0].getFullUrl(url);
            }
            //下一页地址
            var reg=/<a[^>]*?href=["|']([^"']*?)["|][^>]*?>([^<第]*?下一页[^<]*?)</;
            var nexturl=html.match(reg);
            if(nexturl){
               nexturl=nexturl[1].getFullUrl(url);
            }
            return {arr:arr,url:nexturl};
        }
        console.add("开始获取html");
        var json=await fun(html);
        arr[arr.length]=json.arr
        while(json.url){
               var html=await http.get(json.url);
               json=await fun(html);
               arr[arr.length]=json.arr
         }
         console.add("开始分析arr");
         var index=0;
         if(arr.length>1){
              for(var i=0;i<arr[0].length;i++){
                    if(arr[0][i][0]==arr[1][i][0]){
                        index++;
                    }
              }
              let myarr=[];
              for(var i=0;i<arr.length;i++){
                  for(var i2=0;i2<index;i2++){
                      arr[i].shift();
                  }
                  myarr=myarr.concat(arr[i]);
              }
              arr=myarr;
          }
          if(arr.length==1){arr=arr[0]}
          return arr;
    },
    //下载
    download:async function(){
        var t=this;
        zipFile.ini(this.arr);
        warn("开始下载")
        var start=parseInt(form_1.start.value);
        var end=parseInt(form_1.end.value);
        var arr=[start,List.arr.slice(start,end)];
        page.setData(arr,function(data){
            var i=data[2];
            list_table.rows[parseInt(i)].cells[0].style.backgroundColor="#ff0000";
            zipFile.copyPage(data[1],data[2]);
            t.scroll(i);
        });
    },
	
    click:async function(obj){
         var obj=obj.parentNode;
         var i=obj.parentNode.rowIndex;//*this.max+obj.cellIndex;
         var name=this.name;
         var arr=this.arr[i];
         var title=arr[1];
         var url=arr[0];
         var json=await Shelf.getKeyData(name);
         json.readTitle=title;
         json.readURL=url;
         json.readIndex=i;
         json.readAt=formatDate(new Date());
         Shelf.setKeyData(json);
         var his=localStorage.getItem("his");
         if(his&&(his=JSON.parse(his),his.name!=name)){
             //var json=await Shelf.getKeyData(his.name);
             //json.readIndex=his.index;
         }
         his={name:name,index:[i,0]};
         var his=JSON.stringify(his,null,2);
         localStorage.setItem("his",his)
         pageDiv.querySelector("iframe").contentWindow.location.href = "page.html";
		 document.querySelector("#pageDiv").style.display="block";
		 evt.addEvent(function(){
		 	document.querySelector("#pageDiv").style.display="none";
		 })
		 fullScreen(document.querySelector("#pageDiv"))
		 //location.href="page.html";
         
    },
    update:async function(url){
        var json=await this.get(url);
		if(json.length==this.arr.length){
			console.add("目前没有新更新");
		}else{
			var arr=this.arr=json;
			this.showarr(arr);
			var newpage=arr[arr.length-1];
			this.save();
			console.add("已更新"+newpage[1]);
			f4_new.value=newpage[1];
		}
    },
    changeSource:async function(name){
		document.querySelector("#searchDiv").style.display="block";
		evt.addEvent(function(){
			document.querySelector("#searchDiv").style.display="none";
		})
        f6_name.value=name;
        search.get2(name);
    },
    addBook:function(name,url,arr){
        var name=name||this.name;
        var arr=arr||this.arr;
        var url=url||this.url;
        Shelf.add(name,url,arr);
    }
}