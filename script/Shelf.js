/*
Shelf | Shelf.json 书架
          | name | List.json
                       | Source.json
                       | Source | url.txt
                       | page | i.txt
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
          
书架:Shelf
    读取书架 read() {name,url,oldpage,newpage,update}
    修改|新增 书架 set() add(json)
    更新书架 update() 
    删除第i个 delete(i);
    保存书架 save(json)
    
    显示书架 showShelf(json)
    显示第i个书架 showShelf(index);
    点击事件 click(obj,order);
*/
if (!window.MyObject) window.MyObject = {}

window.MyObject.Shelf = {
	hisPath: "Shelf/Shelf1.json",
	max: 2,
	//获取书架信息
	read: async function() {
		var json = await this.getAllIndexData("readAt");
		json = json.reverse();
		this.json = json;
		return this.json;
	},
	//修改书本、新增
	add: async function(name, url, arr) {
		var t = this;
		var json = this.json;
		var json1 = {};
		var num = -1;
		for (var i = 0; i < json.length; i++) {
			if (json[i].name == name) {
				num = i;
			}
		}
		if (num == -1) {
			json1 = {
				name: name,
				url: url,
				creatAt: formatDate(new Date()),
				readIndex: 0,
				readTitle: arr[0][1],
				readAt: formatDate(new Date()),
				readURL: arr[0][0],
				updateIndex: arr.length - 1,
				updateTitle: arr[arr.length - 1][1],
				updateAt: formatDate(new Date()),
				updateURL: arr[arr.length - 1][0]
			}
		} else {
			json1 = json.splice(num, 1)[0]; //json[num];
			json1.url = url;
			json1.updateIndex = arr.length - 1,
				json1.updateTitle = arr[arr.length - 1][1],
				json1.updateAt = formatDate(new Date()),
				json1.updateURL = arr[arr.length - 1][0];
			//this.show({index:num})
		}
		json.unshift(json1);
		this.show()
		//alert(json1)
		var re = await this.setKeyData(json1);
	},
	//显示书架
	show: async function(para = {}) {
		var json = para.json || this.json || await this.read();
		var str = "";
		if (para && para.index >= 0) {
			var i = para.index;
			console.add("显示" + i);
			var arr = json[i];
			var d =
				`<h1>${i}.${arr.name}</h1>
                <h2>已读:${arr.readTitle}</h2>
                <h3>${arr.readAt}</h3>
                <h4><span class="highlight">最新:</span>${arr.updateTitle}</h4>
                <h3>${arr.updateAt}</h3>
                <h6>${arr.url}</h6>`;
			str += "<tr><td>" + d + "</td></tr>";
			shelf_table.rows[i].innerHTML = str;
		} else {
			json.forEach(function(arr, i) {
				var d =
					`<h1>${i}.${arr.name}</h1>
                <h2>已读:${arr.readTitle}</h2>
                <h3>${arr.readAt}</h3>
                <h4>最新:${arr.updateTitle}</h4>
                <h3>${arr.updateAt}</h3>
                <h6>${arr.url}</h6>`;
				str += "<tr><td>" + d + "</td></tr>";
			});
			if (shelf_table) {
				shelf_table.innerHTML = str;
			}
		}
	},
	download: async function() {
		var html = await git.getFile("page", "novel/data/Shelf.json");
		//alert(html)
		var json = JSON.parse(html);
		var re=await this.setAllData(json);
		alert(re);
		this.show({
			"json": json
		});
		//store.setItem("Shelf",html);
		//alert(html);
	},
	upload: async function() {
		var json = await this.getAllIndexData("readAt");
		json = json.reverse();
		json = JSON.stringify(json, null, 4);

		await git.getFile("page", "novel/data/Shelf.json");
		var re = await git.createFile({
			owner: "docfeng",
			repos: "page",
			name: "novel/data/Shelf.json",
			txt: json
		});
		alert(re);
	},
	//书架页点击处理
	click: async function(obj, order = "click") {
		var obj = obj.parentNode;
		var i = obj.parentNode.rowIndex;
		if (order == "click") {
			//显示目录页
			menu_obj.shift(2);
			var json = this.json;
			var name = json[i].name;
			var url = json[i].url;
			List.show(name, url, []);
			//显示目录
			var arr = await List.read(name);
			if (!arr) {
				var arr = await List.get(url);
				List.save(name, arr);
			}
			List.show(name, url, arr);
			//保存书架
			var arr = json.splice(i, 1)[0];
			arr.readAt = formatDate(new Date());
			json.unshift(arr);
			this.show({
				json: json
			})
			//alert(JSON.stringify(arr,null,4))
			this.setKeyData(arr);
		}
		if (order == "delete") {
			this.delete(i);
		}
		this.show();
	},
	//删除书本
	delete: function(i) {
		var name = this.json[i].name;
		if (confirm("是否删除:" + i + name)) {
			this.deleteKeyData(name);
		}
	},
	//更新书架信息
	update: async function() {
		var json = this.json || await this.read();
		var t = this;
		console.add("开始更新");
		var count = 0;
		for (var i = 0; i < 10; i++) {
			this.update1(json[i], i);
		}
	},
	update1: async function(arr, i) {
		var arr = arr;
		var url = arr.url;
		var name = arr.name;
		console.add(name)
		var urlArr = await List.get(url);
		if (!urlArr) {
			console.add(`>>${i}.${name}List未获得;<br>-------<br>`);
		} else {
			List.save(name, urlArr)
			try {
				//最新章节
				console.add(i)
				urlArr = urlArr.pop();
				arr.updateTitle = urlArr[1];
				arr.updateURL = urlArr[0];
				arr.updateAt = formatDate(new Date());
				arr.updateIndex = i;
				this.show({
					index: i
				});
				this.setKeyData(arr);
			} catch (e) {
				console.add(`>>${i}.${name}出错;<br>-------<br>`);
			}
		}
		//是否保存
		/*count++;
		if(count==15&&confirm("save?\n"+this.json)){
		    fso.write(this.hisPath,JSON.stringify(this.json),false);
		}*/
	},
	getAllIndexData: async function(index) {
		var db = new DB();
		try {
			await db.open_db("store");
			if (db.select_store("shelf")) {
				var d = {};
				d[index] = null;
				var json = await db.getindex(d);

				db.close_db();
				return json;
			}
		} catch (e) {
			alert(e)
		}
		db.close_db();
	},
	getKeyData: async function(key) {
		var db = new DB();
		try {
			await db.open_db("store");
			if (db.select_store("shelf")) {
				var json = await db.getkey(key);

				db.close_db();
				return json;
			}
		} catch (e) {
			alert(e)
		}
		db.close_db();
	},
	deleteKeyData: async function(key) {
		var db = new DB();
		try {
			await db.open_db("store");
			if (db.select_store("shelf")) {
				var json = await db.delete(key);

				db.close_db();
				return json;
			}
		} catch (e) {
			alert(e)
		}
		db.close_db();
	},
	setAllData: async function(json) {
		var db = new DB();
		try {
			await db.open_db("store");
			if (!db.select_store("shelf")) {
				var json1 = {
					key: "name",
					index: {
						name: true,
						url: false,
						creatAt: false,
						readIndex: false,
						readTitle: false,
						readAt: false,
						readURL: false,
						updateIndex: false,
						updateTitle: false,
						updateAt: false,
						updateURL: false
					}
				}
				await db.create_store("shelf", json1);
			}
			for (var i = 0; i < json.length; i++) {
				var obj = json[i];
				await db.put(obj);
			}
		} catch (e) {
			alert(e)
			return false;
		}
		db.close_db();
		return true;
	},
	setKeyData: async function(json) {
		var db = new DB();
		try {
			await db.open_db("store");
			if (db.select_store("shelf")) {
				var re = await db.put(json);

				db.close_db();
				return re;
			}
		} catch (e) {
			alert(e)
		}
		db.close_db();
		return true;
	}
}

/*form1事件
         if(window.form_1){
               win.name=name;
               win.url=json[i].url;
               win.newPage=json[i].newpage.title;
               win.oldPage=json[i].oldpage.title;
               var event = document.createEvent('HTMLEvents');
               event.initEvent("change", true, true);
               event.eventType = 'message';
               form_1.list_url.dispatchEvent(event);
         }*/
