fj = (function() {
	if (!document.querySelector("#msg_box")) {
		/* var style = document.createElement("style");
		style.id = "msg_box"
		style.type = "text/css";
		style.innerHTML =``;
		document.getElementsByTagName("HEAD").item(0).appendChild(style); */
	}
	var createBox = function(code, fun, cancelFun) {
		var win = document.createElement("div");
		win.classList.add("Dialog");
		//win.style.display = "block";
		document.body.appendChild(win);
		var s = evt.addEvent(function(a) {
			document.body.removeChild(win);
			win = null;
			cancelFun && cancelFun();
			return true;
		});
		win.innerHTML = code;
		fun && fun(win, s);
	}
	var obj = [];
	var createWin = function() {
		var obj = {};
		var win = document.createElement("div");
		var box = document.createElement("div");
		var header = document.createElement("div");
		var section = document.createElement("div")
		var footer = document.createElement("div");
		var certain = document.createElement("input");
		var cancel = document.createElement("input");

		win.classList.add("Dialog");
		box.classList.add("contain");
		header.classList.add("header");
		section.classList.add("body");
		footer.classList.add("footer");

		certain.type = "button";
		cancel.type = "button";
		certain.value = "确定";
		cancel.value = "取消";

		box.addEventListener("click", function(e) {
			var event = e || window.event;
			event.stopPropagation();
		}, false);

		var s = evt.addEvent(function(a) {
			document.body.removeChild(win);
			obj.cancel();
			obj = null;
			win = null;
			return true;
		});

		certain.onclick = function(a) {
			evt.removeEvent(s);
			document.body.removeChild(win);
			win = null;
			obj.certain()
			obj = null;
		}

		cancel.onclick = function(a) {
			evt.removeEvent(s);
			document.body.removeChild(win);
			win = null;
			obj.cancel();
			obj = null;
		}

		win.onclick = function(a) {
			evt.removeEvent(s);
			document.body.removeChild(win);
			win = null;
			obj.cancel();
			obj = null;
		};
		footer.append(cancel, certain);
		box.append(header, section, footer);
		win.appendChild(box);
		win.style.display = "block";
		//alert(name)
		document.body.appendChild(win);

		obj.win = win;
		obj.section = section;
		obj.header = header;

		box = null;
		section = null;
		header = null;
		footer = null;
		certain = null;
		cancel = null;

		return obj;
	}
	//选择器
	

	var $ =(function(){
		var querySelector=function(query){
			switch (typeof query){
				case "string":
					this.obj=document.querySelector(query);
					break;
				case "object":
					this.obj=query;
					break;
				default:
					break;
			}
			this.hide=function(bool){
				this.obj.classList.add(bool?"hide2":"hide1");
				
			}
			this.show=function(bool,style){
				this.obj.classList.remove(bool?"hide2":"hide1");
			}
			this.toggle=function(bool,style){
				this.obj.classList.toggle(bool?"hide2":"hide1");
			}
			this.deg90=function(a){
				this.obj.classList.add("deg-90");
				var height=parseInt(window.getComputedStyle(this.obj).height);
				var width=parseInt(window.getComputedStyle(this.obj).width);
				this.obj.style.height=width +"px" //window.innerWidth+"px"
				this.obj.style.width=height +"px" //window.innerHeight+"px"
				var top=parseInt(window.getComputedStyle(this.obj).top)+(height-width)/2;
				var left=parseInt(window.getComputedStyle(this.obj).left)-(height-width)/2
				this.obj.style.top=top+"px"
				this.obj.style.left=left+"px"
				 
				return this;
			}
			this.deg0=function(a){
				this.obj.classList.remove("deg-90");
				return this;
			}
			this.css=function(cssText){
				this.obj.style.cssText+=cssText;
				return this;
			}
			this.height=function(a){
				return parseInt(window.getComputedStyle(this.obj).height);
			}
			this.width=function(a){
				return parseInt(window.getComputedStyle(this.obj).width);
			}
			
		}
		
		return function(query){
			return new querySelector(query);
		}
	})()
	$.createBox = createBox;
	$.createWin = function(name, html, fun) {
		var code =
			'\
          <div class="contain type-2" onclick="window.event.stopPropagation();">\
              <div class="header">\
				<div class="title">%s</div>\
				<div class="close">X</div>\
			</div>\
              <div class="body">\
                  %s\
              </div>\
              <div class="footer">\
                  <div class="ok">确定</div>\
                  <div class="no">取消</div>\
              <div>\
          </div>\
              '.fill([name, html]);
		var iniFun = function(obj, s) {
			obj.onclick = obj.querySelector(".no").onclick = function() {
				evt.removeEvent(s);
				obj.parentNode.removeChild(obj);
				fun.cancel();
				obj = null;
			}
			obj.querySelector(".ok").onclick = function(a) {
				evt.removeEvent(s);
				obj.parentNode.removeChild(obj);
				fun.certain(obj);
				obj=null;
			}
			fun.ini(obj)
		}
		var cancelFun = function() {
			fun.cancel();
		}
		$.createBox(code, iniFun, cancelFun);
	}
	$.iframe = function(url) {
		var code = '<iframe style="width:100%;height:100%;background:white;" url="'+url+'"></iframe>';
		var iniFun = function(obj) {
			obj.querySelector("iframe").contentWindow.location.href = url;
			fullScreen(obj);
		}
		this.createBox(code, iniFun);
	}
	$.select = function(name, data, index) {
		var obj = createWin()
		var section = obj.section;
		var win = obj.win;
		var re = index ? data[index] : data[0];
		var d = document.createElement("div");
		d.classList.add("select_box");
		obj.header.innerHTML = name;
		d.onclick = function(e) {
			var ele = e.srcElement;
			if (ele == d) return;
			re = ele.innerHTML;
		}
		for (var i = 0; i < data.length; i++) {
			var a = data[i];
			var s = document.createElement("div")
			s.innerHTML = a;
			d.appendChild(s);
		}
		section.appendChild(d);

		return new Promise(function(resolve) {
			obj.certain = function(a) {
				resolve(re);
			}

			obj.cancel = function(a) {
				resolve(false);
			}
		});
	}
	/**
	 * @param {String} name
	 * @param {Array} data
	 * @param {Number} index
	 */
	$.select = function(name, data, index, bool) {
		return new Promise(function(resolve) {
			var html = ""
			for (var i = 0; i < data.length; i++) {
				var a = data[i];
				html += '<div class="item" data-index='+i+'>'+a+'</div>';
			}
			var code = '<div class="select_box">'+html+'</div>';
			var fun = {};
			fun.cancel = function() {
				resolve(false);
			}
			fun.certain = function(obj) {
				var re=[];
				var o=obj.querySelector(".select_box").querySelectorAll(".selected");
				for(var i=0;i<o.length;i++){
					re.push(o[i].innerHTML)
				}
				if(!bool)re=re[0]||false;
				resolve(re);
			}
			fun.ini = function(obj) {
				obj.querySelector(".select_box").onclick = function(e) {
					var ele = e.srcElement;
					if (ele == this) return;
					if(!bool){
						//单选
						var o=obj.querySelector(".select_box").querySelectorAll(".item");
						for(var i=0;i<o.length;i++){
							o[i].classList.remove("selected");
						}
						ele.classList.add("selected");
					}else{
						//多选  未完成
						ele.classList.toggle("selected");
					}
				}
			}
			$.createWin(name, code, fun);
		});
	}
	/**
	 * @param {String} title
	 * @param {Array} arr
	 */
	$.input = function(title,arr) {
		var re = {};
		var obj = createWin()
		var section = obj.section;
		var header=obj.header;
		header.innerHTML=title||"";
		var win = obj.win;
		for (var i = 0; i < arr.length; i++) {
			var a = arr[i];
			var name = a[0];
			var data = a[1];
			var value = "";
			var dataList = ""; //a[2];
			if (data) {
				if (data instanceof Array) {
					if (a[2] && typeof a[2] == "number") {
						value = data[a[2]];
					} else {
						value = data[0];
					}
					dataList = data;
				} else {
					value = data;
				}
			}
			var d = document.createElement("div")
			d.innerHTML = name;
			re[name] = value || "";
			var text = document.createElement("input");
			text.type = "text";
			text.value = value || "";
			text.oninput = function(e) {
				re[name] = text.value;
			}
			d.appendChild(text);
			if (dataList) {
				var s = document.createElement("input");
				s.type = "button";
				s.value = "选择";
				s.onclick = function(e) {
					$.select(name, dataList, 0).then(function(r){
						text.value = r;
						re[name] = r;
					})
					//alert(r)
				}
				d.appendChild(s);
			}
			section.appendChild(d);
		}

		return new Promise(function(resolve) {
			obj.certain = function(a) {
				resolve(re);
			}

			obj.cancel = function(a) {
				resolve(false);
			}
		});
	}

	/**
	 * 添加下拉菜单
	 * json{
		 src:目标节点
		 title:标题节点
		 move:移动-回调函数
		 end:结束-回调函数
	 }
	 */
	$.addDownFlush = (function(){
		var isTop = function(obj) {
			var t = obj.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
			//alert("t:"+t)
			return t === 0 ? true : false;
		}
		return function(json){
			var obj = json.src;
			var title = json.title
			var istop;
			var Y = 0;
			var M = 0;
			var X = 0;
			var isMobile = navigator.userAgent.indexOf("Mobile")>-1;
			var u = {
			    //切换事件
			    handleEvent: function(e) {
			        switch (e.type) {
					case "mousedown":
			        case "touchstart":
			            this.start(e);
			            //show("start");
			            break;
					case "mousemove":
			        case "touchmove":
			            this.move(e);
			            //show("move");
			            break;
					case "mouseup":
			        case "touchcancel":
					case "touchend":
			            this.end(e);
			            break;
			        case "webkitTransitionEnd":
			        case "msTransitionEnd":
			        case "oTransitionEnd":
			        case "otransitionend":
			        case "transitionend":
			            //d(this.transitionEnd(t))
			        }
			        e.stopPropagation && e.stopPropagation();
			    },
			    start: function(e) {
					istop=isTop(obj);
					if(e.touches){
						Y = e.touches[0].pageY;
						X =  e.touches[0].pageX;
						obj.addEventListener("touchmove", this, !1),
						obj.addEventListener("touchend", this, !1);
					}else{
						Y = e.pageY;
						X=e.pageX;
						obj.addEventListener("mousemove", this, !1),
						obj.addEventListener("mouseup", this, !1);
					}
					e.srcElement.setCapture && e.srcElement.setCapture();
					return 0;
			    },
			    move: function(e) {
					if(e.touches){
						M = e.touches[0].pageY - Y;
						X =  e.touches[0].pageX;
					}else{
						M = e.pageY - Y;
						X=e.pageX;
					}
					if (istop && M > 0 ) {
						title.style.height =( M>160?160:M)+"px";//"20px";
						//obj.style.transform = "translateY(20px)";
						json.move(X,M);
					} else {
						//obj.style.transform = "translateY(0)";
						title.style.height = "0px";
						title.innerHTML = "";
					}
			    },
			    end: function(e) {
					if (istop && M > 0 ) {
						if (M > 80) {
							json.end(X,M);
							e.stopPropagation||e.stopPropagation()
							e.preventDefault&&e.preventDefault();
						} else {
							//document.title = "end"
						}
						//obj.style.transform = "translateY(0)";
						title.style.height = "0px";
						//title.style.transition = "all ease 0.5s";
						title.innerHTML = "";
					}
					M = 0;
					if(e.touches){
						obj.removeEventListener("touchmove", u, !1),
						obj.removeEventListener("touchend", u, !1)
					}else{
						obj.removeEventListener("mousemove", u, !1),
						obj.removeEventListener("mouseup", u, !1)
					}
					e.srcElement.releaseCapture && e.srcElement.releaseCapture();
			    }
			};
			obj.addEventListener("touchstart", u, !1)
			obj.addEventListener("mousedown", u, !1)
			obj.onselectstart=function(e){
				return false;
			}; 
			
		}
	})()
	
	$.addBottomEvent = (function() {
		var fun;
		var Y = 0;
		var Y2 = 0;
		var time;
		var u = {
			//切换事件
			handleEvent: function(e) {
				switch (e.type) {
					case "touchstart":
						this.start(e);
						break;
					case "touchmove":
						this.move(e);
						break;
					case "touchend":
						this.end(e);
						break;
					case "webkitTransitionEnd":
					case "msTransitionEnd":
					case "oTransitionEnd":
					case "otransitionend":
					case "transitionend":
						this.transitionEnd(e);
				}
				e.stopPropagation && e.stopPropagation();
			},
			start: function(e) {
				var o = e.touches[0];
				var y = o.pageY;
				var h = window.innerHeight;
				if (h - y < 20) {
					time = new Date();
					Y = Y2 = y;
					document.addEventListener("touchmove", this, !1),
						document.addEventListener("touchend", this, !1)
				}
			},
			move: function(e) {
				var o = e.touches[0];
				Y2 = o.pageY;
				if (!(e.touches.length > 1)) {
					e.disableScroll && e.preventDefault();
					//var o = e.touches[0];
				}
			},
			end: function(e) {
				var o = e.touches[0];
				var t = new Date - time;
				if (t < 500 && (Y - Y2) > 60 && fun) {
					fun(e)
				}
				Y = 0;
				Y2 = 0;
				document.removeEventListener("touchmove", this, !1);
				document.removeEventListener("touchend", this, !1);
			}
		};
		document.addEventListener("touchstart", u, !1);
		return function(f) {
			fun = f;
		}
	})()
	/**
	 * 自定义窗口
	 */
	$.Dialog=(function(){
		var Dialog=function(obj){
			var t=this;
			var obj=obj;
			var contain=obj.querySelector(".contain");
			if(!contain.classList.contains("type-3")){
				contain.onclick = function() {
					window.event.stopPropagation();
				}
			}
			var no= function() {
				obj.classList.add("hide");
				t.no&&t.no(obj);
				obj = null;
			}
			var ok= function(a) {
				obj.classList.add("hide");
				t.ok&&t.ok(obj);
				obj=null;
			}
			var close_button=obj.querySelector(".close");
			close_button&&(close_button.onclick=no);
			var no_button=obj.querySelector(".no");
			no_button&&(no_button.onclick=no);
			obj.onclick =  no;
			var ok_button=obj.querySelector(".ok");
			ok_button&&(ok_button.onclick =ok);
			this.show=function(){
				obj.classList.remove("hide");
			}
			this.hide=function(){
				obj.classList.remove("hide");
				obj.classList.add("hide");
			}
			this.title=function(txt){
				var title=obj.querySelector(".title");
				title&&(title.innerHTML=txt);
			}
		}
		return function(obj){
		return new Dialog(obj);
	}
	})()
	/**
	 * @param {Object} a
	 * 提示窗口
	 */
	$.tip=(function(){
		var timeout1;
		return function(str,time,bool,fun){
			var time = time ? 1000* time: 1000;
		    var m=document.querySelector("body");
			if(timeout1)window.clearTimeout(timeout1);
		    m.classList.remove("msg-on");
		    var msg = document.querySelector("#msg-cnt");
			if(!msg){
				var msg = document.createElement("div");
				msg.classList.add("msg-cnt");
				msg.id="msg-cnt";
				document.body.appendChild(msg);
			}
		    //index ? i.attr("class", "msg-cnt msg-type-" + index) : 
			msg.classList.add("msg-cnt");
		    msg.innerHTML="<span>" + str + "</span>";//.off("animationend"),
		    m.classList.add("msg-on");
		    var fun = fun;
		    timeout1=window.setTimeout(function() {
		        m.classList.remove("msg-on"),
		        fun && fun()
		    },
		    time)
		}
	})()
	$.fullScreen = function(obj) {
		var el = obj || document.documentElement;
		var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
		if (typeof rfs != "undefined" && rfs) {
			rfs.call(el);
		};
		return;
	} 
	//退出全屏
	$.exitScreen = function() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
		if (typeof cfs != "undefined" && cfs) {
			cfs.call(el);
		}
	}
	return $;
})()

