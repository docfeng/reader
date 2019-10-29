/*
  耳机按键:nextPage();
  跳到第i章:window.page(i);
  跳到第i页:window.section(i,t);
  上一页:window.uppage()
  下一页:window.next();
  
*/

ini = function(index) {
	//alert(url+index)
	var index2 = prompt("页面", 0);
	window.page(parseInt(index) - 1)
	setTimeout(function() {
		window.section(parseInt(index2));
	}, 1000);
}

function keyCode(i) {
	alert(i)
}
//监听耳机按键
function nextPage() {
	//alert(next)

	if (window.ds) {
		window.clearTimeout(ds);
	}
	var next = function() {
		window.ds = setTimeout(function() {
			window.next();
		}, 500);
	}
	var uppage = function() {
		window.ds = setTimeout(function() {
			window.uppage();
		}, 500);
	}
	if (!window.time1) {
		window.time1 = new Date();
		next();
	} else {
		var t2 = new Date();
		var t = t2 - window.time1;
		window.time1 = t2
		if (t < 400) {
			window.uppage();
			window.uppage()
		} else {
			window.next();
		}
	}

}
window.onkeydown = function(e) {
	switch (e.keyCode) {
		case 40: //下
			window.next();
			break;
		case 38: //上
			window.uppage();
			break;
	}
}
showMsg = geth(2).showMsg;
//showMsg("fffggf");

