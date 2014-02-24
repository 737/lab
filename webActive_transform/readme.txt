
使用前必须先引入jquery 因为此js代码扩展依赖于jquery
使用方式:

html文件：
<script src="your_path/jquery.bet.js" type="text/javascript"> </script>
<div class="content"></div>

js文件：

$(document).ready(function () {
	$(".content").runMora({callBack: function (res) {alert(res)}});
	$(".content").runDice({callBack: function (res) {alert(res)}});
});

可设置的属性： 
表情的长和宽 : {height: "30px", width: "30px"}
初始显示的图片： {src: 'yourpath/yourimg_name.jpg'}
样式: {style: 'display: none; background-color: red'}
动画结束后的回调方法： {callBack: function (res) {alert(res)}}// res:返回动画停止时的图片序号， 数字类型