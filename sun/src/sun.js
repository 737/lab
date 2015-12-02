
var sun = sun || {};

sun.tag = {};

/**
 * Providing you to load Javascript, css files then execute your code.
 *
 * [depend on : jquery.each()]
 */
sun.load = function() {
    var self = {},
        __loadedUrls = {};

    function _poll(node, callback) {
        var isLoaded = false,
            reg = /webkit/i;

        if (reg.test(navigator.userAgent)) { //webkit
            if (node.sheet) {
                isLoaded = true;
            }
        } else if (node.sheet) { //FF
            try
            {
                if (node.sheet.cssRules) {
                    isLoaded = true;
                }
            } catch (ex) {
                if (ex.code === 1000) {
                    isLoaded = true;
                }
            }
        }

        if (isLoaded) {
            setTimeout(function() {
                callback();
            }, 1);
        } else {
            setTimeout(function() {
                _poll(node, callback);
            }, 1);
        }
    }

    function _styleOnload(node, callback) {
        if (node.attachEvent) {
            node.attachEvent('onload', callback);
        } else {
            setTimeout(function() {
                _poll(node, callback);
            }, 0);
        }
    }

    function _loadcss(url, callback){
        var node = document.createElement("link");

        node.setAttribute("rel","stylesheet");
        node.setAttribute("type","text/css");
        node.setAttribute('href', url);

        document.getElementsByTagName('head')[0].appendChild(node);

        _styleOnload(node, function(){
            _registerUrl(url);
            callback();
        });
    }

    function _isUrlLoaded(url) {
        return __loadedUrls[url] === true;
    }

    function _unregisterUrl(url) {
        __loadedUrls[url] = false;
    }

    function _registerUrl(url) {
        __loadedUrls[url] = true;
    }

    /**
     * >> sun.load.css(_url, function() {
     * >>     // do something
     * >> })
     * => undefined
     * => false  // is url is loaded
     */
    self.css = function(src, callback) {
        if (!_isUrlLoaded(src)) {
            _loadcss.apply(this, arguments);
        } else {
            if (typeof callback === 'function') {
                callback();
            }
            return false;
        }
    };
    /**
     * >> sun.load.js(_url, function() {
     * >>     // do something
     * >> })
     * => undefined
     * => false  // is url is loaded
     */
    self.js = function(src, callback) {
        if (!!_isUrlLoaded(src)) {
            if (typeof callback === 'function') {
                callback();
            }
            return false;
        }

        var script = document.createElement('script'),
            loaded;

        script.setAttribute('src', src);

        if (!!callback) {
            script.onreadystatechange = script.onload = function() {
                if (!loaded) {
                    _registerUrl(src);
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    };
    /**
     * >> sun.load.getUrlLoaded();
     * => { http://xx.xx/sun.js : true,
     * =>   http://xx.xx/sun.css: true }
     *
     * .tg true  => loaded
     *     false => removed
     */
    self.getUrlLoaded = function() {
        var links  = document.getElementsByTagName('link');

        for (var i = 0, max = links.length; i < max; i++) {
            if (!_isUrlLoaded(links[i].href)) {
                _registerUrl(links[i].href);
            }
        }

        return __loadedUrls;
    };

    return self;
}();

sun.ajax = function() {
    var mime = {
            html: 'html',
            js: 'script',
            json: 'json',
            xml: 'xml',
            txt: 'text'
        },
        __XMLHttpRequest;

    var _stringifyData = function(sType, oData) {
        var _data = oData;

        if ((sType.toUpperCase() === 'POST') && ( !! oData)) {
            _data = JSON.stringify(oData);
        }

        return _data;
    };

    var defaults = {
        replaceURL: false,
        target: "#loadingbar-frame",

        /* Deafult Ajax Parameters  */
        async: true,
        type: "",
        url: "",
        data: "",
        dataType: "",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        cache: true,
        global: true,
        headers: {},
        timeout: 60000,
        statusCode: {},
        beforeSend: function(XMLHttpRequest) {
            /* loading */
            if ((!!sun.loading)&&(!!sun.loading.config.isWorking)) {
                var _type = sun.loading.config.type;

                sun.loading[_type].start();
            }
        },
        success: function(data, textStatus, XMLHttpRequest) {},
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status !== 200) return;
            // => [Object, "parsererror", SyntaxError]
            var _txt = '---------------- sun.ajax error -------------------' +
                    '\n\rstatus ---> ' + textStatus +
                    '\n\rdetail ---> ' + errorThrown.message +
                    '\n\r       ---> ' + errorThrown.stack +
                    '\n\r---------------- /sun.ajax error -------------------';

            console.error(_txt);
        },
        complete: function(XMLHttpRequest, textStatus) {
            if (textStatus !== 'success') {
                var _txt = '---------------- sun.ajax complete -------------------' +
                    '\n\rstatus ---> ' + textStatus +
                    '\n\rdetail ---> ' + XMLHttpRequest.status + '  (' + XMLHttpRequest.statusText + ')' +
                    '\n\rXMLHttpRequest ---> ' + sun.ajax.lastXMLHttpRequest() +
                    '\n\r---------------- /sun.ajax complete -------------------';

                __XMLHttpRequest = XMLHttpRequest;

                console.error(_txt);
            }
        }
    };
    var base = function(settings) {
        var _data = null;

        /* restore default config */
        __XMLHttpRequest = null;

        if (settings.url.indexOf('?') === -1){
            settings.url = settings.url + '?t=' + Math.random();
        }else {
            settings.url = settings.url + '&t=' + Math.random();
        }

        $.ajax({
            type: settings.type,
            url: settings.url,
            data: settings.data,
            async: settings.async,
            cache: settings.cache,
            contentType: settings.contentType,
            global: settings.global,
            headers: settings.headers,
            statusCode: settings.statusCode,
            dataType : settings.dataType,
            timeout: settings.timeout,
            /* Deafult Ajax Event */
            beforeSend: settings.beforeSend,
            success: settings.success,        //请求成功后调用
            error: settings.error,
            complete: settings.complete,         //请求完成后调用
        }).always(function() {
            /* loading */
            if ((!!sun.loading)&&(!!sun.loading.config.isWorking)) {
                var _type = sun.loading.config.type;

                sun.loading[_type].end();
            }
        }).done(function(data, textStatus, XMLHttpRequest) {     //请求成功后调用(deferred对象的方法)
            if (typeof settings.done === 'function') {
                settings.done(data, textStatus, XMLHttpRequest);
            }
        });

        return _data;
    };
    var parseOptions = function(typeName, sUrl, sType, sDataType, oData, fnCallBack, isShlowLoading, isAsync) {
        var _setting = {};

        if (typeName === 'object'){
            _setting = $.extend({}, defaults, sUrl);

            if (!!sUrl.done && typeof sUrl.done === 'function') {
                _setting.done = sUrl.done;
            }
        } else {
            _setting.url = sUrl;
            _setting.type = sType;
            _setting.dataType = sDataType;
            _setting.data = oData;
            _setting.isShlowLoading = isShlowLoading;
            _setting.isAsync = isAsync;
            _setting.done = fnCallBack;

            _setting = $.extend({}, defaults, _setting);
        }

        return _setting;
    };

    return {
        // >> sun.ajax.post('url', function (json) {
        // >>     console.log(json);
        // >> });
        // => { "name" : "sun.js" }
        // ****** or this way : ******
        // >> sun.ajax.post({
        // >>   url : 'url',
        // >>   done : function (json) {
        // >>      console.log(json);
        // >>   }
        // >> });
        // => { "name" : "sun.js" }
        post: function(sPageUrl, oData, fnCallBack, isAsync) {
            if (typeof sPageUrl === 'object') {
                sPageUrl.type = 'POST';
                sPageUrl.dataType = mime.json;
                _options = parseOptions('object', sPageUrl);
            } else {
                if ((typeof oData === 'function') && (!fnCallBack)) {
                    fnCallBack = oData;
                    oData = null;
                }

                _options = parseOptions('!object', sPageUrl, 'POST', mime.json, oData, fnCallBack, false, isAsync);
            }

            return base(_options);
        },
        // >> sun.ajax.getJSON('url', function (json) {
        // >>     console.log(json);
        // >> });
        // => { "name" : "sun.js" }
        // ****** or this way : ******
        // >> sun.ajax.getJSON({
        // >>   url : 'url',
        // >>   done : function (json) {
        // >>      console.log(json);
        // >>   }
        // >> });
        // => { "name" : "sun.js" }
        getJSON: function(sPageUrl, oData, fnCallBack, isAsync) {
            if (typeof sPageUrl === 'object') {
                sPageUrl.type = 'get';
                sPageUrl.dataType = mime.json;
                _options = parseOptions('object', sPageUrl);
            } else {
                if ((typeof oData === 'function') && (!fnCallBack)) {
                    fnCallBack = oData;
                    oData = null;
                }

                _options = parseOptions('!object', sPageUrl, 'get', mime.json, oData, fnCallBack, false, isAsync);
            }

            return base(_options);
        },
        lastXMLHttpRequest: function() {
            return __XMLHttpRequest;
        }
    };
}();

sun.$ = function(query) {
    return document.querySelectorAll(query);
};

sun.key = (function() {
    var self = {},
        keys = {
            'Esc' : 27,
            'Enter' : 13
        },
        keysEvent  = {

        },
        lastKey = null;

    self.__init = function() {
        document.addEventListener('keyup', function(evt) {
            lastKey = evt;

            var keyEvt = keysEvent[evt.keyCode];
            if (!!keyEvt) {
                for(var i = 0, max = keyEvt.length; i < max; i ++) {
                    if (typeof keyEvt[i] === 'function') {
                        keyEvt[i]();
                    }
                }
            }
        });
    };

    //
    self.set = function(keyCode, fnCallBack) {
        if (typeof keyCode != 'number') {
            return 'the Parameters -> keycode is number';
        }
        if (typeof fnCallBack != 'function') {
            return 'the Parameters -> fnCallBack is function';
        }

        var evt = keysEvent[keyCode];
        if (!!evt) {
            evt.push(fnCallBack);
        } else {
            evt = [];

            evt.push(fnCallBack);

            keysEvent[keyCode] = evt;
        }
    };

    self.removeEvent = function(keyCode, fnCallBack) {
        if ((keysEvent[keyCode].length > 0)&&(keysEvent[keyCode].indexOf(fnCallBack) > -1)) {
            var index = keysEvent[keyCode].indexOf(fnCallBack);

            keysEvent[keyCode][index] = null;
        }

    };

    self.removeAllEvent = function(keyCode) {
        if (keysEvent[keyCode].length > 0) {
            keysEvent[keyCode] = [];
        }
    };

    self.getLastKey = function() {
        return lastKey;
    };


    self.__init();

    return self;
})();

// 自动关闭窗口
sun.autoBlur = function(nodeTrigger, nodeResult, fnblur) {
    var isFirst = true,
        self = this;

    function callBack(evt) {
        // 第一次事件方法不执行
        if (isFirst) {
            isFirst = false;
            return;
        }

        // 再次点击的是 触发窗口中的元素
        if (nodeTrigger && nodeTrigger.contains(evt.target || evt.srcElement)) {
            self.event.remove('click', document, callBack);
            return;
        }

        // 点击的是 结果窗口中的元素
        if (nodeResult && nodeResult.contains(evt.target || evt.srcElement)) {

        } else {
            if (typeof fnblur == 'function') {
                 fnblur();
            }
            self.event.remove('click', document, callBack);
        }
    }

    self.event.add('click', document, callBack);
};

sun.event = {
    add: function (type, node, fun) {
        var _addEvent = null;

        if (node.addEventListener) {
            node.addEventListener(type, fun, false);
        } else if(node.attachEvent){
            node.attachEvent('on' + type, fun);
        } else {
            node['on' + type] = fun;
        }
        return _addEvent;
    },

    remove: function (type, node, fun) {
        var rmEvent = null;

        if (node.removeEventListener) {
            node.removeEventListener(type, fun, false);
        } else if (node.detachEvent){
            node.detachEvent('on' + type, fun);
        } else {
            node['on' + type] = null;
        }
    },

    //阻止事件冒泡函数
    stopBubble: function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
    }
};

