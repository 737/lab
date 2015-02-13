
require.config({
    baseUrl: 'js/',
    paths: {
        'jQuery': '/lib/jquery.v1.11.0',
        'underscore': '/lib/underscore.v1.4.4',
        'text': '/lib/require.text',
        'domReady': '/lib/require.domReady',
        'sun': '/sun/src/sun'
    }
});

require(['jQuery', 'underscore', 'sun'], function () {
    
    
        
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

