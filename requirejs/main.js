require.config({
	paths: {
		jquery: 'jquery-1.7.2'
	}
});

// dev
function log(obj) {
    if (arguments.length > 1) {
        console.log(arguments);
    } else {
        console.log(arguments[0]);
    }
    
    if (arguments.callee.caller) {
        console.log('vvvvvvvvvvvvvvvvvvvvvvvvvv caller start vvvvvvvvvvvvvvvvvvvvvvvvvv');
        console.log(arguments.callee.caller.toString());
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^ caller end ^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    }
};

require(['jquery'], function($) {
	//alert($().jquery);





});




function hello(txt) {

    log(this.name, this, arguments);

};

var obj = { name : 'ali'};


hello.call(null, 'asdfasdfsdf');






// function ArgTest(a, b){
//    var i, s = "The ArgTest function expected ";
//    var numargs = arguments.length;     // 获取被传递参数的数值。
//    var expargs = ArgTest.length;       // 获取期望参数的数值。
//    if (expargs < 2)
//         s += expargs + " argument. ";
//    else
//         s += expargs + " arguments. ";
//    if (numargs < 2)
//         s += numargs + " was passed.";
//    else
//         s += numargs + " were passed.";
//      s += " "
//    for (i =0 ; i < numargs; i++){      // 获取参数内容。
//      s += "    Arg " + i + " = " + arguments[i] + " ";
//      }
//    return(s);                          // 返回参数列表。
// }
// 在此添加了一个说明arguments不是数组(Array类)的代码:Array.prototype.selfvalue = 1;
// alert(new Array().selfvalue);
// function testAguments(){
//       alert(arguments.selfvalue);
// }