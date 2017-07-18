var ie = navigator.appName == "Microsoft Internet Explorer" ? true : false;
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var calendarSettings = [
  {
      year: 2017,
      month: 1,
      days: [{
          day: 1,
          holiday: true,
          festival: "元旦"
      }]
  }, {
      year: 2015,
      month: 2,
      days: [{
          day: 14,
          holiday: false,
          festival: "西洋情人节"
      }, {
          day: 18,
          holiday: true,
          festival: "除夕"
      }, {
          day: 19,
          holiday: true,
          festival: "春节"
      }, {
          day: [20, 21, 22, 23, 24],
          holiday: true
      }]
  }, {
      year: 2015,
      month: 3,
      days: [{
          day: 5,
          holiday: false,
          festival: "元宵节"
      }, {
          day: 8,
          holiday: false,
          festival: "妇女节"
      }, {
          day: 12,
          holiday: false,
          festival: "植树节"
      }]
  }, {
      year: 2015,
      month: 4,
      days: [{
          day: 5,
          holiday: true,
          festival: "清明节"
      }, {
          day: [4, 6],
          holiday: true
      }]
  }, {
      year: 2015,
      month: 5,
      days: [{
          day: 1,
          holiday: true,
          festival: "劳动节"
      }, {
          day: [2, 3],
          holiday: true
      }]
  }, {
      year: 2015,
      month: 6,
      days: [{
          day: 20,
          holiday: true,
          festival: "端午节"
      }]
  }, {
      year: 2015,
      month: 7,
      days: [{
          day: 1,
          holiday: false,
          festival: "建党节"
      }]
  }, {
      year: 2015,
      month: 8,
      days: [{
          day: 1,
          holiday: false,
          festival: "建军节"
      }, {
          day: 20,
          holiday: false,
          festival: "七夕节"
      }]
  }, {
      year: 2015,
      month: 9,
      days: [{
          day: 10,
          holiday: false,
          festival: "教师节"
      }, {
          day: 27,
          holiday: true,
          festival: "中秋节"
      }]
  }, {
      year: 2015,
      month: 10,
      days: [{
          day: 1,
          holiday: true,
          festival: "国庆节"
      }, {
          day: [2, 3, 4, 5, 6, 7],
          holiday: true
      }, {
          day: 21,
          holiday: false,
          festival: "重阳节"
      }]
  }, {
      year: 2015,
      month: 12,
      days: [{
          day: 24,
          holiday: false,
          festival: "平安夜"
      }, {
          day: 25,
          holiday: false,
          festival: "圣诞节"
      }]
  }
];

function getSetting(date) {
    var ret = {};
    var month = date.getMonth() + 1,
    day = date.getDate(),
    year = date.getFullYear();
    for (var i = 0; i < calendarSettings.length; i++) {
        if (calendarSettings[i].month == month && calendarSettings[i].year == year) {
            for (var j = 0; j < calendarSettings[i].days.length; j++) {
                var sday = calendarSettings[i].days[j];
                if (day == sday.day) {
                    ret = sday;
                } else if (Object.prototype.toString.call(sday.day) == "[object Array]") {
                    for (var d = 0; d < sday.day.length; d++)
                        if (sday.day[d] == day) ret = {
                            day: day,
                            holiday: sday.holiday,
                            festival: sday.festival
                        };
                }
            }
        }
    }

    ret.hasProject = hasProject(date);
    ret.isSearchDate = isSearchDate(date);
    return ret;
}

function hasProject(date) {
    var k = "D" + date.format("yyyyMMdd");
    if (window.projectDates && window.projectDates[k])
        return true;
    return false;
}

function isSearchDate(date) {
    if (typeof (searchDate) == 'string' && date.format("yyyy-MM-dd") == searchDate)
        return true;
    return false;
}

var controlid = null;
var currdate = null;
var startdate = null;
var enddate = null;
var yy = null;
var mm = null;
var hh = null;
var ii = null;
var currday = null;
var addtime = false;
var today = new Date();
var lastcheckedyear = false;
var lastcheckedmonth = false;

function _cancelBubble(event) {
    e = event ? event : window.event;
    if (ie) {
        e.cancelBubble = true;
    } else {
        e.stopPropagation();
    }
}

function getposition(obj) {
    var r = new Array();
    r['x'] = obj.offsetLeft;
    r['y'] = obj.offsetTop;
    while (obj = obj.offsetParent) {
        r['x'] += obj.offsetLeft;
        r['y'] += obj.offsetTop;
    }
    return r;
}

