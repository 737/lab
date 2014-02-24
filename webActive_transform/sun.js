
var sun = sun || {};

/**
 * it is for alex to shortcut method
 * delete before online
 */
(function shortCut() {
    tojs = function(vmodel) {
        return ko.mapping.toJS(vmodel)
    };
    log = function (){
        console.log(arguments)
    };
    write = function(txt){
        var p = document.createElement('p');
        var hr = document.createElement('hr');

        p.innerHTML = txt;
        document.body.appendChild(hr);
        document.body.appendChild(p);
    };
    
})()

sun.ajax = function() {
    var mime = {
        html: 'html',
        js: 'script',
        json: 'json',
        xml: 'xml',
        txt: 'text'
    }

    var _stringifyData = function(sType, oData) {
        var _data = oData;

        if ((sType.toUpperCase() === 'POST') && ( !! oData)) {
            _data = JSON.stringify(oData);
        }

        return _data;
    };

    base = function(sUrl, sType, sDataType, oData, fnCallBack, isShlowLoading, isAsync) {
        var _data = oData,
            _isAsync = typeof isAsync === 'boolean' ? isAsync : true;

        if (sUrl.indexOf('?') === -1){
            sUrl = sUrl + '?t=' + Math.random();
        }else {
            sUrl = sUrl + '&t=' + Math.random();
        }

        $.ajax({
            async: _isAsync,
            type: sType,
            url: sUrl,
            data: _stringifyData(sType, oData),
            contentType: 'application/json',
            dataType: sDataType,
            beforeSend: function(XMLHttpRequest) {
                if (!!isShlowLoading) {
                    
                }
            },
            success: function(data, textStatus) {
                if (!!isShlowLoading) {
                    
                }
                if(!_isAsync && (typeof fnCallBack === 'function')){
                    fnCallBack(data, textStatus);
                };
                _data = data;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (!!isShlowLoading) {
                    
                }
                
                _data = errorThrown;
            }
        }).done(function(data, textStatus, _self) {
            if (!!isShlowLoading) {
                    
            }

            if (!!_isAsync && (typeof fnCallBack === 'function')) {
                fnCallBack(data, textStatus);
            }
        });;

        return _data;
    };

    return {
        post: function(sPageUrl, oData, fnCallBack, isAsync) {
            if ((typeof oData === 'function') && (!fnCallBack)) {
                fnCallBack = oData;
                oData = null;
            }

            return base(sPageUrl, 'POST', mime.json, oData, fnCallBack, false, isAsync);
        },
        getJSON: function(sPageUrl, oData, fnCallBack, isAsync) {
            if ((typeof oData === 'function') && (!fnCallBack)) {
                fnCallBack = oData;
                oData = null;
            }

            return base(sPageUrl, 'get', mime.json, oData, fnCallBack, false, isAsync);
        }
    }
}();

sun.$ = function(query) {
    return document.querySelectorAll(query);
};


// var __readyFuns = [];   
// function DOMReady(){   
//     for(var i=0,l=readyFuns.length;i&lt;l;i++){   
//       readyFun();   
//     }   
//     readyFuns = null;   
//     document.removeEventListener('DOMContentLoaded',DOMReady,false);   
// };
// sun.ready = function(fn){
//     if(readyFuns.length == 0){   
//        document.addEventListener('DOMContentLoaded',DOMReady,false);   
//     }   
//     readyFuns.push(fn);   
// }  


sun.context = sun.context || {};

sun.context.getQueryStringByName = function(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));

    if (result == null || result.length < 1) {
        return "";
    }

    return result[1];
};

