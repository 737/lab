require.config({
    waitSeconds: 20,
    baseUrl: '',
    paths: {
        'underscore': '/lib/underscore.v1.4.4',
        'jquery': '/lib/jQuery.v1.11.0-beta3',
        'sun': '/sun/src/sun'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'sun': {
            exports: 'sun'
        }
    }
});

require(['underscore', 'jquery', 'sun'], function() {
    
    // JSON数据按0-9A-Za-z进行排列
    function jsonSort(oObject) {
        
        // @param nDefaultLength {number}  默认位宽
        function getCharCodeAt(sName, nDefaultLength){
            var _code = '',
                _temp = '';
            
            _.each(sName, function(v, i) {
                _temp = v.charCodeAt().toString();
                
                if (_temp.length === 1) {
                    _temp = '00' + _temp;
                }
                if (_temp.length === 2) {
                    _temp = '0' + _temp;
                }
                
                _code = _code + _temp;
            });
            
            var dvalue = nDefaultLength * 3 - _code.length;
            for(var i = 0; i < dvalue; i++) {
                _code = _code + '0';
            }
            
            return _code;
        }
        
        // 传入的不是对象参数
        if (_.isObject(oObject)) {
            // 数组进行迭代
            if (_.isArray(oObject)) {
                _.each(oObject, function(v ,i) {
                    // 迭代对象
                    if (_.isObject(v) || _.isArray(v)) {
                        oObject[i] = jsonSort(v);
                    }
                });
                
                return oObject;
            }
        } else {
            oObject = JSON.parse(oObject);
            
            if (_.isObject(oObject)) {
                jsonSort(oObject);
            } else {
                return oObject;
            }
        }
        
        // 取最长的Key
        var maxKey = _.max(_.keys(oObject), function (item) { 
            return item.length
        });
        // 对象中key最长的长度
        var maxKeyLength = maxKey.toString().length;
        
        var objectWithCharCode = {},    // 将key转为charcode后进行存储
            codeAt = null,
            codeAtArray = [],   // 排序code
            _new = null;    // 临时变量

        let v = null;
        
        for (var k in oObject) {
            v = oObject[k];

            // 迭代对象
            if (_.isObject(v) || _.isArray(v)) {
                v = jsonSort(v);
            }

            codeAt = getCharCodeAt(k, maxKeyLength);

            codeAtArray.push(codeAt);

            _new = {};
            _new[k] = v;

            objectWithCharCode[codeAt] = _new;
        };
        
        // 数据组排序
        codeAtArray.sort(function(a, b) {
            return a - b;
        });
        
        // 按codeAtArray重新组装数据
        var result = {};
        _.each(codeAtArray, function(v, i) {
            objectWithCharCode[v];
            
            result = _.extend(result, objectWithCharCode[v]);
        });
        
        return result;
    };
    
    var o1 = {
        A: 2,
        a: 1,
        BB: 33,
        bbby: '3',
        aaled: {
            b: '22',
            a: {
                dd: 44,
                aa: '11'
            }
        },
        '00': '123123',
        ab: [334,2, 41,1,33, {
            ddd: 11,
            aa: '222'
        }]
    };
    
    var tt = o1;
    
    // console.log(JSON.stringify(tt));
    // console.log(JSON.stringify(jsonSort(tt)));
    
    function jsonSort2(oObject) {
        var result = oObject;
        
        
        var keys = _.keys(oObject);
        
        keys.sort(function (a, b) {
            return a < b;
        });
        
        return result;
    }

    
    $('body').on('click', '#btnSubmit', function(evt) {
        var txtInput = $('#inputBox').val().trim();
        var txtOutput = $('#outBox');
        
        var txt = jsonSort(txtInput);
        
        txtOutput.val(JSON.stringify(txt));
    })
    
});



















