/*
!function() {
//10
    function ini() {
        var t = !1;
        $(r).on("click", ".reward-btn,.flower-btn,.comment-btn",
        function(t) {
            var n = $(this),
            e = n.data("url") || window.location.href;
            return window.userInfo && userInfo.uid ? void(e && (window.location = e)) : i.showMsg("请先登录~", 0, i.goLogin(e))
        }).on("click", ".add-fav, .add-tag",
        function(n) {
            if (!window.userInfo || !userInfo.uid) return i.showMsg("请先登录~", 0, i.goLogin);
            var e = $(this),
            o = e.data("api");
            e.hasClass("add-fav") ? "已收藏至书架！": "书签已添加";
            t || e.hasClass("added") || (t = !0, $.ajax({
                url: o,
                type: "POST",
                success: function(t) {
                    var n = i.io.parseJson(t);
                    if (0 == n.code) i.showMsg(n.msg || "收藏成功！"),
                    e.addClass("added"),
                    e.hasClass("add-fav") && e.find("span").text("已收藏");
                    else {
                        if ( - 400 == n.code) return i.showMsg("请先登录~", 0, i.goLogin);
                        i.showMsg("添加失败，请稍后再试")
                    }
                },
                error: function(t) {
                    i.showMsg("网络不给力，稍后再试")
                },
                complete: function() {
                    t = !1
                }
            }))
        })
    }
    var i = geth(2),
    a = {
        init: ini
    },
    r = document;
    a.init();
}();
*/
//alert(geth)