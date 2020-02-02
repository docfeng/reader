window.onload = function() {
	if (browser.MyApp) chrome.computer();
	Shelf.showAll().then(function(){
		Shelf.sameSince().then(function(re){
			Shelf.showAll();
		});;
	});
	var json={
		src:shelf_div,
		title:shelf_div.querySelector(".refreshText"),
		/* src:down_src,
		title:down_title, */
		move:function(x,y) {
			var title=this.title;
			y<60&&(title.innerHTML = "下拉刷新...");
			y>120&&(title.innerHTML = "设置");
			if(y>60&&y<120){
				var re=x/window.innerWidth;
				switch (true){
					case re<1/3:
						title.innerHTML = "释放立即刷新...1";
						break;
					case re>2/3:
						title.innerHTML = "释放立即刷新...2";
						break;
					default:
						title.innerHTML = "释放立即刷新...3";
						break;
				}
			}
		},
		end:function(x,y) {
			//var re=parseInt(window.innerWidth/x);
			//alert(re)
			if(y>120){
				UI.showSetting();
			}
			if(y>60&&y<120){
				var re=x/window.innerWidth;
				switch (true){
					case re<1/3:
						alert(1)
						break;
					case re>2/3:
						alert(3)
						break;
					default:
						alert(2);
						break;
				}
			}
		}
	}
	addDownFlush(json);
}

window.onresize = function() {}
//window.addeventlistener("resize",function(){alert()},false);
/* document.oncontextmenu = function() {
	event.returnValue = false;
	UI.show("#contextmenu");
} */

addDownFlush = function(json){
	var obj = json.src;
	var title = json.title
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
			this.setCapture && this.setCapture();
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
			document.title=M
			if (isTop() && M > 0) {
				title.style.height = "20px";
				obj.style.transform = "translateY(20px)";
				obj.style.transition = "all ease 0.5s";
				json.move(X,M);
			} else {
				obj.style.transform = "translateY(0)";
				title.style.height = "0px";
				title.innerHTML = "";
			}
	    },
	    end: function(e) {
			if (isTop() && M > 0) {
				if (M > 60) {
					json.end(X,M);
					e.stopPropagation||e.stopPropagation()
					e.preventDefault&&e.preventDefault();
				} else {
					//document.title = "end"
				}
				obj.style.transform = "translateY(0)";
				title.style.height = "0px";
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
	var isTop = function() {
		var t = obj.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
		//alert("t:"+t)
		return t === 0 ? true : false;
	}
}

get_radio = function(obj) {
	for (var i = 0; i < obj.length; i++) {
		if (obj[i].checked) {
			return obj[i].value;
		}
	}
	return false;
}

shiftDiv = function(div) {
	if (_reg.style.display == "" || _reg.style.display == "block") {
		div.style.display = "none";
	} else {
		div.style.display = "block";
	}
}

/* window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
     window.applicationCache .swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false); */

UI = {
	show: function(id) {
		//document.querySelector(id).style.display = "flex";
		if(window.getComputedStyle(document.querySelector(id),null).visibility=="hidden"){
			document.querySelector(id).style.visibility='visible';
		}
		evt.addEvent(function() {
			document.querySelector(id).style.visibility="hidden";
		});
	},
	showSetting:function(){
		this.show('#contextmenu')
	},
	showList:function(){
		this.show('#listDiv')
	},
	showPage:function(){
		//document.querySelector("#main_contain").style.visibility='visible';
		this.show('#pageDiv')
	},
	showSearch:function(){
		this.show('#searchDiv')
	},
	showMain:function(){
		document.querySelector("#main_contain").style.visibility='visible';
	},

	toast: function() {
		var task = [];
		var bool = true;

		function toast(msg) {
			task[task.length] = msg;
			var show = function() {
				bool = false;
				var msg = task.shift();
				setTimeout(function() {
					document.getElementsByClassName('toast-wrap')[0].getElementsByClassName('toast-msg')[0].innerHTML = msg;
					var toastTag = document.getElementsByClassName('toast-wrap')[0];
					toastTag.className = toastTag.className.replace('toastAnimate', '');
					setTimeout(function() {
						toastTag.className = toastTag.className + ' toastAnimate';
						if (task.length > 0) {
							show();
						} else {
							bool = true;
						}
					}, 1000);
				}, 1500);
			}
			if (bool) {
				show();
			}
		}
		return toast;
	}()
}