function loadcalendar() {
    s = '';
    s += '<div id="calendar" style="display:none; position:absolute; z-index:9;" onclick="_cancelBubble(event)">';
    if (ie) { }
    s += '<div style="width:auto; border:2px solid #c6cdd2; -moz-border-radius:8px; -webkit-border-radius:8px; border-radius:8px; box-shadow:0px 0px 10px #ccc;margin-top:10px;"><table class="tableborder" cellspacing="0" cellpadding="0" width="100%" style="text-align: center;">';
    s += '<tr align="center"><td colspan="7" class="dateheader" style="text-align: left; padding-left:20px; height:25px;border-top-left-radius: 5px; border-top-right-radius:5px;"><a href="#" onclick="refreshcalendar(yy, mm-1);return false" title="上一月" class="mr15"><</a><a href="#" onclick="showdiv(\'year\');_cancelBubble(event);return false" title="点击选择年份" id="year" style=" font-weight:400"></a><span class="ml5 mr10 f16 c1">年</span><a id="month" title="点击选择月份" href="#" style=" font-weight:400" onclick="showdiv(\'month\');_cancelBubble(event);return false"></a><span class="ml5 mr10 f16 c1">月</span><A href="#" onclick="refreshcalendar(yy, mm+1);return false" title="下一月" class="ml15">></A><a href="#" class="new-today" onclick="gotoToday();" style="font-size:12px; font-weight:400">返回今天</a><a href="#" class="new-error" style="font-size:12px; font-weight:400" onclick="hideCalendar();"></a></td></tr>';
    s += '<tr class="category"><td style="height:25px;">星期日</td><td style="height:25px;">星期一</td><td style="height:25px;">星期二</td><td style="height:25px;">星期三</td><td style="height:25px;">星期四</td><td style="height:25px;">星期五</td><td style="height:25px;">星期六</td></tr>';
    for (var i = 0; i < 6; i++) {
        s += '<tr class="altbg2">';
        // 修改行数
        for (var j = 1; j <= 7; j++) {
            s += "<td id=d" + (i * 7 + j) + " height=\"190\"><br></td>";
        }
        s += "</tr>";
    }

    s += '</table></div></div>';
    s += '<div id="calendar_year" onclick="_cancelBubble(event)"><div class="col">';
    for (var k = 2015; k <= 2016; k++) {
        s += k != 2015 && k % 10 == 0 ? '</div><div class="col">' : '';
        s += '<a href="#" onclick="refreshcalendar(' + k + ', mm);document.getElementById(\'calendar_year\').style.display=\'none\';return false"><span' + (today.getFullYear() == k ? ' class="today"' : '') + ' id="calendar_year_' + k + '">' + k + '</span></a><br />';
    }
    s += '</div></div>';
    s += '<div id="calendar_month" onclick="_cancelBubble(event)">';
    for (var k = 1; k <= 12; k++) {
        s += '<a href="#" onclick="refreshcalendar(yy, ' + (k - 1) + ');document.getElementById(\'calendar_month\').style.display=\'none\';return false"><span' + (today.getMonth() + 1 == k ? ' class="today"' : '') + ' id="calendar_month_' + k + '">' + k + (k < 10 ? ' ' : '') + ' 月</span></a><br />';
    }
    s += '</div>';
    var nElement = document.createElement("div");
    nElement.innerHTML = s;
    document.getElementsByTagName("body")[0].appendChild(nElement);
    // document.write(s);
    document.onclick = function (event) {
        document.getElementById('calendar').style.display = 'none';
        document.getElementById('calendar_year').style.display = 'none';
        document.getElementById('calendar_month').style.display = 'none';
    }
    document.getElementById('calendar').onclick = function (event) {
        _cancelBubble(event);
        document.getElementById('calendar_year').style.display = 'none';
        document.getElementById('calendar_month').style.display = 'none';
    }
}

function parsedate(s) {
    /(\d+)\-(\d+)\-(\d+)\s*(\d*):?(\d*)/.exec(s);
    var m1 = (RegExp.$1 && RegExp.$1 > 1899 && RegExp.$1 < 2101) ? parseFloat(RegExp.$1) : today.getFullYear();
    var m2 = (RegExp.$2 && (RegExp.$2 > 0 && RegExp.$2 < 13)) ? parseFloat(RegExp.$2) : today.getMonth() + 1;
    var m3 = (RegExp.$3 && (RegExp.$3 > 0 && RegExp.$3 < 32)) ? parseFloat(RegExp.$3) : today.getDate();
    var m4 = (RegExp.$4 && (RegExp.$4 > -1 && RegExp.$4 < 24)) ? parseFloat(RegExp.$4) : 0;
    var m5 = (RegExp.$5 && (RegExp.$5 > -1 && RegExp.$5 < 60)) ? parseFloat(RegExp.$5) : 0;
    /(\d+)\-(\d+)\-(\d+)\s*(\d*):?(\d*)/.exec("0000-00-00 00\:00");
    return new Date(m1, m2 - 1, m3, m4, m5);
}