show = function(str) {
		e = $("#page-nav");
		e.html(str)
	}

	//初始化界面
	! function() {
		function setFontSize(t, n) {
			var ft = $("#cfg-font"),
				ut = ft.find(".fs-add"),
				ht = ft.find(".fs-rdu"),
				mt = ft.find(".fs-dft");
			var e = fontSize.range,
				t = 1 * t;
			if ("number" == typeof t) {
				0 > t && (t = 0);
				t > e && (t = e);
				0 == t ? ht.addClass("disabled") : ht.removeClass("disabled");
				t == e ? ut.addClass("disabled") : ut.removeClass("disabled");
				t == fontSize.dft ? mt.addClass("cur") : mt.removeClass("cur");
				fontSize.cur = t;
				if (!n) {
					var a = $("body").attr("class").replace(/\s*fstep-\d\s*/g, " fstep-" + t + " ");
					$("body").attr("class", a);
					cacl(Z)
				}
			}
		}
		//设置控制
		function settingControl() {
			$(window).on("resize orientationchange", function(t) {
				body.removeClass("cfg-on").removeClass("fn-on");
				"lr" == Direction && cacl(Z);
			})

			//设置页面底部
			$(".fb-icon").on("click", "li>a, li>div", function() {
				var n = $(this).find(".icon");
				n.addClass("icon-taped");
				setTimeout(function() {
						n.removeClass("icon-taped")
					},
					500);
			});

			//字体设置
			$("#cfg-font").on("click", "menuitem", function(e) {
				e.preventDefault();
				var n = $(this),
					size = fontSize.cur,
					o = fontSize.dft;
				if (!n.hasClass("disabled") && !n.hasClass("cur")) {
					n.hasClass("fs-add") && setFontSize(size + 1);
					n.hasClass("fs-rdu") && setFontSize(size - 1);
					n.hasClass("fs-dft") && setFontSize(o);
				}
			});
			//背景色
			$("#cfg-bg").on("click", "menuitem", function(e) {
				e.preventDefault();
				var n = $(this);
				if (!n.hasClass("cur")) {
					bgcolor = n.data("cls");
					var classlist = $("body").attr("class").replace(/\s*bg-\d\s*/g, " " + bgcolor + " "); //替换class
					$("body").attr("class", classlist);
					n.addClass("cur").siblings("menuitem").removeClass("cur")
				}
			});
			//设置底部:关灯,开灯,设置
			$("#fn-btm").on("click", "li.night div", function(e) {
				e.preventDefault();
				$("body").removeClass("rd-day").addClass("rd-night");
				Day_Night = "night";
			}).on("click", "li.day div", function(e) {
				e.preventDefault();
				$("body").removeClass("rd-night").addClass("rd-day");
				Day_Night = "day";
			}).on("click", "li.li-cfg div", function(e) {
				e.preventDefault();
				body.toggleClass("cfg-on");
				return false;
			});
			//设置滑动模式：左右、上下
			$("#cfg-mode").on("click", "menuitem", function(t) {
				var n = $(this);
				if (!n.hasClass("cur")) {
					var e = n.hasClass("mode-lr"),
						o = $("#rd-txt");
					setCur(n);
					body.removeClass("fn-on cfg-on");
					if (e) {
						Direction = "lr";
						body.addClass("page-lr");
						cacl();
					} else {
						Direction = "ud";
						pageIndex = 1;
						body.removeClass("page-lr");
						o.removeAttr("style");
					}
					body.removeClass("tip-off").addClass("tip-on"), H = !0
				}
			})

			var tap_hdl = $("#tap-hdl"); //点击控制面板
			//点击左边pg-lft,点击右边pg-rit,点击中间.fn-div
			tap_hdl.on("click", ".fn-div", function(t) {
				t.preventDefault();
				body.toggleClass("fn-on").removeClass("cfg-on").removeClass("idx-on");
				V = !1;
			}).on("touchmove", function(t) {
				body.removeClass("cfg-on").removeClass("fn-on")
			})
			//上一页、下一页
			tap_hdl.on("click", "div", function(t) {
				var n = $(this);
				n.hasClass("pg-lft") && !z() && nextPage(); //upPage(),
				n.hasClass("pg-rit") && !z() && nextPage();
				return false
			})

			//上下滑动,上一页,下一页事件
			tap_hdl.on("click", ".pg-up", function(t) {
				!z() && P(); //全部修改成下一章P(),
				return false;
			}).on("click", ".pg-dn", function(t) {
				!z() && D();
				return false;
			})
		}
		//页面点击、窗口关闭时设置cookie
		function y() {
			function o() {
				//var t = ["fstep-" + fontSize.cur, bgcolor, "page-" + Direction, "rd-" + Day_Night];
			}
			window.onbeforeunload = function() {
				o();
			}
			$("#cfg-pnl menuitem").on("click", function() {
				o()
			})
		}

		function z() {
			//判断是否含有cfg-on,如果没有,移除cfg-on fn-on
			var t = body.hasClass("cfg-on");
			var a = t && body.removeClass("cfg-on").removeClass("fn-on"),
				t;
			return a
		}

		//上下控制:上
		function P(t) {
			var n = body.scrollTop(),
				e = $(window).height(),
				o = $("#rd-top").height(); //阅读页顶部条
			//body.height();
			n > 0 ? body.scrollTop(n - (e - o)) : upChapter()
		}

		//上下控制:下
		function D(t) {
			var n = body.scrollTop(),
				e = $(window).height(),
				o = $("#rd-top").height(), //阅读页顶部条
				i = body.height();
			i > n + e ? body.scrollTop(n + (e - o)) : nextChapter()
		}

		function setCur(obj) {
			$(obj).addClass("cur").siblings().removeClass("cur")
		}




		var B = geth(2),
			j = getn(7),
			N = B.supportAnimate().supported,
			U = B.cookie,
			pageCount = 1,
			Direction = "", //lr or ud
			Day_Night = "", //day or night
			pageIndex = 1,
			Z = 0,
			pageLeft = -342,
			H = !1, //上下false;左右true
			bgcolor = "bg-2", //背景色
			body = $("body"),
			fontSize = {
				range: 6,
				cur: 3,
				dft: 3
			},
			st = {
				init: function() {
					//初始化阅读界面
					this.formatPage();
					//初始化控制界面
					this.reactCtls();
				},
				formatPage: function() {
					var body = $("body");
					//history.pushState(null, null, t))
					if (body.hasClass("page-lr")) {
						Direction = "lr";
						cacl(Z);
						setCur($("#cfg-mode").find(".mode-lr"));
					} else {
						Direction = "ud";
						setCur($("#cfg-mode").find(".mode-ud"));
					}
					Z && body.scrollTop(body.height() * Z - 32),
						Day_Night = "day"; //body.hasClass("rd-night") ? "night": "day";

					var e = body.attr("class");
					//设置字体大小
					var s = e.match(/fstep-\d/);
					setFontSize(s ? s[0].split("-")[1] : 3, "noset");
					//设置背景色
					var d = e.match(/bg-\d/);
					d = d ? d[0].split("-")[1] : 2;
					bgcolor = "bg-" + d;
					setCur($("#cfg-bg").find(".bg-" + d));
					//$("html").addClass("chn-" + u)
				},
				clearRead: function() {
					body.removeClass("fn-on").removeClass("cfg-on").removeClass("idx-on"),
						V = !1
				},
				reactCtls: function() {
					//屏幕幕布 l(),
					//未知h(),
					settingControl() //设置底部、设置背景色
					//y()//页面点击、窗口关闭时设置cookie
				}
			}
		st.init();






		//屏幕换页动画
		function move(obj, t, x, y, fun) {
			//动画持续n秒;
			var obj = $(obj);
			obj.css("-webkit-transition", "-webkit-transform " + t + "ms ease");
			obj.css("-o-transition", "-o-transform " + t + "ms ease");
			obj.css("-moz-transition", "-moz-transform " + t + "ms ease");
			obj.css("-ms-transition", "-ms-transform " + t + "ms ease");
			obj.css("transition", "transform " + t + "ms ease");

			//沿x轴滚动x,沿y轴滚动y;
			var x = "number" == typeof x ? x + "px" : x;
			var y = "number" == typeof y ? y + "px" : y;
			obj.css("-webkit-transform", "translate3d(" + x + ", " + y + ",0)");
			obj.css("-moz-transform", "translate3d(" + x + ", " + y + ",0)");
			obj.css("-o-transform", "translate3d(" + x + ", " + y + ",0)");
			obj.css("-ms-transform", "translate3d(" + x + ", " + y + ",0)");
			obj.css("transform", "translate3d(" + x + ", " + y + ",0)");
			//如果fun为function,t秒后执行fun;
			"function" == typeof fun && setTimeout(fun, t);
		}
		Page.move = function(obj, t, x, y, fun) {
			move(obj, t, x, y, fun)
		}
		//rd-txt在t秒内沿横轴移动-x个屏幕距离;
		function scroll(x, t) {
			var width = $(window).width();
			var obj = "#rd-txt";
			var x = x || pageIndex;
			var t = t || 0;
			var len = -width * (x - 1);
			pageLeft = len
			//obj对象t毫秒内沿x轴移动len长度，y轴移动0长度;
			move(obj, t, len, 0);
		}
		//计算界面,移动到第(t*总页数)页;
		function cacl(t) {
			if ("lr" == Direction) {
				var obj = $("#rd-txt");
				win_width = $(window).width();
				win_height = B.isMobile.iOS() ? window.innerHeight : $(window).height();
				obj.css({
					height: win_height,
					width: win_width
				});
				//rd-txt长度;
				var txt_width = document.getElementById("rd-txt").scrollWidth;
				//计算页数
				pageCount = Math.ceil(txt_width / win_width);
				t && (pageIndex = Math.max(Math.floor(t * pageCount), 1), scroll(pageIndex, 0));
				//显示页码
				$("#page-nav").html(pageIndex + "/" + pageCount);
				//alert(e.html())
				window.scrollTo(0, 1);
			}
		}
		//上一章
		function upChapter() {
			window.page(Page.index1 - 1);
		}
		//下一章
		function nextChapter() {
			window.page(Page.index1 + 1);
		}
		window.page = function(i) {
			//页数等于第1页;
			pageIndex = 1;
			if (i < 0) i = 0;
			if (i + 1 == Page.arr.length) {
				fj.tip("已阅读到书本末尾")
			}
			if (i + 1 > Page.arr.length) {
				fj.tip("已阅读到书本末尾")
				return Promise.reject("已阅读到书本末尾");
			}
			return Page.multiIndex(i).then(function(txt) {
				if (!txt) return Promise.reject("err:window.page:\nno txt\n" + txt);
				txt = Page.formatUI(txt);
				Page.index1 = i;
				$("#rd-txt").html(txt);
				$("#page-name").html(Page.arr[i][1] + ":    " + Page.name);
				$("#novelName").html(Page.name);
				Z = (pageIndex / pageCount).toFixed(2); //保留小数点2位
				scroll(pageIndex, 0);
				void cacl();
			}).catch(function(e) {
				alert("err:window.page:\nno txt\n" + e)
			});
		}
		//上一页
		function upPage(t) {
			pageIndex--;
			window.section(pageIndex, t);
		}
		//下一页
		function nextPage(t) {
			pageIndex++;
			window.section(pageIndex, t);
		}
		window.next = nextPage;
		window.uppage = function() {
			pageIndex--;
			window.section(pageIndex, 0);
		}
		window.section = function(i, t) {
			document.body.classList.remove("fn-on", "cfg-on");
			//body.removeClass("fn-on cfg-on");
			pageIndex = i;
			if (0 >= pageIndex) {
				//如果页面<=0,上一章;
				//pageIndex = 1;
				//upChapter();
				window.page(Page.index1 - 1).then(function(foo1) {
					window.section(pageCount, 0)
				});
			} else if (pageIndex > pageCount) {
				//如果页码>页数,下一章;
				pageIndex = pageCount;
				nextChapter()
			} else {
				Z = (pageIndex / pageCount).toFixed(2);
				scroll(pageIndex, 0==t?0:(t || 400))
				void cacl();
			}
			Page.index2 = pageIndex;
			return;
		};
		Page.resize = function() {
			document.body.classList.remove("cfg-on", "fn-on")
			//body.removeClass("cfg-on").removeClass("fn-on");
			"lr" == Direction && cacl(Z);
		};
		(function() {
			var t = {},
				n = {},
				o = !1,
				tap_hdl = document.getElementById("tap-hdl"),
				a = document.getElementById("rd-txt"),
				r = tap_hdl.getBoundingClientRect().width || tap_hdl.offsetWidth,
				s = $(tap_hdl).height(),
				c = function() {},
				d = function(t) {
					setTimeout(t || c, 0)
				},
				l = 0,
				f = 0,
				isMobile = navigator.userAgent.indexOf("Mobile") > -1,
				u = {
					//切换事件
					handleEvent: function(e) {
						switch (e.type) {
							case "mousedown":
							case "touchstart":
								this.start(e);
								break;
							case "mousemove":
							case "touchmove":
								this.move(e);
								break;
							case "mouseup":
							case "losecapture":
							case "touchend":
								d(this.end(e));
								break;
							case "webkitTransitionEnd":
							case "msTransitionEnd":
							case "oTransitionEnd":
							case "otransitionend":
							case "transitionend":
								d(this.transitionEnd(e))
						}
						e.stopPropagation()
					},
					start: function(e) {
						if (!H) { //判断是否上下模式
							if (e.touches) {
								var a = e.touches[0];
							} else {
								var a = e;
							}
							t = {
									x: a.pageX,
									y: a.pageY,
									time: +new Date
								},
								o = void 0,
								n = {}
							if (e.touches) {
								tap_hdl.addEventListener("touchmove", this, !1);
								tap_hdl.addEventListener("touchend", this, !1);
							} else {
								tap_hdl.addEventListener("mousemove", this, !1);
								tap_hdl.addEventListener("mouseup", this, !1);
							}
						}
					},
					move: function(e) {
						if (e.touches) {
							var r = e.touches[0];
							var bool = !(e.touches.length > 1 || e.scale && 1 !== e.scale)
						} else {
							var r = e;
							var bool = !(e.scale && 1 !== e.scale);
						}
						if (bool) {
							//i.preventDefault();
							n = {
								x: r.pageX - t.x,
								y: r.pageY - t.y
							};
							"undefined" == typeof o && (o = !!(o || Math.abs(n.x) < Math.abs(n.y)))
							if (!o && "lr" == Direction) {
								e.preventDefault();
								if (1 == pageIndex && n.x > 0) return;
								if (pageIndex == pageCount && n.x < 0) return;
								move(a, 0, pageLeft + n.x, 0)
							}
						}
					},
					end: function(e) {
						var a = +new Date - t.time,
							c = !1;
						"lr" == Direction && (c = Number(a) < 250 && Math.abs(n.x) > 20 || Math.abs(n.x) > r / 4);
						"ud" == Direction && (c = Number(a) < 250 && Math.abs(n.y) > 20 || Math.abs(n.y) > s / 4);
						if (!o && "lr" == Direction) {
							var d = 1 == pageIndex && n.x > 0 || pageIndex == pageCount && n.x < 0;
							if (d) return void(1 == pageIndex && n.x > 0 ? upPage(200) /* upChapter() */ : pageIndex == pageCount && n.x <
								0 && nextChapter());
							c ? (n.x > 0 && upPage(200), n.x < 0 && nextPage(200)) : scroll(pageIndex, 200)
						}
						if (o && "ud" == Direction) {
							var h = $(window);
							n.y < 0 && (f--, f = Math.max(f, 0));
							n.y > 0 && (l--, l = Math.max(l, 0));
							n.y < 0 && body.scrollTop() + h.height() >= body.height() && (l++, l >= 2 && nextChapter());
							n.y > 0 && body.scrollTop() <= 0 && (f++, f >= 2 && upPage(200) /* upChapter() */ )
						}
						if (e.touches) {
							tap_hdl.removeEventListener("touchmove", u, !1);
							tap_hdl.removeEventListener("touchend", u, !1);
						} else {
							tap_hdl.removeEventListener("mousemove", u, !1);
							tap_hdl.removeEventListener("mouseup", u, !1);
						}
					}
				};
			//if(isMobile){
			tap_hdl.addEventListener("touchstart", u, !1)
			//}else{
			tap_hdl.addEventListener("mousedown", u, !1);
			//}
		})();

		//初始化
		window.addEventListener("load", function() {
			//点击显示目录
			document.getElementById("idx-zd").onclick = function() {
				Page.showList();
				return;
			}
		}, false);
	}();
