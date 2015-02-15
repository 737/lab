
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
    
});

function getTemplateUrl (sUrl) {
    return 'text!../templates/' + sUrl;
}

