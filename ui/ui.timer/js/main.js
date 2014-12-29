
require.config({
    urlArgs: "v=" + (new Date()).getTime(),
    baseUrl: 'js/',
    paths: {
        'text': '/include/require.text',
        'sun': '/sun/sun'
    },
    shim: {
        'sun':  {
            exports: 'sun'
        }
    }
});

require(['ui.timer', 'sun'], function (UiTimer, sun) {
    
    var timer1 = null;
    $('#searchBox').click(function (evt){
        var self = this;
    
        var options = {
            elmTrigger: $(this),
            elmContainer: $(this).parent(':first'),
            sTime: this.value,
            close: function(time) {
                console.log(time);
            
                self.value = time;
            }
        };
    
        if (timer1) {
            timer1.setOptions({
                sTime: this.value,
            });
        } else {
            timer1 = new UiTimer(options);
        }
        timer1.show();
    });
    
    
    var timer2 = null;
    $('#searchBox2').click(function (evt){
        var self = this;
    
        var options = {
            elmTrigger: $(this),
            elmContainer: $(this).parent(':first'),
            sTime: this.value,
            close: function(time) {
                console.log(time);
            
                self.value = time;
            }
        };
    
        if (!timer2) {
            timer2 = new UiTimer(options);
        }
        
        timer2.show();
    });
});

function getTemplatesUrl(sUrl) {
    return 'text!../templates/' + sUrl;
}

