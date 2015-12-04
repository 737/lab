require.config({
    baseUrl: '/js/',
    paths: {
        zepto: 'libs/zepto'
    }
});

require(['vendor/a', 'vendor/b'], function(a, bext){
    var myhellow  = 'this is test name is my hellow'
    
    console.log(bext);
    
    console.log(myhellow);
    
    console.log(a.total(5,10));
})