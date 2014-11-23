define([getTemplateUrl('ui.timer.html'), 'sun'], function (htmlTimer, sun) {
    
    var timer = function () {
        var nodeDiv = document.createElement('div');
        var self = this;
        
        nodeDiv.id = 'cui-' + sun.guid(10, 10);
        nodeDiv.className = 'ui-selector ui-timer kztPms-ui-timer';
        nodeDiv.innerHTML = htmlTimer;
        
        this.guid = 'guid-' + sun.guid(10, 10);
        this.rendered = false;
        this.node = nodeDiv;
        this.body = $(nodeDiv);
        
        window.cc = this;
    };
    
    function getIsRendered (sGuid){
        return !!$('#' + sGuid).length
    }
    
    function bindEvent() {
        var self = this;
    
        this.body.on('click', 'button[data-tag="close"]', function (evt) {
            console.log('关闭', self.elmTarget);
            
        
            self.hide();
        });
    };
    
    timer.prototype.show = function (elmTarget) {
        var self = this;
        
        if (getIsRendered(this.node.id)) {
            this.body.show();
        } else {
            this.elmTarget = elmTarget;
            
            document.body.appendChild(this.node);
            
            setTimeout(function () {
                bindEvent.call(self);
            });
        }
    };
    
    timer.prototype.hide = function () {
        this.body.hide();
    };
    
    timer.prototype.destroy = function () {
        this.body.remove();
        timer = null;
    };
    
    return timer;
});