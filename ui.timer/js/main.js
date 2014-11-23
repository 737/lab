
require.config({
    urlArgs: "v=" + (new Date()).getTime(),
    baseUrl: 'js/',
    paths: {
        'jQuery': '/include/js/jquery',
        'underscore': '/include/js/underscore',
        'text': '/include/js/require.text',
        'domReady': '/include/js/require.domReady',
        'sun': '/sun/sun'
    }
});

require(['jQuery', 'underscore', 'sun', 'ui.timer'], function (cc, cc, cc, UiTimer) {
    var elmTimer = $('#searchBox');
    
    elmTimer.click(function (evt){
        var self = this;
    
        if (this.timer1) {
            this.timer1.show(elmTimer);
        } else {
            this.timer1 = new UiTimer();
            this.timer1.show(elmTimer);
        }
        
        sun.autoBlur(elmTimer[0], this.timer1.body[0], function () {
            self.timer1.hide();
        });
    });
    
    $('#searchBox2').click(function (evt){
        var self = this;
    
        if (this.timer2) {
            this.timer2.show($('#searchBox2'));
        } else {
            this.timer2 = new UiTimer();
            this.timer2.show($('#searchBox2'));
        }
        
        sun.autoBlur($('#searchBox2')[0], this.timer2.body[0], function () {
            self.timer2.hide();
        });
    });
});

function getTemplateUrl (sUrl) {
    return 'text!../templates/' + sUrl;
}

