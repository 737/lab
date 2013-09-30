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

