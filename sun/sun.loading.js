var sun = sun || {};

var _loadingbar = function(){
    var self = {},
        settings = {
            direction: "right"
        };

    function _start(){
        if ($("#sun_loadingbar").length === 0) {
            $("body").append("<div id='sun_loadingbar'></div>");
            $("#sun_loadingbar").addClass("waiting").append($("<dt/><dd/>"));

            switch (settings.direction) { 
                case 'right':
                   $("#sun_loadingbar").width((50 + Math.random() * 30) + "%");
                  break;
                case 'left':
                    $("#sun_loadingbar").addClass("left").animate({
                        right: 0,
                        left: 100 - (50 + Math.random() * 30) + "%"
                    }, 200);
                  break;
                case 'down':
                   $("#sun_loadingbar").addClass("down").animate({
                     left: 0,
                     height: (50 + Math.random() * 30) + "%"
                   }, 200);
                  break;
                case 'up':
                   $("#sun_loadingbar").addClass("up").animate({
                     left: 0,
                     top: 100 - (50 + Math.random() * 30) + "%"
                   }, 200);
                  break;
                }
            }
    };

    function _end(){
        switch (settings.direction) { 
            case 'right':
               $("#sun_loadingbar").width("101%").delay(200).fadeOut(400, function() {
                   $(this).remove();
               });
              break;
            case 'left':
               $("#sun_loadingbar").css("left","0").delay(200).fadeOut(400, function() {
                    $(this).remove();
                });
              break;
            case 'down':
                $("#sun_loadingbar").height("101%").delay(200).fadeOut(400, function() {
                     $(this).remove();
                 });
               break;
            case 'up':
                $("#sun_loadingbar").css("top", "0").delay(200).fadeOut(400, function() {
                     $(this).remove();
                 });
               break;
          }
    };

    self.start = function() {
        var _url = sun.loading.config.cssPath + 'sun_loadingbar.css';

        sun.load.css(_url, function() {
            setTimeout(_start, 1000)
        });
    };

    self.end = function() {
        setTimeout(_end, 1200);
    };

    return self;
}();

var _loadCircle = function(){
    var self = {},
        settings = {
            direction: "right"
        };

    function _start(){
        if ($("#sun_loadCircle").length > 0) {
            var html = '<div id="sun_loadCircle">'
                            + '<div class="spinner">'
                              + '<div class="spinner-container container1">'
                                + '<div class="circle1"></div>'
                                + '<div class="circle2"></div>'
                                + '<div class="circle3"></div>'
                                + '<div class="circle4"></div>'
                              + ' </div>'
                              + '<div class="spinner-container container2">'
                                + '<div class="circle1"></div>'
                                + '<div class="circle2"></div>'
                                + '<div class="circle3"></div>'
                                + '<div class="circle4"></div>'
                              + '</div>'
                              + '<div class="spinner-container container3">'
                                + '<div class="circle1"></div>'
                                + '<div class="circle2"></div>'
                                + '<div class="circle3"></div>'
                                + '<div class="circle4"></div>'
                              + ' </div>'
                            + ' </div>'
                        + ' </div>';

            $("body").append(html);
        }
    };

    function _end(){
        if ($("#sun_loadCircle").length === 0) {
            $("#sun_loadCircle").remove();
        }
    };

    self.start = function() {
        var _url = sun.loading.config.cssPath + 'sun_loadcircle.css';

        sun.load.css(_url, function() {
            setTimeout(_start, 1000)
        });
    };

    self.end = function() {
        setTimeout(_end, 1200);
    };

    return self;
}();

sun.loading = {
    config : {
        isWorking : true,
        type : 'loadingbar',
        cssPath : '/include/css/'
    },
    loadingbar : _loadingbar,
    loadCircle : _loadCircle
};
