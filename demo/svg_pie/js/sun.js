
var sun = sun || {};

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

sun.md = sun.md || {};

var BOMHeight = function() {
    var pageHeight = window.innerHeight;
    if(typeof pageHeight != "number"){
        if(document.compatMode == "CSS1Compat"){
            pageHeight = document.documentElement.clientHeight;
        }else{
            pageHeight = document.body.clientHeight;
        }
    }
    return pageHeight;
};

sun.md.deviceInfo = function(){
    var _userAgent = navigator.userAgent,
        _rWins = /Windows/i,
        _rWP = /IEMobile/i,
        _rAndroid = /Android/i,
        _rIPhone = /iPhone/i;

    return {
        userAgent : _userAgent,
        screen: function(){
            // detail information to  http://www.cnblogs.com/tearer/archive/2010/09/06/1819471.html
            
            var s = "网页可见区域宽：" +       document.body.clientWidth + "\n";
                s += " 网页可见区域高：" +     document.body.clientHeight + "\n";
                s += " 网页可见区域宽：" +     document.body.offsetWidth + " (包括边线和滚动条的宽)" + "\n";
                s += " 网页可见区域高：" +     document.body.offsetHeight + " (包括边线的宽)" + "\n";
                s += " 网页正文全文宽：" +     document.body.scrollWidth + "\n";
                s += " 网页正文全文高：" +     document.body.scrollHeight + "\n";
                s += " 网页被卷去的高(ff)：" + document.body.scrollTop + "\n";
                s += " 网页被卷去的高(ie)：" + document.documentElement.scrollTop + "\n";
                s += " 网页被卷去的左：" +     document.body.scrollLeft + "\n";
                s += " 网页正文部分上：" +     window.screenTop + "\n";
                s += " 网页正文部分左：" +     window.screenLeft + "\n";
                s += " 屏幕分辨率的高：" +     window.screen.height + "\n";
                s += " 屏幕分辨率的宽：" +     window.screen.width + "\n";
                s += " 屏幕可用工作区高度：" + window.screen.availHeight + "\n";
                s += " 屏幕可用工作区宽度：" + window.screen.availWidth + "\n";
                s += " 你的屏幕设置是 " +      window.screen.colorDepth + " 位彩色" + "\n";
                s += " 你的屏幕设置 " +        window.screen.deviceXDPI + " 像素/英寸" + "\n";
            
            return s;
        },
        isAndroid : function () {
            var me = this,
                result = false;

            if((_userAgent.match(_rAndroid))&& (_userAgent.match(_rAndroid).length > 0)) {
                result = true;
            }
            return result;
        },
        isWindows : function () {
            var me = this,
                result = false;

            if((_userAgent.match(_rWins)) && (_userAgent.match(_rWins).length > 0)) {
                result = true;
            }
            return result;
        },
        isWinPhone : function () {
            var me = this,
                result = false;

            if((_userAgent.match(_rWP)) && (_userAgent.match(_rWP).length > 0)) {
                result = true;
            }
            return result;
        },
        isIOS : function () {
            var me = this,
                result = false;

            if((_userAgent.match(_rIPhone))&& (_userAgent.match(_rIPhone).length > 0)) {
                result = true;
            }
            return result;
        }
    }
}();

// get the view port meta-content
sun.md.getViewPortContent = function(initWidth, initHeight) {
    var w = !!initWidth ? initWidth : "device-width",
        h = !!initHeight ? initHeight : BOMHeight(),
        deviceType = sun.md.deviceInfo,
        domeMeta = '';
    
    if(deviceType.isAndroid()) {
         if(androidScreenPixelRatio.isLdpi()) {
             w = w / 0.7;
         } else if(androidScreenPixelRatio.isHdpi()) {
             w = w / 1.5;
         }
        domeMeta = 'width=' + w + ', user-scalable=0, minimum-scale=1, maximum-scale=1, initial-scale=1, target-densitydpi=' + androidScreenPixelRatio.getDpi();
    }
    else if(deviceType.isIOS()) {
        if (typeof w === 'number') {
            domeMeta = 'width=' + w + ', height=' + h + ', minimum-scale=0.1, maximum-scale=2, initial-scale=' + (320/w).toFixed(2) + ', user-scalable=0, target-densitydpi=device-dpi';
        } else {
            domeMeta = 'width=' + w + ', height=' + h + ', minimum-scale=0.1, maximum-scale=2, initial-scale=0.5, user-scalable=0, target-densitydpi=device-dpi';
        }

        //alert(domeMeta);
    }
    else if (deviceType.isWinPhone() || deviceType.isWindows()) {
        domeMeta = 'width=640, user-scalable=0, minimum-scale=1, maximum-scale=1, initial-scale=1';
    }

    return domeMeta;
};


sun.util = sun.util || {};

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