sun.context.cookie = sun.context.cookie || {};
// article detail http://www.cnblogs.com/Darren_code/archive/2011/11/24/Cookie.html
sun.context.cookie.setExpires = function (name,value,expiresValue){
    var Days = expiresValue; 
    var exp  = new Date();    //new Date("December 31, 9998");
    
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};
sun.context.cookie.set = function (name,value){
    var Days = 30; //此 cookie 将被保存 30 天
    
    this.setExpires(name, value, Days);
};
sun.context.cookie.get = function (name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));

    if(arr != null) {
        return unescape(arr[2]);
    }
    return null;
};
sun.context.cookie.del = function (name){
    var exp = new Date();
    var cval= this.get(name);

    exp.setTime(exp.getTime() - 1);
    if(cval!=null) {
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
};

sun.context.localStorage = sun.context.localStorage || {};
sun.context.localStorage._ls = window.localStorage;
sun.context.localStorage.set = function(name, value) {
    this._ls.setItem(name,value.toString())
};
sun.context.localStorage.get  = function() {
    return this._ls.getItem(name);
};
sun.context.localStorage.del = function(name) {
    var val = this.get(name);

    if (!!val) {
        this.__ls.removeItem("c");
    }
};
sun.context.localStorage.clearAll = function() {
    window.localStorage.clear()
};

//-----------------------------  undealed  -----------------------------------
function addEvent (type, element, fun) {
    if (element.addEventListener) {
        addEvent = function (type, element, fun) {
            element.addEventListener(type, fun, false);
        }
    }
    else if(element.attachEvent){
        addEvent = function (type, element, fun) {
            element.attachEvent('on' + type, fun);
        }
    }
    else{
        addEvent = function (type, element, fun) {
            element['on' + type] = fun;
        }
    }
    return addEvent(type, element, fun);
}


sun.util = sun.util || {};

sun.util.array = sun.util.array || {};

/**
 * @param => ([1,2,32,4])
 * return [1, 2, 4, 32]
 *
 * @param => ([1,2,32,4], false)
 * return [32, 4, 2, 1]
 * 
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
 * @param => ([0,1,2,3,4,5,6,7,8,9], 6)
 * return [0, 1, 2, 3, 4, 5, 7, 8, 9]
 * 
 * @param => ([0,1,2,3,4,5,6,7,8,9], [2,6,8])
 * return [0, 1, 3, 4, 5, 7, 9]
 * 
 */
sun.util.array.remove = function(arrayList, n) {
    //prototype为对象原型，注意这里为对象增加自定义方法的方法。
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
        /*
          concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
                      这里就是返回arrayList.slice(0,n)/arrayList.slice(n+1,arrayList.length)
                     组成的新数组，这中间，刚好少了第n项。
          slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
        */
};


/**
 * format number
 * e.g. 12000 => 1,2000
 * @param amtStr number
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
 * e.g. 12000.235 => 12,000.24
 * @param amtStr number
 * @return string
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

sun.util.isEven = function(num) {
    return num % 2 == 0 ? true : false;
};

/**
 * @param => ([])
 * return true
 *
 * * @param => ({})
 * return false
 * 
 */
sun.util.isArray = function(arg) {
    // first way:
    return Object.prototype.toString.call(arg) === '[object Array]';

    // second way:
    //return (arr instanceof Array);
};

/**
 * 
 * eg. format = 'yyyy-MM-dd hh:mm:ss'
 * 
 */
sun.util.getCurrentTime = function(format) {
    var _this = new Date();
    var o = {
        "M+": _this.getMonth() + 1, //month
        "d+": _this.getDate(), //day
        "h+": _this.getHours(), //hour
        "m+": _this.getMinutes(), //minute
        "s+": _this.getSeconds(), //second
        "q+": Math.floor((_this.getMonth() + 3) / 3), //quarter
        "S": _this.getMilliseconds() //millisecond
    }

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
 * @param  '&lt;span&gt;I am Hero!&lt;/span&gt;'
 * @return '<span>I am Hero!</span>'
 */
sun.util.htmlDecode = function(html) {
    var a = document.createElement( 'a' ); a.innerHTML = html;
    return a.textContent;
};
/**
 * 
 * @param  '<span>I am Hero!</span>'
 * @return '&lt;span&gt;I am Hero!&lt;/span&gt;'
 */
sun.util.htmlEncode = function ( html ) {
    return document.createElement( 'a' ).appendChild( 
        document.createTextNode( html ) ).parentNode.innerHTML;
};

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
 * @param => ('I am a boy', 'boy', 'girl')
 * return 'I am a girl'
 * enhance replace
 * @param oString string
 * @param AFindText string
 * @param ARepText string
 * @return string
 */
sun.util.replaceAll = function (oString, AFindText, ARepText) {
    var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
    return oString.replace(raRegExp, ARepText);
};

/**
 * @param => ('best {0} for {1}', 'wish', 'you')
 * return 'best wish for you'
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


