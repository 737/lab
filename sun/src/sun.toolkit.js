// 依赖 sun.validate.js
// author:  arleigh.lee@qq.com
// date:    2014/01/01

var sun = sun || {};

sun.toolkit = {

    array: {
        // sun.toolkit.array.sort(arrayList, [bool])
        // >> ([1,2,32,4])
        // => [1, 2, 4, 32]
        // >> ([1,2,32,4], false)
        // => [32, 4, 2, 1]
        sort: function(arrayList, isAsc) {
            if (typeof isAsc != 'boolean') {
                isAsc = true;
            }

            function sortNumber(a, b)
            {
                if (!!isAsc) {
                    return a - b;
                } else {
                    return b - a;
                }
            }

            return arrayList.sort(sortNumber);
        },

        // sun.toolkit.array.removeAt(arrayList, *numIndex)
        // >> ([0, 11,22,33,44], 3)
        // => [0, 11, 22, 44]
        // >> ([0, 11,22,33,44], [2, 1, 0])
        // => [33, 44]
        removeAt: function(arrayList, numIndex) {
            if ( numIndex < 0 || typeof numIndex === 'undefined') {
                return arrayList;
            } else if (sun.validate.isArray(numIndex)) {
                var _index = 0;

                numIndex = this.sort(numIndex, false);

                for(var index in numIndex) {
                    _index = index - 1;
                    arrayList = this.removeAt(arrayList, numIndex[index]);
                }

                return arrayList;
            } else {
                return arrayList.slice(0, numIndex).concat(arrayList.slice(numIndex + 1, arrayList.length));
            }
        }
    },

    /**
      * 深度克隆
      * => { name : 'sun' }
      * => { name : 'sun' }
      */
    deepClone: function (jsonObj) {
        var buf;

        if (jsonObj instanceof Array) {
            var i = jsonObj.length;

            buf = [];
            while (i--) {
                buf[i] = this.deepClone(jsonObj[i]);
            }

            return buf;
        } else if (jsonObj instanceof Object) {
            buf = {};

            for (var k in jsonObj) {
                buf[k] = this.deepClone(jsonObj[k]);
            }

            return buf;
        } else {
            return jsonObj;
        }
    },

    // sun.toolkit.extend(destination, *sources)
    // => sun.toolkit.extend({a: 'a1', c: 1},{ b : 'b'}, { b: 'b1', c: 2})
    // => {a: "a1", c: 2, b: "b1"}
    extend: function(obj) {
        this.each(arguments, function(source, index) {
            if ((index !== 0)&&(!!source)) {
                for(var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });

        return obj;
    },

    /**
     * >> ([3,2], function (v, i) { console.log(v, i) })
     * => 3 0
     * => 2 1
     * >> ({ a : 'aa' , b : 'b2' }, function (v, i) { console.log(v, i) })
     * => aa a
     * => b2 b
     */
    each: function(obj, iterator) {
        if ( obj === null) return;
        if (typeof iterator === 'function') {
            if (sun.validate.isArray(obj)) {
                for(var i = 0, max = obj.length; i < max; i++ ) {
                    iterator(obj[i], i);
                }
            } else if ( typeof obj === 'object') {
                for(var item in obj ) {
                    iterator(obj[item], item);
                }
            }

        }
    },

    /**
     * format number
     * e.g. 12000 => 1,2000
     * >> amtStr number
     * @return string
     */
    formatIntNum: function (amtStr) {
        var isInt = function (num) {
            return (num % 1 === 0);
        };

        amtStr = (isInt(amtStr)) ? amtStr : Number(amtStr).toFixed(0);
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
    },

    /**
     * format number of money.
     * >> (12000.235, 3)  * // TODO  有错误
     * => 12,000.24
     */
    formatFloat: function (amtStr, isCurrency) {
        var isInt = function (num) {
            return (num % 1 === 0);
        };
        amtStr = (isInt(amtStr)) ? amtStr : Number(amtStr).toFixed(2);
        amtStr = "" + amtStr;
        var a, renum = '';
        var j = 0;
        var a1 = '', a2 = '', a3 = '';
        var tes = /^-/;

        isCurrency = (typeof (isCurrency) != 'undefined') ? isCurrency : true;
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
    },

    /**
     * >> ('yy-MM-dd hh:mm:ss')
     * => "2013-12-04 10:49:25"
     * >> ('yy-MM-dd hh:mm', '2013-12-23 18:33:22')
     * => "13-12-23 18:33"
     * >> ('M-d', '2014-03-10')
     * => "3-10"
     * 注意M需要大写，其它字母小写
     */
    formatTime: function (format, sTime) {
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
    },

    /**
     * >> ()
     * => "2013-12-04 10:49:25"
     * >> ('hh:mm:ss yy/MM/dd');
     * => "10:51:19 13/12/04"
     */
    getCurrentTime: function(sStyle) {
        return this.formatTime(sStyle, null);
    },

    // 获取当前点击事件的Object对象
    getEvent: function() {
        if (document.all) {
            return window.event; //如果是ie
        }
        func = getEvent.caller;
        while (func !== null) {
            var arg0 = func.arguments[0];
            if (arg0) {
                if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                    return arg0;
                }
            }
            func = func.caller;
        }
        return null;
    },

    // 获得当前浏览器JS的版本
    getJavascriptVersion: function getjsversion(){
        var n = navigator;
        var u = n.userAgent;
        var apn = n.appName;
        var v = n.appVersion;
        var ie = v.indexOf('MSIE ');
        if (ie > 0){
           apv = parseInt(i = v.substring(ie + 5));
           if (apv > 3) {
               apv = parseFloat(i);
           }
        } else {
           apv = parseFloat(v);
        }
        var isie = (apn == 'Microsoft Internet Explorer');
        var ismac = (u.indexOf('Mac') >= 0);
        var javascriptVersion = "1.0";
        if (String && String.prototype) {
           javascriptVersion = '1.1';
           if (javascriptVersion.match) {
               javascriptVersion = '1.2';
               var tm = new Date();
               if (tm.setUTCDate) {
                   javascriptVersion = '1.3';
                   if (isie && ismac && apv >= 5) javascriptVersion = '1.4';
                   var pn = 0;
                   if (pn.toPrecision) {
                       javascriptVersion = '1.5';
                       a = [];
                       if (a.forEach) {
                           javascriptVersion = '1.6';
                           i = 0;
                           o = {};
                           // tcf = new Function('o', 'var e,i=0;try{i=new Iterator(o)}catch(e){}return i');
                           tcf = function (o) {
                               var e, i=0;

                               try {
                                   i = new Iterator(o);
                               } catch(err) {

                               }

                               return i;
                           };
                           i = tcf(o);
                           if (i && i.next) {
                               javascriptVersion = '1.7';
                           }
                       }
                   }
               }
           }
        }
        return javascriptVersion;
    },

    /**
     *
     * >> ('&lt;span&gt;I am Hero!&lt;/span&gt;')
     * => '<span>I am Hero!</span>'
     */
    htmlDecode: function(html) {
        var a = document.createElement( 'a' ); a.innerHTML = html;
        return a.textContent;
    },

    /**
     *
     * >> ('<span>I am Hero!</span>')
     * => '&lt;span&gt;I am Hero!&lt;/span&gt;'
     */
    htmlEncode: function ( html ) {
        return document.createElement( 'a' ).appendChild(
            document.createTextNode( html ) ).parentNode.innerHTML;
    },

    // 用于hybird中log显示
    hybirdLog: function() {
        var _arg = _.extend([], arguments);

        _arg.unshift('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\////////////////////////////\r\n\r\n\r\n');
        _arg.push('\r\n\r\n\r\n////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\');

        console.log.call(console, _arg);
    },

    /**
     * >> ("3333", 33)
     * => 333
     */
    parseToInt: function(obj, defaultNum, radix){
        var _t = 0;
        if (typeof radix != 'number'){
            radix = 10;
        }

        _t = parseInt(obj, radix);

        if (!_t){
            _t = defaultNum;
        }
        return _t;
    },

    // 替换对应的字符窜
    // >> ('I am a boy', 'boy', 'girl')
    // => "I am a girl"
    replaceAll: function (oString, AFindText, ARepText) {
        var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
        return oString.replace(raRegExp, ARepText);
    },

    reload: function() {
        window.location.reload();

        /* other ways
            1 history.go(0)
            2 location.reload()
            3 location=location
            4 location.assign(location)
            5 document.execCommand('Refresh')
            6 window.navigate(location)
            7 location.replace(location)
            8 document.URL=location.href
        */
    },

    // sun.util.stringFormat(string, augments)
    // >> sun.toolkit.stringFormat('{2} {0} {1}, and best {0} for {1}', 'wish', 'you', 'I')
    // => "I wish you, and best wish for you."
    stringFormat: function(txt) {
        var reg = new RegExp(/\{(\d+?)\}/i);
        var match = null;
        var idx = 0,
            val = null;

        while ((match = reg.exec(txt)) !== null) {
            idx = (match[1] | 0) + 1;
            val = (typeof arguments[idx] !== 'undefined') ? arguments[idx] : '';

            txt = txt.replace(match[0], val);
        }

        return txt;
    },

    // 将数值转为对应日期
    // >> (12341234)
    // => "Thur Jan 1 1970 11:25"
    transforTime: function (time) {
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
    },

    parseURL: function (url) {
        var a =  document.createElement('a');
        a.href = url;

        return {
            source: url,
            protocol: a.protocol.replace(':',''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function(){
                var ret = {},
                    seg = a.search.replace(/^\?/,'').split('&'),
                    len = seg.length, i = 0, s;
                for (;i<len;i++) {
                    if (!seg[i]) { continue; }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
            hash: a.hash.replace('#',''),
            path: a.pathname.replace(/^([^\/])/,'/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
            segments: a.pathname.replace(/^\//,'').split('/')
        };
    }
};

if (typeof require === 'function') {
    define([sun._getPath('sun.validate.js')], function(validate) {
        return sun.toolkit;
    });
}








