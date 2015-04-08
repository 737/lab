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

log = function() {
    var _arg = _.extend([], arguments);
    
    _arg.unshift('///////////////////////////////////////////////////////\r\n\r\n\r\n');
    _arg.push('\r\n\r\n\r\n////////////////////////////////////////////////////////////////////////////');
    
    console.log.call(console, _arg);
}

require(['underscore', 'jquery', 'sun'], function() {
    
    log('start', '22', 'dd');
    
});
