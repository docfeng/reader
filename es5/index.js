window.onload = function() {
	if (browser.MyApp) chrome.computer();
	//1.显示书架
	Shelf.showAll().then(function(){
		//2.比较本地与在线记录
		Shelf.sameSince().then(function(re){
			//3.再次显示书架
			Shelf.showAll();
		});
	});
	var json={
		src:shelf_div,
		title:shelf_div.querySelector(".refreshText"),
		/* src:down_src,
		title:down_title, */
		move:function(x,y) {
			var title=this.title;
			y<80&&(title.innerHTML = "下拉刷新...");
			y>160&&(title.innerHTML = "设置");
			if(y>80&&y<120){
				var re=x/window.innerWidth;
				switch (true){
					case re<1/3:
						title.innerHTML = "释放立即旋转90度";
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
			if(y>160){
				UI.showSetting();
			}
			if(y>80&&y<160){
				var re=x/window.innerWidth;
				switch (true){
					case re<1/3:
						deg90()
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
	fj.addDownFlush(json);
}

window.onresize = function() {}
//window.addeventlistener("resize",function(){alert()},false);
/* document.oncontextmenu = function() {
	event.returnValue = false;
	UI.show("#contextmenu");
} */



get_radio = function(obj) {
	for (var i = 0; i < obj.length; i++) {
		if (obj[i].checked) {
			return obj[i].value;
		}
	}
	return false;
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

