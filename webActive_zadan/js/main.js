
// hit eggs
var sun_hitEgg = (function(globa) {
    var self = {},
        DOM_eggs = null,
        Hmmer_eggs = [];

    var pathItem = (function() {
        var lst = 120;

        var pathArc0 = new $.path.arc({
            center: [155, 130],
            radius: 65,
            start: 0,
            end: lst,
            dir: 1
        });

        var pathArc1 = new $.path.arc({
            center: [155, 130],
            radius: 65,
            start: 120,
            end: lst + 120,
            dir: 1
        });

        var pathArc2 = new $.path.arc({
            center: [155, 130],
            radius: 65,
            start: 240,
            end: lst + 240,
            dir: 1
        });

        return [pathArc0, pathArc1, pathArc2];
    })();

    showRibbion = function(nTop, nLeft) {
        var qdom = $('#sun_hitEgg_wrap .ribbon');

        if (qdom.length > 0) {
            qdom.show();

            qdom.css({ top: nTop, left : nLeft });
        }
    };

    showHammer = function(nTop, nLeft, fncallBack) {
        var qdom = $('#sun_hitEgg_wrap .hammer');

        if (qdom.length > 0) {
            qdom.show();
            qdom.css({ left : nLeft, top : 0 });
            qdom.stop().animate({ 'top': '184px' }, 70, function() {
                fncallBack()
            });
        }
    };

    self.init = function() {
        DOM_eggs = $("#sun_hitEgg_wrap .egg_shap");

        this.bindEvent();
        self.start();
    };

    self.bindEvent = function() {
        var me = this,
            _hammer_eggs,
            _hammer_fn_eggs,
            eggs = document.getElementsByClassName('egg_shap');

        for (var i = eggs.length - 1; i >= 0; i--) {
            _hammer_eggs = Hammer(eggs[i]);
            _hammer_fn_eggs = function() {
                me.hitEgg(this);
            };

            _hammer_eggs.on('tap', _hammer_fn_eggs);
            Hmmer_eggs.push({ obj: _hammer_eggs , evt : _hammer_fn_eggs });
        };

        // show path trace
        // $(".plot > button").click(function() {
        //     me.showTrace(DOM_eggs);
        // });
        
        sun.key.set(32, self.start);
        sun.key.set(27, self.stop);
    };

    self.unBindEvent = function() {
        sun.util.each(Hmmer_eggs, function(v, i) {
            v.obj.off('tap', v.evt);
        });

        sun.key.removeAllEvent(32);
        sun.key.removeAllEvent(27);
    };

    self.start = function() {
        var tag_index = 0,
            me = self;

        DOM_eggs.parent(':first').show();

        for (var i = 0, max = pathItem.length; i < max; i++) {
            $(DOM_eggs[i]).stop().animate({path: pathItem[i]}, 3000, 'linear', function() {
                if (i === 3) {
                    me.start();
                }
            });
        };
    };

    self.showTrace = function(qDOM) {
        var dotDiv = $("<div>"),
            trace = null;
            
        for (var i = 0; i < pathItem.length; i ++) {
            trace = pathItem[i];

            for(var t=0; t<1; t+= 0.01) {
                var d = $('<span class="dot"></span>').css(trace.css(t))
                dotDiv.append(d);
            };
            qDOM.parent().append(dotDiv);
        }
    };

    self.hitEgg = function (elm) {
        var left = sun.util.parseToInt(elm.style.left),
            top = sun.util.parseToInt(elm.style.top);

        self.unBindEvent();

        showHammer(top, left, function() {
            $(elm).addClass("breaked");
            showRibbion(top, left);
        });

        sun.dialog({
            cssPath : 'js/lib/css/sun-dialog.css',
            type: 'ok',
            image: 'css/images/kit.png',
            title: '可惜哟',
            text: '谢您的参与，请再接再厉哟！',
            ok: '再试一次',
            show: '知道了',
            callback: sun.util.reload
        });

        self.stop();
    };

    self.stop = function() {
        for (var i = 0, max = pathItem.length; i < max; i++) {
            $(DOM_eggs[i]).stop();
        };
    };


    return self;
})(this);