sun.getQueryStringByName = function(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));

    if (!result || result.length < 1) {
        return "";
    }

    return result[1];
};

sun.cookie = (function(){
    // .eg article detail http://www.cnblogs.com/Darren_code/archive/2011/11/24/Cookie.html
    var self  = {};

    self.setExpires = function (name,value,expiresValue){
        var Days = expiresValue;
        var exp  = new Date();    //new Date("December 31, 9998");

        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    };

    self.set = function (name,value){
        var Days = 30; //此 cookie 将被保存 30 天

        this.setExpires(name, value, Days);
    };

    self.get = function (name){
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));

        if(arr) {
            return unescape(arr[2]);
        }
        return null;
    };

    self.getAll = function() {
        return document.cookie;
    };

    self.del = function (name){
        var exp = new Date();
        var cval= this.get(name);

        exp.setTime(exp.getTime() - 1);
        if(cval) {
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        }
    };

    return self;
})();

sun.localStorage = (function(global) {
    var self = {
        _ls : global.localStorage
    };

    self.set = function(name, value) {
        this._ls.setItem(name,value.toString());
    };

    self.get = function(name) {
        return this._ls.getItem(name);
    };
    self.getAll = function() {
        return this._ls;
    };

    self.del = function(name) {
        var val = this.get(name);

        if (!!val) {
            this.__ls.removeItem("c");
        }
    };

    self.clearAll = function() {
        global.localStorage.clear();
    };

    return self;
})(window);

