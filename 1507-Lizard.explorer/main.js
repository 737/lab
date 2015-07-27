require.config({
    waitSeconds: 20
});

require(['cUtilObject'], function(cUtilObject) {

    window.cc = this;
    
    cc.cUtilObject = cUtilObject;

});
