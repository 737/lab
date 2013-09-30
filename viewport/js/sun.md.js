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
var BOMWidth = function() {
    var pageHWidth = window.innerWidth;
    if(typeof pageHWidth != "number"){
        if(document.compatMode == "CSS1Compat"){
            pageHWidth = document.documentElement.clientWidth;
        }else{
            pageHWidth = document.body.clientWidth;
        }
    }
    return pageHWidth;
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
            
            var s = "网页可见区域宽_clientWidth：" +       document.body.clientWidth + "\n";
                s += " 网页可见区域高_clientHeight：" +     document.body.clientHeight + "\n";
                s += " 网页可见区域宽_offsetWidth：" +     document.body.offsetWidth + " (包括边线和滚动条的宽)" + "\n";
                s += " 网页可见区域高_offsetHeight：" +     document.body.offsetHeight + " (包括边线的宽)" + "\n";
                s += " 网页正文全文宽_scrollWidth：" +     document.body.scrollWidth + "\n";
                s += " 网页正文全文高_scrollHeight：" +     document.body.scrollHeight + "\n";
                s += " 网页被卷去的高(ff)_scrollTop：" + document.body.scrollTop + "\n";
                s += " 网页被卷去的高(ie)_scrollTop：" + document.documentElement.scrollTop + "\n";
                s += " 网页被卷去的左_scrollLeft：" +     document.body.scrollLeft + "\n";
                s += " 网页正文部分上_screenTop：" +     window.screenTop + "\n";
                s += " 网页正文部分左_screenLeft：" +     window.screenLeft + "\n";
                s += " 屏幕分辨率的高_height：" +     window.screen.height + "\n";
                s += " 屏幕分辨率的宽_width：" +     window.screen.width + "\n";
                s += " 屏幕可用工作区高度_availHeight：" + window.screen.availHeight + "\n";
                s += " 屏幕可用工作区宽度_availWidth：" + window.screen.availWidth + "\n";
                s += " 你的屏幕设置是_colorDepth:" +      window.screen.colorDepth + " 位彩色" + "\n";
                s += " 你的屏幕设置_deviceXDPI:" +        window.screen.deviceXDPI + " 像素/英寸" + "\n";
                s += " BOMWidth:" + BOMWidth() + "\n";
                s += " BOMHieght:" + BOMHeight() + "\n";

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
sun.md.parseViewPortContent = function(initWidth, initHeight, isUserScale, initScale, minScale, maxScale) {
    var w = !!initWidth ? initWidth : "device-width",
        h = !!initHeight ? initHeight : BOMHeight(),
        isUserScale = !!isUserScale ? 1 : 0,
        initScale = !!initScale ? initScale : null,
        minScale = !!minScale ? minScale : 0.1,
        maxScale = !!maxScale ? maxScale : 10,
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
    var domeMeta = document.getElementsByName('viewport'),
        _content = '';

    if (typeof options === 'string'){
        _content = _content;
    } else if (typeof options === 'object') {
        _content = sun.md.parseViewPortContent(options.initWidth, options.initHeight, options.isUserScale, options.initScale, options.minScale, options.maxScale)
    } else {
        _content = sun.md.parseViewPortContent();
    }

    if (domeMeta.length < 0 ) {
        
    } else {
        domeMeta[0].content = _content;
    }
};

sun.md.getViewPortContent = function() {
    return document.getElementsByName('viewport')[0].content||'no tag exist';
};