function settime(d) {
    document.getElementById('calendar').style.display = 'none';
    //controlid.value = yy + "-" + zerofill(mm + 1) + "-" + zerofill(d) + (addtime ? ' ' + zerofill(document.getElementById('hour').value) + ':' + zerofill(document.getElementById('minute').value) : '');
    //window.search("date", yy + "-" + zerofill(mm - 0 + 1) + "-" + zerofill(d));
}

function showcalendar(event, controlid1, addtime1, startdate1, enddate1) {
    controlid = controlid1;
    addtime = addtime1;
    startdate = startdate1 ? parsedate(startdate1) : false;
    enddate = enddate1 ? parsedate(enddate1) : false;
    var dv = controlid.getAttribute("data-value");
    if (dv && dv.length > 0)
        currday = parsedate(dv);
    else currday = today;
    hh = currday.getHours();
    ii = currday.getMinutes();
    var p = getposition(controlid);

    document.getElementById('calendar').style.display = 'block';

    if (controlid1.getAttribute('data-orient') === 'left') {
        p.x -= (document.getElementById('calendar').offsetWidth - controlid1.offsetWidth);
    }

    document.getElementById('calendar').style.left = p['x'] + 'px';
    document.getElementById('calendar').style.top = (p['y'] + 20) + 'px';

    _cancelBubble(event);

    refreshcalendar(currday.getFullYear(), currday.getMonth());

    if (lastcheckedyear != false) {
        document.getElementById('calendar_year_' + lastcheckedyear).className = 'default';
        document.getElementById('calendar_year_' + today.getFullYear()).className = 'today';
    }
    if (lastcheckedmonth != false) {
        document.getElementById('calendar_month_' + lastcheckedmonth).className = 'default';
        document.getElementById('calendar_month_' + (today.getMonth() + 1)).className = 'today';
    }

    if (!document.getElementById('calendar_year_' + currday.getFullYear()) || !document.getElementById('calendar_month_' + (currday.getMonth() + 1)) || !document.getElementById('hourminute')) return;

    document.getElementById('calendar_year_' + currday.getFullYear()).className = 'checked';
    document.getElementById('calendar_month_' + (currday.getMonth() + 1)).className = 'checked';
    document.getElementById('hourminute').style.display = addtime ? '' : 'none';

    lastcheckedyear = currday.getFullYear();
    lastcheckedmonth = currday.getMonth() + 1;
}

