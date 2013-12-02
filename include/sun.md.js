
sun = sun || {};

sun.md = (function(global){
    var self,
        _userAgent = navigator.userAgent,
        _rWins = /Windows/i,
        _rWP = /IEMobile/i,
        _rAndroid = /Android/i,
        _rIPhone = /iPhone/i;

    androidScreenPixelRatio = {
        pr : null,
        screenHeight : null,
        getScreenHeight : function() {
            var that = this;
            if (null == that.screenHeight) {
                that.screenHeight = (screen.width < screen.height) ? screen.height : screen.width;
            }
            return that.screenHeight;
        },
        getDpi : function() {
            var that = this, dpi = 320;
            if (1200 <= that.getScreenHeight()) {
                dpi = "device-dpi";
            }
            return dpi;
        },
        getPixelRatio : function() {
            var that = this;
            if (null == that.pr) {
                that.pr = window.devicePixelRatio;
            }
            return that.pr;
        },
        judgePixelRatio : function(pr) {
            var that = this;
            return (pr === that.getPixelRatio());
        },
        isLdpi : function() {
            var that = this;
            return that.judgePixelRatio(0.75);
        },
        isMdpi : function() {
            var that = this;
            return that.judgePixelRatio(1);
        },
        isHdpi : function() {
            var that = this;
            return that.judgePixelRatio(1.5);
        }
    };

    BOMHeight = function() {
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

    _parseViewPortContent = function(initWidth, initHeight, isUserScale, initScale, minScale, maxScale, isIntelligence) {
        var w = !!initWidth ? initWidth : "device-width",
            h = !!initHeight ? initHeight : BOMHeight(),
            isUserScale = !!isUserScale ? 1 : 0,
            initScale = !!initScale ? initScale : null,     //最大极限是 1.69
            minScale = !!minScale ? minScale : 0.1,
            maxScale = !!maxScale ? maxScale : 10,
            domeMeta = '',
            targetDensitydpi = 'device-dpi',      // [dpi_value(70 - 400) | device-dpi | high-dpi | medium-dpi | low-dpi]
            clientW = document.documentElement.clientWidth,
            screenW = window.screen.width;

        if ((w === -1)||(w === '100%')) {
            w = "device-width";
            initScale = 1;
            targetDensitydpi = 'device-dpi';

            if (!!isIntelligence) {
                initScale = (screenW/clientW).toFixed(4);

                if(self.isAndroid()) {
                    targetDensitydpi = 'device-dpi';
                }
            }
        } else if ((typeof w === 'number')&&(!initScale)) {
            if (!!isIntelligence) {
                w = Math.max(w, screenW);
            }

            initScale = (screenW/w).toFixed(4);
            
            if(self.isAndroid()) {
                initScale = 1;
                targetDensitydpi = (w/2.25714).toFixed(4);
                if (targetDensitydpi < 70) {
                    targetDensitydpi = 70;
                }
                if (targetDensitydpi > 400) {
                    targetDensitydpi = 400;
                }
            }
        }

        domeMeta = 
            'width=' + w + 
            ', height=' + h + 
            ', minimum-scale=' + minScale + 
            ', maximum-scale=' + maxScale + 
            ', initial-scale=' + initScale + 
            ', user-scalable=' + isUserScale +
            ', target-densitydpi=' + targetDensitydpi;

        return domeMeta.trim();
    };

    _getScreen =  function(){
        // detail information to  http://www.cnblogs.com/tearer/archive/2010/09/06/1819471.html
        // window.devicePixelRatio = 物理像素 / dips
        // window.screen.width = Android设备返回的是物理像素宽，IOS =》 dips宽

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
            s += " 物理像素/独立像素比: " +         window.devicePixelRatio + " 像素/英寸" + "\n";
            s += " 你的屏幕设置 " +        window.screen.deviceXDPI + " 像素/英寸" + "\n";
        
        return s;
    };

    self = {};

    self.userAgent = _userAgent;

    self.screen = _getScreen();

    self.getViewPortContent = function() {
        var domeMeta = document.getElementsByName('viewport')[0];

        return domeMeta.content;
    };

    // var options = {
    //     initWidth: null, 
    //     initHeight: null, 
    //     isUserScale: null, 
    //     initScale: null, 
    //     minScale: null, 
    //     maxScale: null,
    //     isIntelligence: bool    /default null
    // }
    // default options likes: { initWidth : '100%' } or { initWidth : 540 }
    self.setViewPortContent = function (options) {
        var DOM_meta = document.getElementsByName('viewport')[0],
            _content = '';

        if (!DOM_meta) {
            DOM_meta = document.createElement('meta');
            DOM_meta.name = 'viewport';
            document.head.appendChild(DOM_meta);
        }

        if (typeof options === 'string'){
            _content = _content;
        } else if (typeof options === 'object') {
            _content = _parseViewPortContent(options.initWidth, 
                options.initHeight, 
                options.isUserScale, 
                options.initScale, 
                options.minScale, 
                options.maxScale,
                options.isIntelligence);
        } else {
            _content = _parseViewPortContent();
        }

        DOM_meta.content = _content;
    };

    self.isAndroid = function () {
        var me = this,
            result = false;

        if((_userAgent.match(_rAndroid))&& (_userAgent.match(_rAndroid).length > 0)) {
            result = true;
        }
        return result;
    };

    self.isWindows = function () {
        var me = this,
            result = false;

        if((_userAgent.match(_rWins)) && (_userAgent.match(_rWins).length > 0)) {
            result = true;
        }
        return result;
    };

    self.isWinPhone = function () {
        var me = this,
            result = false;

        if((_userAgent.match(_rWP)) && (_userAgent.match(_rWP).length > 0)) {
            result = true;
        }
        return result;
    };

    self.isIOS = function () {
        var me = this,
            result = false;

        if((_userAgent.match(_rIPhone))&& (_userAgent.match(_rIPhone).length > 0)) {
            result = true;
        }
        return result;
    };

    return self;
})(this);