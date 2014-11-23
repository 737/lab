


$(document).ready(function(){
    $('#opciones').hide();
    
    var srcElm = $('#searchBox');
    var elmBlur = $('#opciones');
    
    srcElm.click(function (evt) {
        elmBlur.slideDown();
        
        sun.autoBlur(srcElm[0], elmBlur[0], function () {
            elmBlur.hide();
        });
    });
});

var sun = sun || {};

// 自动关闭窗口
sun.autoBlur = function(nodeTrigger, nodeResult, fnblur) {
    var isFirst = true;
    
    function callBack(evt) {
        console.log('1234124');
    
        // 第一次事件方法不执行
        if (isFirst) {
            isFirst = false;
            return;
        }
        
        // 再次点击的是 触发窗口中的元素
        if (nodeTrigger.contains(evt.target)) {
            document.removeEventListener('click', callBack);
            return;
        }
        
        // 点击的是 结果窗口中的元素
        if (nodeResult.contains(evt.target)) {
            'nothing';
        } else {
            fnblur();
            document.removeEventListener('click', callBack);
        }
    };
    
    document.addEventListener('click', callBack);
};










sun.autoBlur.prototype.hasSonNode = function (nodeBlur, nodeSon) {
    return;

    var topName = ['BODY', 'HTML'];
    
    var index =  topName.indexOf(nodeSon.tagName.toUpperCase());
    
    if (nodeBlur.contains(nodeSon)) {
        console.log(1);
    } else {
        this.fnBlur();
    }
    
    
};
