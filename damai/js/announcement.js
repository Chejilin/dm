window.onload = function () {
    $(document).ready(function () {
        var cityID = $("#cityID").val();
        if (cityID == undefined || cityID == null) {
            cityID = $("#CityID").val();
        }
        $.getScript('//www.damai.cn/ajax.aspx?type=388&cityID=' + cityID + '&URL=' + document.URL, function () {
            if (AnnContent != null && AnnContent != undefined && AnnContent != "") {
                $("body:first").prepend("<style>.dm-top-tips{ background:#ffffe1; border-bottom:1px solid #ffa461; line-height:36px; padding:0 10px; color:#333; text-align:center;}</style><div class='dm-top-tips'>" + AnnContent + "</div>");
            }
        });
    });
    $(".xnchatService").click(function () {
        if (/^https:\/\/www\.damai\.cn\/+(\?.*)?$/.test(location.href) ||
            /^https:\/\/www\.damai\.cn\/[a-z]{2,10}\/(\?.*)?$/.test(location.href) ||
            /^https:\/\/www\.damai\.cn\/[a-z]{2,10}\/Perform\-\d{1,3}\/(\?.*)?$/.test(location.href)) {
            window.open("https://online.damai.cn/alime/toalime?from=damai_itemdetail&page=" + encodeURIComponent(location.href));
        } else {
            checkLoginb();
        }
    });

};
var checkLoginb = window["checkLoginb"] = function () {
    var ret = /damai.cn_user=[^;]*/gi.test(document.cookie);
    if (ret && (typeof userInfo == "undefined" || userInfo == null)) {
        getUserInfob();
    } else if (ret) {
        xiaonengcallback();
    } else {
        location.href = "//www.damai.cn/redirect.aspx?type=login";
    }
};

var getUserInfob = window["getUserInfob"] = function (callback) {
    $.ajax({
        url: "//piao.damai.cn/ajax/GetUserInfo.html",
        async: false,
        dataType: "jsonp",
        jsonp: "jsonCallback",
        success: function (ret) {
            if (ret.Status == 200 && ret.Data.userInfo) {
                //加载用户登录信息
                window["userInfo"] = ret.Data.userInfo;
                xiaonengcallback();
            }
        }
    });
};
function xiaonengcallback() {
    var NTKF_PARAM = window["NTKF_PARAM"] = {
        siteid: 'dm_1000',                 //平台基础id                
        settingid: 'dm_1000_9999',         //Ntalker分配的缺省客服组id，平台客服组用平台的settingid，商家客服组用商家的settingid
        uid: '' + window["userInfo"].code,                     //用户id
        uname: '' + window["userInfo"].nickName,         //用户名
        userlevel: '0'               //用户级别，1为vip用户，0为普通用户
    };
    var fun = function () {
        NTKF.im_openInPageChat('dm_1000_9999');
    };
    var script = document.createElement("script");
    script.src = "//dl.ntalker.com/js/b2b/ntkfstat.js?siteid=dm_1000";
    script.type = "text/javascript";
    if ("onload" in script) {
        script.onload = fun;
    } else if ("onreadystatechange" in script) {
        script.onreadystatechange = function () {
            var r = script.readyState;
            if (r === 'loaded' || r === 'complete') {
                script.onreadystatechange = null;
                fun();
            }
        };
    }
    document.getElementsByTagName("head")[0].appendChild(script);
}