function refreshcalendar(y, m) {
    var x = new Date(y, m, 1);
    var key = "DC" + x.format("yyyyMM");
    if (dateCache[key]) {
        projectDates = dateCache[key];
        render();
    } else {
        $.getJSON("/ajax/getCityCalendar.html", {
            cityId: cityId,
            date: x.format("yyyy-MM-dd"),
            t: Math.random()
        }, function (ret) {
            var tt = {};
            for (var i in ret.Data) {
                var ii = ret.Data[i];
                tt["D" + ii] = true;
            }
            dateCache[key] = tt;
            projectDates = dateCache[key];
            render();
        });
    }

    function render() {
        if (y <= today.getFullYear() && m < today.getMonth()) {
            return false;
        }
        var mv = x.getDay();
        var d = x.getDate();
        var dd = null;
        yy = x.getFullYear();
        mm = x.getMonth();
        document.getElementById("year").innerHTML = yy;
        document.getElementById("month").innerHTML = mm + 1 > 9 ? (mm + 1) : '0' + (mm + 1);
        for (var i = 1; i <= mv; i++) {
            dd = document.getElementById("d" + i);
            dd.innerHTML = " ";
            dd.className = "";
        }
        while (x.getMonth() == mm) {
            dd = document.getElementById("d" + (d + mv));
            var setting = getSetting(x);
            var clsN = "default ";
            var innerHTML = "";
            if ((x.getFullYear() <= today.getFullYear() && x.getMonth() < today.getMonth()) || (x.getFullYear() <= today.getFullYear() && x.getMonth() <= today.getMonth() && x.getDate() < today.getDate()) || (enddate && x.getTime() > enddate.getTime()) || (startdate && x.getTime() < startdate.getTime())) {
                clsN += 'expire ';
                innerHTML = '<div class=calendar-relative calendar-active onmouseover="calendarOver(this);" onmouseout="calendarOut(this);"><span class=date>' + d + "</span></div>";
            } else {
                innerHTML = '<div class="calendar-relative calendar-active" onmouseover="calendarOver(this)" onmouseout="calendarOut(this);"><span class="date">' + d + '</span>';
                var datestr = x.format("yyyy-MM-dd");
                var href = 'http://search.damai.cn/search.html?keyword=&cty=' + encodeURIComponent(cityName) + '&tsg=5&st=' + datestr + '&et=' + datestr;
                innerHTML += '<a target="_blank" href="' + href + '" style="position:absolute; height:100%;width:100%;top:0;left:0;background:none;"></a>';
                if (setting.hasProject) {
                    clsN += 'new-pic-dian ';
                }

                if (x.getFullYear() == today.getFullYear() && x.getMonth() == today.getMonth() && x.getDate() == today.getDate()) {
                    //clsN += 'today ';
                    if (!window.searchDate)
                        clsN += "checked";
                    dd.title = '今天';
                }

                if (setting.isSearchDate) {
                    clsN += 'checked';
                }
            }
            if (setting.holiday) {
                clsN += 'new-pic-holiday ';
            } else if (setting.workday) {
                clsN += 'new-pic-work ';
            }
            if (setting.festival && setting.festival.length > 0) {
                innerHTML += "<span class=fest>" + setting.festival + "</span>";
            }
            innerHTML += "</div>";
            dd.innerHTML = innerHTML;
            dd.className = clsN;
            x.setDate(++d);
        }

        while (d + mv <= 42) {
            dd = document.getElementById("d" + (d + mv));
            dd.innerHTML = " ";
            d++;
        }
        if (addtime) {
            document.getElementById('hour').value = zerofill(hh);
            document.getElementById('minute').value = zerofill(ii);
        }

        // add by chenxi begin at 2014-09-29 14:03
        // 隐藏最后一行为空的日历
        var calendar = document.getElementById('calendar');
        var table = calendar.getElementsByTagName('table')[0];
        var trs = table.getElementsByTagName('tr');
        var tds = table.getElementsByTagName('td');
        var days = [];
        var lines = [];

        // 获取所有行
        for (var i = 0, len = trs.length; i < len; i++) {
            if (trs[i].className.indexOf('altbg2') !== -1) lines.push(trs[i]);
        }

        // 去除空行
        for (var i = 0, len = lines.length; i < len; i++) {
            if (isEmptyLine(lines[i])) {
                lines[i].style.display = 'none';
            } else {
                lines[i].style.display = '';
            }
        }

        // 去除空日
        for (var i = 0, len = tds.length; i < len; i++) {
            if (tds[i].className.indexOf('new-pic-dian') !== -1) days.push(tds[i]);
        }

        for (var i = 0, len = days.length; i < len; i++) {
            if (!/[^\s\b\r\t]/i.test(days[i].innerHTML)) days[i].className = '';
        }

        function isEmptyLine(element) {
            var itms = element.getElementsByTagName('td');
            var empty = true;

            for (var i = 0, len = itms.length; i < len; i++) {
                if (/[^\s\b\r\t]/i.test(itms[i].innerHTML)) {
                    empty = false;
                    break;
                }
            }

            return empty;
        }
        // add by chenxi end at 2014-09-29 15:05
    }
}

// 工具集
var utlis = {
    // 去除多余空格
    trimb: function (value) {
        return value.replace(/((\s)+)/ig, '$2').replace(/^[\s\b]|[\s\b]$/ig, '');
    },
    // 增加 class
    addClass: function (element, value) {
        if ((' ' + element.className.toLowerCase() + ' ').indexOf(' ' + value + ' ') === -1) element.className += (' ' + value);

        return this;
    },
    // 移除 class
    removeClass: function (element, value) {
        if ((' ' + element.className.toLowerCase() + ' ').indexOf(' ' + value + ' ') !== -1) element.className = this.trimb(element.className.replace(value, ''));

        if (!element.className) element.removeAttribute('class');

        return this;
    }
};
// 增加 hover 效果
function calendarOver(element) {
    utlis.addClass(element, 'calendar-hover');
}

function calendarOut(element) {
    utlis.removeClass(element, 'calendar-hover');
}

// add by chenxi begin at 2014-09-29 15:05
// 返回今天
function gotoToday(ev, context) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    window.searchDate = new Date().format("yyyy-MM-dd");
    refreshcalendar(year, month);
}

function hideCalendar() {
    var calendar = document.getElementById('calendar');

    calendar.style.display = 'none';
}

// add by chenxi end at 2014-09-29 15:05

function showdiv(id) {
    var p = getposition(document.getElementById(id));

    document.getElementById('calendar_' + id).style.left = p['x'] + 'px';
    document.getElementById('calendar_' + id).style.top = (p['y'] + 16) + 'px';
    document.getElementById('calendar_' + id).style.display = 'block';
}

function zerofill(s) {
    var s = parseFloat(s.toString().replace(/(^[\s0]+)|(\s+$)/g, ''));
    s = isNaN(s) ? 0 : s;
    return (s < 10 ? '0' : '') + s.toString();
}
var projectDates = null;
var dateCache = {
    
};
loadcalendar();