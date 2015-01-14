

$(function() {
    var sun = {};
    
    var demo = {
        isLeftClick: function(evt) {
            var evt = window.event || evt;
            var val = evt.button,
                result = true;
            
            // 用户点击的是右建
            if(val == 2 || val ==3) {
                result = false;
            }
            
            return result;
        },
        
        stopContextmenu: function(fncallback) {
            document.oncontextmenu = function() {
                typeof fncallback === 'function' && fncallback();
                
                return false;
            };
        },
        
        // 不起作用
        removeContextmenu: function() {
            document.oncontextmenu = function() {
                
                debugger;
                
                return true;
            };
        }
    };
    
    
    document.onmousedown = function (evt) {
        var isLeft = demo.isLeftClick(evt);
        
        if (isLeft) {
            $('#box').text('左键');
        } else {
            $('#box').text('右键');
        }
        
        demo.stopContextmenu(function() {
            $('#result').text('右键浏览菜单被阻止弹出');
        });
    };
    
    $('#stop').click(function(evt) {
        demo.stopContextmenu();
    });
    
    $('#remove').click(function(evt) {
        $('#result').text('可以弹出');
        demo.removeContextmenu();
    });
});