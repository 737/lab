/*!
 * sun mobile equipment - v1.0.0 - 2013-09-25
 * https://sun.com
 * Copyright 2005, 2013 Sun Foundation, Inc. and other contributors; Licensed MIT
 */
var sun = sun || {};

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
sun.md._parseViewPortContent = function(initWidth, initHeight, isUserScale, initScale, minScale, maxScale) {
    var w = !!initWidth ? initWidth : "device-width",
        h = !!initHeight ? initHeight : BOMHeight(),
        isUserScale = !!isUserScale ? 1 : 0,
        initScale = !!initScale ? initScale : null,
        minScale = !!minScale ? minScale : 0.1,
        maxScale = !!maxScale ? maxScale : 10,
        deviceType = sun.md.deviceInfo,
        domeMeta = '';
    
    if(deviceType.isAndroid()) {
        if (typeof w === 'number') {
            if (!initScale) {
                initScale = (window.screen.width/w).toFixed(2);
            }
        } else {
            initScale = 1;
        }

        domeMeta = 
            'width=' + w + 
            ', height=' + h + 
            ', minimum-scale=' + minScale + 
            ', maximum-scale=' + maxScale + 
            ', initial-scale=' + initScale + 
            ', user-scalable=' + isUserScale + 
            ', target-densitydpi=' + androidScreenPixelRatio.getDpi();
    }
    else if(deviceType.isIOS()) {
        if (typeof w === 'number') {
            if (!initScale) {
                initScale = (window.screen.width/w).toFixed(2);
            }
        } else {
            initScale = 1;
        }

        domeMeta = 
            'width=' + w + 
            ', height=' + h + 
            ', minimum-scale=' + minScale + 
            ', maximum-scale=' + maxScale + 
            ', initial-scale=' + initScale + 
            ', user-scalable=' + isUserScale + 
            ', target-densitydpi=device-dpi';
    }
    else if (deviceType.isWinPhone() || deviceType.isWindows()) {
        domeMeta = 'width=640, user-scalable=0, minimum-scale=1, maximum-scale=1, initial-scale=1';
    }

    return domeMeta.trim();
};

// var options = {
//     initWidth: null, 
//     initHeight: null, 
//     isUserScale: null, 
//     initScale: null, 
//     minScale: null, 
//     maxScale: null
// }
sun.md.setViewPortContent = function (options) {
    var DOM_meta = document.getElementsByName('viewport')[0],
        _content = '';

    if (!!DOM_meta) {
        DOM_meta.name = 'viewport';
        document.body.appendChild(DOM_meta);
    }

    if (typeof options === 'string'){
        _content = _content;
    } else if (typeof options === 'object') {
        _content = sun.md._parseViewPortContent(options.initWidth, options.initHeight, options.isUserScale, options.initScale, options.minScale, options.maxScale)
    } else {
        _content = sun.md._parseViewPortContent();
    }

    DOM_meta.content = _content;
};
sun.md.getViewPortContent = function() {
    var domeMeta = document.getElementsByName('viewport')[0];

    return domeMeta.content;
};