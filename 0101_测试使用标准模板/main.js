

$(function() {
    var sun = {
        isLeftClick: function(evt) {
            var evt = window.event || evt;
            var val = evt.button,
                result = true;
            
            // 用户点击的是右建
            if(val == 2 || val ==3) {
                result = false;
            }
            
            return result;
        }
    };
    
    
    
});