var tt=function(){
	fj.input("login",[["name","docfeng"],["psw"],["author"]]).then(function(a){
		alert(JSON.stringify(a))
	})
	fj.select("test",["test1","test2","test3"],2).then(function(a){
		alert(JSON.stringify(a))
	})
	fj.tip("test",3)
}
/* 
 <div class="Dialog hide" id="rrr">
 	<div class="contain type-1">
 		<div class="header">
 			<div class="title">333</div>
 			<div class="close">X</div>
 		</div>
 		<div class="body">
 			wwwwww
 		</div>
 		<div class="footer">
 			<div class="ok">ok</div>
 			<div class="no">no</div>
 		</div>
 	</div>
 	
 </div>
 */
window.addEventListener("load",function(){
	/* var d=fj.Dialog(shelf_control);
	d.no=function(a){
		var src=event.srcElement;
		var obj;
		src.classList.contains("item")&&(obj=src)
		src.parentNode.classList.contains("item")&&(obj=src.parentNode)
		obj&&(alert(obj.dataset.index))
	}
	d.show() */
	
})
var deg90=function(a){
	var len=(window.innerHeight-window.innerWidth)/2;
	fj(".main_contain").deg90()//.css("top:"+len+"px;"+"left:"+(-len)+"px;");
	//fj(".circle-menu").deg90()//.css("bottom:-160px;left:160px");
}