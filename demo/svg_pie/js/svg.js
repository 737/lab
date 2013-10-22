
var sun = sun || {};

sun.showSS = function(){
    var console = window.console || {
            log : function(){}
        },
        n = '\n' ,
        words = [

            n +'            ┏┓．°． ┏┓            【恭喜您！你得到节操：50克 ！】     '+ n
                +'            ┃┗━━━┛┃'+ n
                +'            ┃ ⌒   ⌒ ┃'+ n
                +'            ┃  ●   ●  ┃'+ n
                +'            ┃  ” ω ”  ┃            by Alex.Li   '+ n
                +'            ┗○━━━━○┛'+ n
            ,


            n +'   ┏┓       ┏┓'+ n
                +' ┏┛┻━━━━┛┻┓'+ n
                +' ┃              ┃                              【神兽在此守护】'+ n
                +' ┃      ━      ┃'+ n
                +' ┃  ┳┛  ┗┳   ┃'+ n
                +' ┃              ┃'+ n
                +' ┃      ┻      ┃'+ n
                +' ┃              ┃'+ n
                +' ┗━━┓   ┏━━┛'+ n
                +'      ┃   ┃'+ n
                +'      ┃   ┃'+ n
                +'      ┃   ┗━━━━-━┓'+ n
                +'      ┃              ┣┓                         by Alex.Li  '+ n
                +'      ┃              ┏┛'+ n
                +'      ┗┓┓┏━┳┓┏━┛'+ n
                +'        ┃┫┫  ┃┫┫                      '+ n
                +'        ┗┻┛  ┗┻┛'
        ];
    console.log( words[rand(0, words.length - 1 )] );

    //取区间随机整数
    function rand(mi,ma){
        var range = ma - mi;
        var out = mi + Math.round( Math.random() * range) ;
        return parseInt(out);
    }
};

/**
 * it is for alex to shortcut method
 * delete before online
 */
(function shortCut() {
    tojs = function(vmodel) {
        return ko.mapping.toJS(vmodel)
    };
    log = function (){
        console.log(arguments)
    };
})()

