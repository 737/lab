var sun = sun || {};
sun.util = sun.util || {};

sun.util.array = sun.util.array || {};

/**
 * >> ([1,2,32,4])
 * => [1, 2, 4, 32]
 * >> ([1,2,32,4], false)
 * => [32, 4, 2, 1]
 */
sun.util.array.sort = function(arrayList, isAsc) {
    if (typeof isAsc != 'boolean') {
        isAsc = true;
    }

    function sortNumber(a, b)
    {
        if (!!isAsc) {
            return a - b
        } else {
            return b - a
        }
    }

    return arrayList.sort(sortNumber);
};

/**
 * >> ([0,1,2,3,4,5,6,7,8,9], 6)
 * => [0, 1, 2, 3, 4, 5, 7, 8, 9]
 * >> ([0,1,2,3,4,5,6,7,8,9], [2,6,8])
 * => [0, 1, 3, 4, 5, 7, 9]
 */
sun.util.array.remove = function(arrayList, n) {
    //prototype为对象原型，注意这里为对象增加自定义方法的方法。
    //concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
    //这里就是返回arrayList.slice(0,n)/arrayList.slice(n+1,arrayList.length)
    //组成的新数组，这中间，刚好少了第n项。
    //slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
    if ( n < 0 || typeof n === 'undefined') {
        return arrayList;
    } else if (sun.util.isArray(n)) {
        var _tmp = null;

        n = this.sort(n, false);

        for(index in n) {
            arrayList = this.remove(arrayList, n[index]);
        }

        return arrayList;
    } else {
        return arrayList.slice(0,n).concat(arrayList.slice(n+1,arrayList.length));
    }
};

/**
 * format number
 * e.g. 12000 => 1,2000
 * >> amtStr number
 * @return string
 */
sun.util.formatIntNum = function (amtStr) {
    var isInt = function (num) {
        return (num % 1 === 0)
    };
    var amtStr = (isInt(amtStr)) ? amtStr : Number(amtStr).toFixed(0);
    amtStr = "" + amtStr;
    var a, renum = '';
    var j = 0;
    var a1 = '', a2 = '', a3 = '';
    var tes = /^-/;
    var isCurrency = (typeof (isCurrency) != 'undefined') ? isCurrency : true;

    a = amtStr.replace(/,/g, "");
    a = a.replace(/[^-\.,0-9]/g, "");
    a = a.replace(/(^\s*)|(\s*$)/g, "");
    if (tes.test(a))
        a1 = '-';
    else
        a1 = '';
    a = a.replace(/-/g, "");
    if (a != "0" && a.substr(0, 2) != "0.")
        a = a.replace(/^0*/g, "");
    j = a.indexOf('.');
    if (j < 0)
        j = a.length;
    a2 = a.substr(0, j);
    a3 = a.substr(j);
    j = 0;
    for (i = a2.length; i > 3; i = i - 3) {
        renum = "," + a2.substr(i - 3, 3) + renum;
        j++;
    }

    renum = a1 + a2.substr(0, a2.length - j * 3) + renum + a3;

    return renum;
}

/**
 * format number of money.
 * >> (12000.235, 3)  * // TODO  有错误
 * => 12,000.24
 */
sun.util.formatFloat = function (amtStr, isCurrency) {
    var isInt = function (num) {
        return (num % 1 === 0);
    };
    var amtStr = (isInt(amtStr)) ? amtStr : Number(amtStr).toFixed(2);
    amtStr = "" + amtStr;
    var a, renum = '';
    var j = 0;
    var a1 = '', a2 = '', a3 = '';
    var tes = /^-/;
    var isCurrency = (typeof (isCurrency) != 'undefined') ? isCurrency : true;
    var subfix = (isInt(amtStr) && isCurrency) ? '.00' : '';
    a = amtStr.replace(/,/g, "");
    a = a.replace(/[^-\.,0-9]/g, "");
    a = a.replace(/(^\s*)|(\s*$)/g, "");
    if (tes.test(a))
        a1 = '-';
    else
        a1 = '';
    a = a.replace(/-/g, "");
    if (a != "0" && a.substr(0, 2) != "0.")
        a = a.replace(/^0*/g, "");
    j = a.indexOf('.');
    if (j < 0)
        j = a.length;
    a2 = a.substr(0, j);
    a3 = a.substr(j);
    j = 0;
    for (i = a2.length; i > 3; i = i - 3) {
        renum = "," + a2.substr(i - 3, 3) + renum;
        j++;
    }

    renum = a1 + a2.substr(0, a2.length - j * 3) + renum + a3 + subfix;

    return renum;
}

