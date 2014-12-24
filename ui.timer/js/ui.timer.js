/**
    *   时间选择器插件
    *   李文利
    *   liwl@ctrip.com
    *   2014/11/28
    *   基于jQuery
    */
define(['sun', getTemplatesUrl('ui.timer.html')], function (sun, htmlTemplate) {

    var timer = function(Options) {
        var self = this;
        
        this.options = {
            elmTrigger: Options.elmTrigger,
            isAutoBlur: Options.isAutoBlur || true,
            sTime: Options.sTime || '06:30',
            close: Options.close,
            elmContainer: Options.elmContainer
        };
        
        // 是否重新赋值了
        this.isRefreshOptions = false;
        this.guid = 'cui-' + sun.guid(10, 10);
        this.elmContainer = this.options.elmContainer;
        this.body = null;
        this.node = null;
    };
    
    function bindEvents(elmBody) {
        var self = this;
        
        if (!elmBody) {
            return;
        }
        
        elmBody.on('click', 'button', function(evt) {
            self.hide();
        });
        
        elmBody.on('click', 'a', function(evt) {
            var _elmTarget = jQuery(evt.currentTarget),
                _value = _elmTarget.attr('data-value'),
                _type = _elmTarget.attr('data-type');
            
            elmBody.find('a[data-type=' + _type + ']').removeClass('selected');
            _elmTarget.addClass('selected');
            
            (self.options.close instanceof Function) && self.options.close(self.value());
        });
    }

    // 重新生成DOM并插入到指定容器中
    function render() {
        var self = this;
        
        function getContentHtml(options, html) {
            var tmpl = _.template(html);
            
            return tmpl({
                guid: self.guid
            });
        }
    
        // 选中时，分，并滚动到所在位置
        function selectedAndScroll(elmBody, sTime) {
            var time = sTime.split(':');
            var hourIndex = '00',
                minutesIndex = '00';
        
            if (time.length != 2) {
                return;
            }
            
            hourIndex = time[0] | 0;
            minutesIndex = Math.ceil((time[1] | 0) / 5);
            elmBody.find('a').removeClass('selected');
            
            var elmHour = jQuery(elmBody.find('a[data-type=hour]')[hourIndex]).addClass('selected');
            var elmMinute = jQuery(elmBody.find('a[data-type=minute]')[minutesIndex]).addClass('selected');
            
            elmHour.parent('div').scrollTop(hourIndex * 24);
            elmMinute.parent('div').scrollTop((minutesIndex - 1) * 24);
        }
        
    
        this.body = jQuery(getContentHtml.call(this, this.options, htmlTemplate));
        this.node = this.body[0];
                
        // 外围容器需要相对定位
        var _position = ['relative', 'absolute', 'fixed'];
        if (_position.indexOf(this.elmContainer.css('position')) < 0) {
            this.elmContainer.css({
                'position': 'relative',
                'overflow': 'visible'
            });
        }
        
        setTimeout(function() {
            self.elmContainer.append(self.body);
            selectedAndScroll.call(self, self.body, self.options.sTime);
            bindEvents.call(self, self.body);
        }, 10);
    };
    
    timer.prototype = {
        constructor: timer,
        
        show: function() {
            var self = this;
            var isRendered = !!jQuery('#' + this.guid).length;
            
            // DOM是否渲染过
            if (isRendered) {
                // 重新赋值了，则删除DOM
                if (this.isRefreshOptions) {
                    self.remove();
                    
                    render.call(self);
                } else {
                    this.body.show();
                }
            } else {
                render.call(self);
            }
            
            // 点击其它地方关闭
            if (this.options.isAutoBlur) {
                sun.autoBlur(this.options.elmTrigger[0], this.body[0], function() {
                    self.hide();
                });
            }
        },
        
        value: function() {
            var _times = this.body.find('a.selected'),
                _hour = null,
                _minutes = null;
            
            if (_times.length === 2) {
                _hour = _times[0].getAttribute('data-value');
                _times = _times[1].getAttribute('data-value');
            } else {
                return null;
            }
            
            return _hour + ':' + _times;
        },
        
        setOptions: function(Options) {
            this.isRefreshOptions = true;
        
            if (!sun.validate.isEmptyObject(Options)) {
                this.options = _.extend(this.options, Options);
            }
        },
        
        hide: function() {
            this.body.hide();
        },
        
        remove: function () {
            this.body.remove();
        }
    };
    
    return timer;
});