sun.luckDraw = function(options) {
    this._domId = options.domId;
    this._w = options.width;
    this._x = this._y = options.width / 2;
    this._radius = options.width/2 * 0.85;
    this._stroke_width = 3;
    this.data = options.data;
    this.count = options.count || options.data.length;
    this.sectorAngle =  360 / this.count;
    this.paper = Raphael(this._domId, this._w, this._w);
    this.pointer = null;
    this.pointer_url = options.pointer_url || 'images/arrow.png';
    this.pointer_width = options.pointer_width || 16;

    this._init();
};
sun.luckDraw.prototype.setSetctor = function(cx, cy, r, startAngle, endAngle, params) {
    var rad = Math.PI / 180;
    var x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad);

    this.paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
};
sun.luckDraw.prototype.setPrizes = function(cx, cy, r, startAngle, endAngle, rotateAngle, odata) {
    var rad = Math.PI / 180,
        percentName = 0.8,
        percentDes = 0.55,
        xName = cx + r * Math.cos((-endAngle + rotateAngle) * rad) * percentName,
        yName = cy + r * Math.sin((-endAngle + rotateAngle) * rad) * percentName,
        xDes = cx + r * Math.cos((-endAngle + rotateAngle) * rad) * percentDes,
        yDes = cy + r * Math.sin((-endAngle + rotateAngle) * rad) * percentDes,
        deg = 90 - endAngle + rotateAngle;

    this.paper.text(xName, yName, odata.name).attr({
        'font-size' : Math.floor(this._radius * 0.1),
        'font-weight' : 'bold',
        'fill' : '#A16A17',
        'stroke' : '#F2DD81',
        'font-family' : '"Microsoft YaHei", "微软雅黑", "SimSun", "宋体"',
        'stroke-width' : 1,
    }).rotate(deg);

    if (!!odata && odata.type === 'number'){
        this.paper.text(xDes, yDes, odata.description).attr({
            'font-size' : Math.floor(this._radius * 0.105),
            'font-weight' : 'bold',
            'fill' : '#A16A17',
            'font-family' : '"Microsoft YaHei", "微软雅黑", "SimSun", "宋体"',
        }).rotate(deg);
    } else if ( !!odata && odata.type === 'image' ){
        var imgWidth = this._radius*2*Math.PI/this.count/2 * percentDes,
            t = 't-' + imgWidth / 2 + ',-' + imgWidth / 2 + 'r' + deg;

        this.paper.image(odata.description, xDes, yDes, imgWidth, imgWidth).transform(t);
    }
};
sun.luckDraw.prototype._init = function() {
    this.paper.circle(this._x, this._x, this._w/2 * 0.95).attr({
        'fill' : '135-#C96700-#FEEF00-#fff',
        'stroke-width' : 0
    });
    this.paper.circle(this._x, this._x, this._w/2 * 0.92).attr({
        'fill' : '#C80700',
        'stroke-width' : 0
    });
    this.paper.circle(this._x, this._x, this._w/2 * 0.9).attr({
        'fill' : '135-#996414-#996414-#996414',
        'stroke-width' : 0
    });
    this.paper.circle(this._x, this._x, this._w/2 * 0.87).attr({
        'fill' : '#ffd700',
        'stroke-width' : 0
    });

    this.paper.circle(this._x, this._x, this._radius).attr({
        'fill' : '90-#ff0000-#C97D00',
        'stroke' : '',
        'stroke-width' : 0,
        'stroke-opacity' : 0.9
    });

    this.paper.customAttributes.segment = function (cx, cy, r, startAngle, endAngle) {
        var rad = Math.PI / 180;
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);

        return  {
            path : ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]
        }
    };

    var rotateAngle = -this.sectorAngle * 1.5,
        startAngle = 0,
        endAngle = 0,
        bgcolor = '';

    // set the grid
    for (var i = 1; i <= this.count; i++) {
        startAngle = endAngle;
        endAngle = this.sectorAngle*i;
        
        if (i % 2 === 0) {
            bgcolor = "0-#ED0038-#AF0029";     //red 
        } else {
            bgcolor = "90-#F0DA75-#FCE9C1";
        }

        var _segment = [this._x, this._x , this._radius, startAngle, endAngle];
        this.paper.path().attr({ 
            segment : _segment, 
            fill: bgcolor , 
            'stroke': '#fff',     //'fill' : '90-#ff0000-#C97D00',
            'stroke-opacity' : 0.75,
            "stroke-width": this._stroke_width
        }).rotate(rotateAngle,300,300);
    };

    // set the prizes
    startAngle = endAngle = 0;
    for (var i = 1; i <= this.count; i++) {
        startAngle = endAngle;
        endAngle = this.sectorAngle*(i - 0.5);

        this.setPrizes(this._x, this._x , this._radius, startAngle, endAngle, rotateAngle, this.data[i - 1])
    }

    // add the pointer
    // this.pointer = this.paper.image(
    //     this.pointer_url,
    //     this._x - this.pointer_width * 1.2/2,
    //     this._y - this._radius * 1.3/2,
    //     this.pointer_width*1.2,
    //     this._radius * 1.3
    // ).attr({
    //     'stroke': '#ffd700',     //'fill' : '90-#ff0000-#C97D00',
    //     "stroke-width": 1
    // });
    
    this.setDOMpointer();
};
var _transFlag = 'start';  // start  runing  stop
sun.luckDraw.prototype.setRotate = function(assignNum){
    assignNum = assignNum || 0;

    //this.pointer.rotate(18, 300, 300);
    var _trans_totalRotate = 360 * 5 - 360/this.count * assignNum;
    var _trans_totalTime = 1000 * 15;
    var _trans = 't0,0r' + _trans_totalRotate;

    if (_transFlag === 'start') {
        this.pointer.stop().animate({ transform : _trans }, _trans_totalTime, "<>", function() {
            _transFlag = 'stop';
        });
        _transFlag = 'runing';
    } else if (_transFlag === 'runing'){
        this.pointer.stop().animate({ transform : _trans }, 1000, ">", function() {
            _transFlag = 'stop'
        });
    } else if (_transFlag === 'stop'){
        this.pointer.stop().animate({ transform : 't0,0r0' }, 1, "", function() {
            this.stop().animate({ transform : _trans }, _trans_totalTime, "<>", function() {
                _transFlag = 'stop';
            });
            _transFlag = 'runing';
        });
    }
};
sun.luckDraw.prototype.setDOMpointer = function(){
    var me = this;
        dom_pointer = document.getElementById('sun_luckDraw_pointer');

    dom_pointer.firstElementChild.onload = function(){
        var dom_pointer_width = dom_pointer.firstElementChild.width,
            dom_pointer_height = dom_pointer.firstElementChild.height;

        dom_pointer.style.top = me._x - dom_pointer_height/2 + 'px';
        dom_pointer.style.left = me._x - dom_pointer_width/2 + 'px';

        log(me._x, (me._x - dom_pointer_width/2), dom_pointer_width, dom_pointer_height);
    };
};
sun.luckDraw.prototype.rotateY = function(element, _deg) {
    element.style.MozTransform = 'rotateZ(' + _deg + 'deg)';
    element.style.WebkitTransform = 'rotateZ(' + _deg + 'deg)';
    element.style.OTransform = 'rotateZ(' + _deg + 'deg)';
    element.style.MsTransform = 'rotateZ(' + _deg + 'deg)';
    element.style.Transform = 'rotateZ(' + _deg + 'deg)';
};
var totalTurns = 8,  // turns number
    turnsSum = 1,   // for turns caculate
    lastStopAngel = 0;  // used for record the last stop angel, to begin go on the angel