/**
 * >> (4)
 * => true
 * >> (3)
 * => false
 */
sun.util.isEven = function(num) {
    return num % 2 == 0 ? true : false;
};

/**
 * >> ([])
 * => true
 * >> ({})
 * => false
 */
sun.util.isArray = function(arg) {
    // first way:
    return Object.prototype.toString.call(arg) === '[object Array]';

    // second way:
    //return (arr instanceof Array);
};

/**
 * >> ()
 * => "2013-12-04 10:49:25"
 * >> ('hh:mm:ss yy/MM/dd');
 * => "10:51:19 13/12/04"
 */
sun.util.getCurrentTime = function(sStyle) {
    return this.formatTime(sStyle, null);
};

/**
 * >> ('yy-MM-dd hh:mm')
 * => "2013-12-04 10:49:25"
 * >> ('yy-MM-dd hh:mm', '2013-12-23 18:33:22')
 * => 13-12-23 18:33
 */
sun.util.formatTime = function (format, sTime) {
    var _this = new Date();

    if (!!sTime) {
        if (typeof sTime === 'string') {
            sTime = this.replaceAll(sTime, '-', '/');  // IOS 7.1不支持 2012-12-11 00:00:00 这种格式的 new Date()方法
        }
        _this = new Date(sTime);
    }

    var o = {
        "M+": _this.getMonth() + 1, //month
        "d+": _this.getDate(), //day
        "h+": _this.getHours(), //hour
        "m+": _this.getMinutes(), //minute
        "s+": _this.getSeconds(), //second
        "q+": Math.floor((_this.getMonth() + 3) / 3), //quarter
        "S": _this.getMilliseconds() //millisecond
    };

    if(!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }

    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

/**
 * 
 * >> ('&lt;span&gt;I am Hero!&lt;/span&gt;')
 * => '<span>I am Hero!</span>'
 */
sun.util.htmlDecode = function(html) {
    var a = document.createElement( 'a' ); a.innerHTML = html;
    return a.textContent;
};

/**
 * 
 * >> ('<span>I am Hero!</span>')
 * => '&lt;span&gt;I am Hero!&lt;/span&gt;'
 */
sun.util.htmlEncode = function ( html ) {
    return document.createElement( 'a' ).appendChild( 
        document.createTextNode( html ) ).parentNode.innerHTML;
};

/**
 * >> ("3333", 33)
 * => 333
 */
sun.util.parseToInt = function(obj, defaultNum, radix){
    var _t = 0;
    if (typeof radix != 'number'){
        radix = 10;
    }

    _t = parseInt(obj, radix);

    if (!_t){
        _t = defaultNum;
    }
    return _t;
};

/**
 * >> ('I am a boy', 'boy', 'girl')
 * => "I am a girl" 
 */
sun.util.replaceAll = function (oString, AFindText, ARepText) {
    var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
    return oString.replace(raRegExp, ARepText);
};

/**
 * >> ('best {0} for {1}', 'wish', 'you')
 * => "best wish for you"
 */
sun.util.stringFormat = function(txt) {
    var arg = arguments,
        matchResult,
        matLength,
        str = txt,
        reg = /\{\d+?\}/gmi,
        i;

    matchResult = str.match(reg);
    if (matchResult) {
        matLength = matchResult.length;
        if (arg.length >= matLength) {
            for (i = 0; i < matLength; i++) {
                str = str.replace(matchResult[i], arg[i + 1]);
            }
        }
    }

    return str;
};

/**
 * >> (12341234)
 * => "Thur Jan 1 1970 11:25"
 */
sun.util.transforTime = function (time) {
    var date = parseInt(time);
    var weekdays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var result = "";
    result += weekdays[new Date(date).getDay()];
    result += " ";
    result += months[new Date(date).getMonth()];
    result += " ";
    result += new Date(date).getDate();
    result += " ";
    result += new Date(date).getFullYear();
    result += " ";
    result += new Date(date).getHours();
    result += ":";
    result += new Date(date).getMinutes();
    return result;
};
