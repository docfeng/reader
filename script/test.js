
var changeData=async function(){
	var json=await store.getItem("Shelf");
	json=JSON.parse(json)
	var json1=[];
	for(var i=0;i<json.length;i++){
		var obj=json[i];
		var json2={
			    	name:obj.name,
			    	url:obj.url,
			    	creatAt:new Date().toUTCString(),
			    	readIndex:0,
			    	readTitle:obj.oldpage.title,
			    	readAt:obj.oldpage.Date,
			    	readURL:obj.oldpage.url,
			    	updateIndex:0,
			    	updateTitle:obj.newpage.title,
			    	updateAt:obj.newpage.Date,
			    	updateURL:obj.newpage.url
			};
			json1[i]=json2;
	}
	setAllData(json1)
}

var setAllData=async function(json){
	var db=new DB();
	try{
		await db.open_db("store");
		if(!db.select_store("shelf")){
			var json1={
					key:"name",
				    index:{
				    	name:true,
				    	url:false,
				    	creatAt:false,
				    	readIndex:false,
				    	readTitle:false,
				    	readAt:false,
				    	readURL:false,
				    	updateIndex:false,
				    	updateTitle:false,
				    	updateAt:false,
				    	updateURL:false
				    }
			    }
		   await db.create_store("shelf",json1);
	    }
		for(var i=0;i<json.length;i++){
			var obj=json[i];
            await db.put(obj);
		}
	}catch(e){
		alert(e)
	}
	db.close_db();
    alert(true)
}

changeData()

var getAllData=async function(){
	var db=new DB();
	try{
		await db.open_db("store");
		if(db.select_store("shelf")){
			var json=await db.getAll();
			
			db.close_db();
			return json;
		}
	}catch(e){
		alert(e)
	}
	db.close_db();
}
getAllData().then(function(json){
	alert(JSON.stringify(json))
})

var getAllIndexData=async function(index){
	var db=new DB();
	try{
		await db.open_db("store");
		if(db.select_store("shelf")){
			var d={};
			d[index]=null;
			var json=await db.getindex(d);
			
			db.close_db();
			return json;
		}
	}catch(e){
		alert(e)
	}
	db.close_db();
}
getAllIndexData("updateAt").then(function(json){
	alert(JSON.stringify(json))
})

var getKeyData=async function(key){
	var db=new DB();
	try{
		await db.open_db("store");
		if(db.select_store("shelf")){
			var json=await db.getkey(key);
			
			db.close_db();
			return json;
		}
	}catch(e){
		alert(e)
	}
	db.close_db();
}
getKeyData("世子很皮").then(function(json){
	alert(JSON.stringify(json))
})

var setKeyData=async function(json){
	var db=new DB();
	try{
		await db.open_db("store");
		if(db.select_store("shelf")){
			var re=await db.put(json);
			
			db.close_db();
			return re;
		}
	}catch(e){
		alert(e)
	}
	db.close_db();
}
var json={"name":"世子很皮","url":"https://www.biquta.com/144_144610/","creatAt":"","readIndex":0,"readTitle":"第三百九十六章 朱允炆的双重标准 下","readAt":"2019-05-25T01:04:58.902Z","readURL":"https://www.biquta.com/144_144610/7845631.html","updateIndex":0,"updateTitle":"第三百九十六章 朱允炆的双重标准 下","updateAt":"2019-05-25T01:04:58.902Z","updateURL":"https://www.biquta.com/144_144610/7845631.html"}
setKeyData(json).then(function(json){
	alert(json)
})