sun.luckDraw.prototype.domRotate = function(assignNum){
    var me = this,
        element = document.getElementById('sun_luckDraw_pie').children[0],
        i = lastStopAngel;

    turnsSum = 1;

    if (assignNum === -1) {
        assignNum = 3600;
    } else {
        assignNum = assignNum < 1 ? this.count : assignNum;
    }

    var stopAngel = this.sectorAngle * assignNum;

    var SUM_interval = setInterval(function() {
        if ((i >= stopAngel)&&(turnsSum >= totalTurns)) {
            log(i , stopAngel, turnsSum, totalTurns);
            clearInterval(SUM_interval);
            lastStopAngel = i;
        } else {
            i = i + 15;

            me.rotateY(element, i);
        }
        if ( i > 360) {
            i = 15;
            turnsSum ++;
        }
    }, 90);   // 如果是 案桌机2.3，设置为100 或 90   IOS系统可以设置为42
};
sun.luckDraw.prototype.stopRotate = function() {
    turnsSum = totalTurns;
};
sun.luckDraw.isEven = function(num) {
    return num % 2 == 0 ? true : false;
};

$(document).ready(function() {
    //sun.showSS();
    
    // type => number, image
    var json = [
        {
            name: '1000',
            type: 'number',
            description : '积分'
        },{
            name: 'IPOD',
            type: 'image',
            description : 'images/ipad.png'
        },{
            name: '可惜了',
            type: 'number',
            description : ''
        },{
            name: '汽车',
            type: 'image',
            description : 'images/car.png'
        },{
            name: '1000',
            type: 'number',
            description : '积分'
        },{
            name: '苹果手机',
            type: 'image',
            description : 'images/iphone.png'
        },{
            name: '1000',
            type: 'number',
            description : '积分'
        },{
            name: 'SHIP',
            type: 'image',
            description : 'images/ship.png'
        }
    ];

    luckDraw = new sun.luckDraw({
        width : 600,
        count : 8,
        data : json,
        domId: 'sun_luckDraw_pie'
    });

    var flag = false;
    $('#sun_luckDraw_pie').click(function() {

        if (!flag) {
            luckDraw.domRotate(7);
        } else {
            luckDraw.stopRotate();
        }
        flag = !flag;
    });
    
})



