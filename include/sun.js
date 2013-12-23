(function(){
    var console = window.console || {
            log : function(){}
        },
        n = '\n' ,
        words = [

            n +'            ┏┓．°． ┏┓            【恭喜您！你得到节操：50克 ！】     '+ n
                +'            ┃┗━━━┛┃'+ n
                +'            ┃ ⌒   ⌒ ┃'+ n
                +'            ┃  ●   ●  ┃                   '+ n
                +'            ┃  ” ω ”  ┃               '+ n
                +'            ┗○━━━━○┛'+ n
            ,


            n +'   ┏┓       ┏┓'+ n
                +' ┏┛┻━━━━┛┻┓'+ n
                +' ┃              ┃                              【神兽在此守护】'+ n
                +' ┃      ━      ┃'+ n
                +' ┃  ┳┛  ┗┳   ┃'+ n
                +' ┃              ┃'+ n
                +' ┃      ┻      ┃'+ n
                +' ┃              ┃'+ n
                +' ┗━━┓   ┏━━┛'+ n
                +'      ┃   ┃'+ n
                +'      ┃   ┃'+ n
                +'      ┃   ┗━━━━-━┓'+ n
                +'      ┃              ┣┓                   '+ n
                +'      ┃              ┏┛'+ n
                +'      ┗┓┓┏━┳┓┏━┛'+ n
                +'        ┃┫┫  ┃┫┫                      '+ n
                +'        ┗┻┛  ┗┻┛'
        ];
    console.log( words[rand(0, words.length - 1 )] );

    //取区间随机整数
    function rand(mi,ma){
        var range = ma - mi;
        var out = mi + Math.round( Math.random() * range) ;
        return parseInt(out);
    }
})

var sun = sun || {};

/**
 * it is for alex to shortcut method
 * delete before online
 */
(function shortCut(__sun) {
    __sun.tojs = function(vmodel) {
        return ko.mapping.toJS(vmodel)
    };
    __sun.log = function (){
        console.log(arguments)
    };
    __sun.write = function(txt){
        var p = document.createElement('p');
        var hr = document.createElement('hr');

        p.innerHTML = txt;
        document.body.appendChild(hr);
        document.body.appendChild(p);
    };
})(sun)

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