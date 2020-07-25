APP = {
	data: {},
	defaultInfo: {
		"version":"1.1",
		"localModel": "cors",
		"localModels": [
			"http://gear.docfeng.top/get2.php",
			"http://gear2.docfeng.top/get2.php",
			"http://192.168.123.128/get2.php", 
			"http://192.168.123.92:8080/get2.php", 
			"http://yiyun.docfeng.top/get2.php",
			"cors"
		],
		"users":{"docfeng":"token cea02b0f6bcfd81077074d6948b85c525ec07680"},
		"user":"docfeng"
	},
	info: (function() {
		return new Promise(function(result) {
			window.addEventListener("load", function() {
				store.getItem("info").then(function(info) {
					if (info) {
						info=JSON.parse(info);
						if(!info.version||info.version<APP.defaultInfo.version){
							info = APP.defaultInfo;
							var json = JSON.stringify(info);
							store.setItem("info", json);
						}
					}else{
						info = APP.defaultInfo;
						var json = JSON.stringify(info);
						store.setItem("info", json);
					}
					result(info);
				}).catch(function(e) {
					alert("err:localModel:\n" + e)
				}).finally(function() {
					
				});
			});
		});
	})(),
	get: function(name) {
		return this.info.then(function(info) {
			if (info[name]) {
				
				return info[name];
			} else {
				return undefined;
			}
		});
	},
	set: function(name, key) {
		//if(Array.isArray(name)){}
		return this.info.then(function(info) {
			info[name] = key;
			var json = JSON.stringify(info);
			alert(json)
			return store.setItem("info", json);
		});
	},
	delete: function(name) {
		return this.info.then(function(info) {
			if (info[name]) {
				delete info[name];
			}
			var json = JSON.stringify(info);
			return store.setItem("info", json);
		});
	},
	default: function() {
		var info = this.defaultInfo;
		var json = JSON.stringify(info);
		return store.setItem("info", json);
	}
}
window.addEventListener("load",function(){
	APP.get("users").then(function(users){
		APP.get("user").then(function(user){
			username.innerHTML=user;
		});
	});
});
Setting={
	putModel: function() {
		var t = this;
		this.readModel().then(function(re) {
			if (re) {
				return Git.File.put("docfeng", "book-data", "config/corsUrl.txt", re)
			} else {
				return false;
			}
		}).then(function(re) {
			alert("Book.Shelf.putModel" + re);
		}).catch(function(e) {
			alert("err:Book.Shelf.putModel\n" + e)
		})
	},
	getModels: function() {
		var t = this;
		return Git.File.get("docfeng", "book-data", "config/corsUrl.txt").then(function(re) {
			var re = re;
			if (!re) {
				re = [
					"http://gear.docfeng.top/get2.php",
					"http://gear2.docfeng.top/get2.php",
					"http://192.168.123.128/get2.php",
					"http://192.168.123.92:8080/get2.php",
				];
				return re;
			} else {
				return JSON.parse(re);
			}
		}).then(function(re) {
			alert(re)
			t.writeModel(re)
		});
	},
	addModel:function(){
		var value=corsValue.value
		APP.info.then(function(info){
			info.localModel=value;
			var localModels=info.localModels;
			if(!Array.inArray(value,localModels)){
				localModels.push(value);
			}
			APP.set("localModel",value);
		});
	},
	showModel:function(obj){
	    //var ele=document.createDocumentFragment(html);
		//cors.insertAdjacentHTML("beforeEnd",html);
		APP.info.then(function(info){
			var model=info.localModel;
			var arr=info.localModels;
			var html=""
			for(var i=0;i<arr.length;i++){
			    html+='<label><input type="radio" name="cors" value="'+arr[i] +'" />'+arr[i]+'</label>\n';
			}
			cors.innerHTML=html;
			corsValue.value=model;
		});
	},
	selectModel:function(obj){
		if(obj.tagName.toLowerCase()=="input"){
			corsValue.value=obj.value;
		}
	}
}
			//设置页操作
			var act=function(a){
			    var json={};
			    var obj=a.elements;
			    for(var i=0;i<obj.length;i++){
			        switch(obj[i].type){
			            case "text":
			                if(obj[i].value){
			                    json[obj[i].name]=obj[i].value;
			                }
			                break;
			            case "radio":
			                if(obj[i].checked){
			                    json[obj[i].name]=obj[i].value;
			                }
			                break;
			            case "checkbox":
			                if(!json[obj[i].name]){
			                    json[obj[i].name]=[];
			                }
			                if(obj[i].checked){
			                    json[obj[i].name].push(obj[i].value);
			                }
			                break;
			        }
			        
			    }
			    //alert(JSON.stringify(json,null,4))
				return json;
			}
