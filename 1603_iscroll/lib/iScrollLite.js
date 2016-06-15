define(function(require) {
    
    require('lib/transition');
    
    var iScroll = function(domNode, options) {
        this.$rootEle = $(domNode);
        this.$scrollEle = this.$rootEle.find('>.x-scroll');
        this.$scrollCEle = this.$scrollEle.find('>.x-scroll-content');
        this.$pdEle = this.$scrollEle.find('>.x-pull-down');
        this.$puEle = this.$scrollEle.find('>.x-pull-up');
        
        
        
        this.options = options || {topOffset:50};
        this.options = $.extend({
            onRefresh : null,
            onScrollMove : null,
            onScrollEnd : null
        },this.options);
        this.init();
    };
    
    iScroll.prototype.init = function(){
        var self = this;
        this.pullDown();
        this.refresh();
        if(this.maxScrollY === 0){
            if (this.options.onScrollEnd){
                setTimeout(function(){
                    self.options.onScrollEnd();
                },500);
            }
        }
    };
    
    
    
    
    iScroll.prototype.refresh = function(){
        var self = this;
        if (this.options.onRefresh){
            this.options.onRefresh.call(self);
        }
        this.$scrollEle.transition(300);
        this.$scrollEle.transitionEnd(function(){
            self.$scrollEle.transition(0);
        });
        this.$scrollEle.transform('translate3d(0,0,0)');
        this.maxScrollY = -1 * (this.$scrollEle.get(0).scrollHeight - this.$scrollEle.height());
        this.y = this.$scrollEle.scrollTop() * -1;
    };
    
    
    
    
    iScroll.prototype.supportContentTouchMove = function(){
        var isMoved = false,pullStarted,touchesStart = {},isScrolling,deltaX,deltaY,touchesDiff,touchStartTime,
            self=this,isFirstMove=true;
            
        this.$scrollCEle.on('touchstart mousedown',function(e){
            if(e instanceof $.Event){
                e = e.originalEvent;
            }
            isMoved = false;
            isScrolling = true;
            isFirstMove = true;
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = (new Date()).getTime();
            self.$scrollEle.transition(0);
        });
        
        
        var debounce = function(fn, wait) {
            var timeout;
            return function() {
                var args = arguments,
                    later = function() {
                        timeout = null;
                        fn.apply( self, args );
                    }
                if( timeout ) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout( later, wait );
            };
        };    
        
        this.$scrollEle.on('scroll',function(e){
            self.y = self.$scrollEle.scrollTop() * -1;
            if (self.options.onScrollMove){
                self.options.onScrollMove.call(self, e);
            }
            if (self.options.onScrollEnd){
                debounce(self.options.onScrollEnd,200)(e);
            }
        });
        
        this.$scrollCEle.on('touchmove mousemove',function(e){
            if(e instanceof $.Event){
                e = e.originalEvent;
            }
            if(e.hasStopedPropagation === true){
                return;
            }
            if(e.type === 'touchmove' && e.targetTouches.length > 1){
                return;
            }
            var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            
            
            deltaX = Math.abs(pageX - touchesStart.x);
            deltaY = Math.abs(pageY - touchesStart.y);
            touchesDiff = pageY - touchesStart.y;
            
            if(isFirstMove && (deltaY > deltaX) && self.$scrollEle.scrollTop() === 0 && touchesDiff > 0){
                isFirstMove = false;
                isScrolling = false;
                isMoved = true;
            }
            if (isScrolling === false && isMoved === true) {
                e.hasStopedPropagation = true;
                e.preventDefault();
                //摩擦系数为0.85感觉手感不错
                self.$scrollEle.transform('translate3d(0,' + Math.pow(touchesDiff, 0.85) + 'px,0)');
                self.y = Math.pow(touchesDiff, 0.85) - self.options.topOffset;
                if (self.options.onScrollMove){
                    self.options.onScrollMove.call(self, e);
                }
            }
            
        });
        
        this.$scrollCEle.on('touchcancel touchend mouseup',function(e){
            if(e instanceof $.Event){
                e = e.originalEvent;
            }
            
            if (isScrolling === false && isMoved === true) {
                if (self.options.onScrollEnd){
                    self.options.onScrollEnd.call(self, e);
                }
                if(!(self.$pdEle.hasClass('x-flip') || self.$pdEle.hasClass('x-restore'))){
                    self.refresh();
                }
            }
            
            isScrolling = true;
            isMoved === false;
            isFirstMove = false;
        });
    };
    
    iScroll.prototype.pullDown = function() {
        if (this.$pdEle.length === 0) {
            return;
        }
        this.supportContentTouchMove();
    };
                          
    iScroll.prototype.destroy = function() {
    };
    return iScroll; 
});


















