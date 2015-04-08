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

require(['jquery', 'underscore', 'sun'], function () {
    $('#opciones').hide();
        
    var srcElm = $('#searchBox');
    var elmBlur = $('#opciones');
    
    srcElm.click(function (evt) {
        elmBlur.slideDown();
        
        sun.autoBlur(srcElm[0], elmBlur[0], function () {
            elmBlur.hide();
        });
    });
    
    var srcElm2 = $('#searchBox2');
    var elmBox2 = $('#box2');
    
    srcElm2.click(function (evt){
        elmBox2.show();
        
        sun.autoBlur(srcElm2[0], elmBox2[0], function () {
            elmBox2.hide();
        });
    });
});

function getTemplateUrl (sUrl) {
    return 'text!../templates/' + sUrl;
}