sun.location = {
    _replaceState: function(sQueryString) {
        if (!!history) {
            //这里可以是你想给浏览器的一个State对象，为后面的StateEvent做准备。
            var state = {
                title : "HTML 5 History API simple demo",
                url : location.origin + location.pathname + sQueryString
            };

            history.replaceState(state, 'title', sQueryString);
        } else {
            location.replace(sQueryString);
        }
    },

    // 返回新的localtion.search的值
    _getNewUrlSearch: function (keyName, keyValue, _search) {
        if (keyName != null && keyValue != null) {
            var newParams = keyName + '=' + keyValue;
            var re = new RegExp("(?![\?\&])\\b" + keyName + "[=][^&#]*", 'img');

            if (re.test(_search)) {
                _search = _search.replace(re, newParams);
            } else {
                if (_search.indexOf('?') > -1) {
                    _search += '&' + newParams;
                } else {
                    _search += '?' + newParams;
                }
            }
        }

        return _search;
    },

    // 返回新的localtion.search的值
    _removeByName: function (keyName, _search) {
        if (keyName != null) {
            var re = new RegExp("[\?\&]\\b" + keyName + "[=][^&#]*", 'img');

            if (re.test(_search)) {
                _search = _search.replace(re, '');
            }

            if (!_.isEmpty(_search) && _search[0] == '&') {
                _search = _search.replace('&', '?');
            }
        }

        return _search;
    },

    // 根据传入的URL进行解析
    parseUrl : function (sUrl) {
        var url = sUrl || '';

        url = url.replace(/\\/g, '/');

        var host = '',
        protocol = '',
        port = '',
        path = '',
        query = '',
        hash = '',

        paths = [],
        querys = {};
        var a;
        //解析协议名
        if (url.indexOf('://') > -1) {
            a = url.split(':');
            protocol = a.shift() + ':';
            url = a.join(':');
        }
        //解析主机名
        if (url.indexOf('//') === 0) {
            url = url.replace('//', '');
            a = url.split('/');
            host = a.shift();
            url = a.join('/');
            if (host.indexOf(':') > -1) {
                a = host.split(':');
                host = a[0];
                port = a[1];
            }
        }
        //解析路径，queryString，hash
        if (url.search(/^(?:[^#]*)\?/i) > -1) {
            url = url.replace(/\?+/g, '?');
            a = url.split('?');
            path = a.shift();
            url = a.join('?');
            a = url.split('#');
            query = a.shift();
            hash = a.join('#');
        } else {
            a = url.split('#');
            path = a.shift();
            url = a.join('#');
            hash = url;
        }

        paths = path.split('/');

        if (query) {
            a = query.split(/&/);
            var b;
            for (var i = 0, len = a.length; i < len; i++) {
                b = a[i].split('=');
                querys[b[0]] = b[1] || '';
            }
        }

        var _hostname = host + ':' + port;
        var _origin = protocol + '//' + host + ':' + port;
        var _search = '?' + url;
        var _pathname = '/' + path;
        var _href = _origin + _pathname + _search;

        return {
            hash : hash,
            host : _hostname,
            hostname: host,
            href: _href,
            origin: _origin,
            pathname : _pathname,
            paths : paths,
            port : port,
            protocol : protocol,
            querys : querys,
            search: _search,
        };
    },

    // 更新localtion.pathname
    // @param oObject {object} 段位和值的键值对: { {string} : {object} } => key为参数名称，value为值
    // @param sPathname {string}? 默认为当前的location.search
    // e.g.: ({ day: '50', '1-2' : '12341234' })
    pushStateSearch: function (oObject, sSearch) {
        var _queryString = sSearch || location.search;
        var self = this;

        if ((oObject instanceof Object) && !_.isEmpty(oObject)) {
            _.each(oObject, function (v, k) {
                // 删除此key值
                if (!v && v != '0') {
                    _queryString = self._removeByName(k, _queryString);
                } else {
                    _queryString = self._getNewUrlSearch(k, v, _queryString);
                }

            });

            // 如果_queryString为空的话，history.replaceState不可执行
            if (_queryString.indexOf('?') < 0) {
                _queryString += '?' + _queryString
            }

            this._replaceState(_queryString);
        }

        return location.href;
    },

    // 更新localtion.pathname
    // @param oObject {object} 段位和值的键值对: { {number} : {object} } 其中number为0时，默认更新为最后一段
    // @param sPathname {string}? 默认为当前的location.pathname
    // e.g: ({ 1 : 'webapp', 0 : 'default.html' })
    pushStatePathname: function(oObject, sPathname) {
        var _pathname = sPathname || location.pathname;
        var _pathnameList = _pathname.match(/\/{1}[^\/]*/ig) || [];

        if ((oObject instanceof Object) && !_.isEmpty(oObject)) {
            var _section = 0,
                _value = '';

            _.each(oObject, function (v, k) {
                _section = k | 0;
                // value转为string
                v = v + '';
                // 如果 value为空，则为删除此段位
                _value = !!v ? '/' + v : '';

                if (_section > 0) {
                    _pathnameList[_section - 1] = _value;
                } else {
                    _pathnameList[_pathnameList.length - 1] = _value;
                }
            })

            this._replaceState(_pathnameList.join('') + location.search);
        }

        return location.href;
    },

    // 只对传入的参数进行修改，不更改当前浏览器的URL
    // @param oObject {object} 段位和值的键值对: { {string} : {object} } => key为参数名称，value为值
    // @param sUrl {string}? url地址
    // e.g.: ({ day: '', '1-2' : '12341234' }, 'https://www.baidu.com?day=50&1-2=222')
    // 删除day ,更新1-2参数
    formatSearch: function (oObject, sUrl) {
        var _url = this.parseUrl(sUrl);
        var _queryString = _url.search;
        var resultUrl = sUrl;
        var self = this;

        if ((oObject instanceof Object) && !_.isEmpty(oObject)) {
            _.each(oObject, function (v, k) {
                // 删除此key值
                if (!v && v != '0') {
                    _queryString = self._removeByName(k, _queryString);
                } else {
                    _queryString = self._getNewUrlSearch(k, v, _queryString);
                }

            });

            // 如果_queryString为空的话，history.replaceState不可执行
            if (_queryString.indexOf('?') < 0) {
                _queryString += '?' + _queryString
            }

            resultUrl = _queryString;
        }

        return _url.origin + _url.pathname + resultUrl;
    }
};

sun.guid = function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++)
            uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
};

/**
 * it is for alex to shortcut method
 * delete before online
 */
(function shortCut(_sun) {
    _sun.tojs = function(vmodel) {
        return ko.mapping.toJS(vmodel);
    };
    _sun.log = function() {
        if (arguments.length > 1) {
            console.log(arguments);
        } else {
            console.log(arguments[0]);
        }

        if (arguments.callee.caller) {
            console.log('vvvvvvvvvvvvvvvvvvvvvvvvvv caller start vvvvvvvvvvvvvvvvvvvvvvvvvv');
            console.log(arguments.callee.caller.toString());
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^ caller end ^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        }
    };
    _sun.write = function(txt){
        var p = document.createElement('p');
        var hr = document.createElement('hr');

        p.innerHTML = txt;
        document.body.appendChild(hr);
        document.body.appendChild(p);
    };
})(sun);

sun._getPath = function (sPath) {
    var scripts = document.scripts || [];
    var dir = '';

    for (var i = 0, max = scripts.length; i < max; i++) {
        var src = scripts[i] && scripts[i].getAttribute('src') || '';

        if (src.indexOf(sPath) < 0) {
            if (/sun([^\/]*?).js/i.test(src)) {
                dir = src.replace(/sun([^\/]*?).js/i, '');
                break;
            }
        }
    }

    if (dir) {
        return dir + sPath;
    } else {
        return null;
    }
};


