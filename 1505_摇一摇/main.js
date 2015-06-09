require.config({
    waitSeconds: 20,
    baseUrl: '',
    paths: {
        'underscore': '/lib/underscore.v1.4.4',
        'jquery': '/lib/jQuery.v1.11.0-beta3',
        'sun': '/sun/src/sun'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'sun': {
            exports: 'sun'
        }
    }
});

require(['underscore', 'jquery', 'sun'], function() {
    
    // 首先在页面上要监听运动传感事件 
function init(){
　　if (window.DeviceMotionEvent) {
　　　　// 移动浏览器支持运动传感事件
        // window.addEventListener('devicemotion', deviceMotionHandler, false);
        
        window.addEventListener("deviceorientation", function(event) {
            debugger;
            // 处理event.alpha、event.beta及event.gamma
        }, true);
        
　　　　$("#yaoyiyaoyes").show();
　　} else{
　　　　// 移动浏览器不支持运动传感事件
　　　　$("#yaoyiyaono").show();
　　} 
}




// 定义一个摇动的阀值
var SHAKE_THRESHOLD = 3000;
// 定义一个变量保存上次更新的时间
var last_update = 0;
// 紧接着定义x、y、z记录三个轴的数据以及上一次出发的时间
var x;
var y;
var z;
var last_x;
var last_y;
var last_z;

// 为了增加这个例子的一点无聊趣味性，增加一个计数器
var count = 0;

function deviceMotionHandler(eventData) {
　　// 获取含重力的加速度
　　var acceleration = eventData.accelerationIncludingGravity; 

　　// 获取当前时间
　　var curTime = new Date().getTime(); 
　　var diffTime = curTime -last_update;
　　// 固定时间段
　　if (diffTime > 100) {
　　　　last_update = curTime; 

　　　　x = acceleration.x; 
　　　　y = acceleration.y; 
　　　　z = acceleration.z; 

　　　　var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000; 

　　　　if (speed > SHAKE_THRESHOLD) { 
　　　　　　// TODO:在此处可以实现摇一摇之后所要进行的数据逻辑操作
　　　　　　count++;
　　　　　　$("#yaoyiyaoyes").hide();
　　　　　　$("#yaoyiyaoresult").show();
　　　　　　$("#yaoyiyaoresult").html("摇你妹!第" + count + "个了！");
　　　　}

　　　　last_x = x; 
　　　　last_y = y; 
　　　　last_z = z; 
　　} 
}

$(document).ready(function(){
    init();
});
    
    
});



















