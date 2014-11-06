Sun.js
======

Sun.js is a utility-belt library for JavaScript.And it will always constantly review and update.For Your Information.:sunglasses:

**But, it beta now.**

### About namespace

```
sun
├── ajax
├── context
│   ├── cookie
│   └── localStorage
├── md
└── util
```

sun
---

**$** sun.$(domId)

```
sun.$('#btn_ok');
=>[<button id='btn_ok' />]
```

sun.ajax
--------

**post**    sun.ajax.post('moo/lazyer', oData, fnCallBack, [isAsync])

```
sun.ajax.post(sPageUrl, oData, fnCallBack, [isAsync]);
```

**getJSON** sun.ajax.getJSON(sPageUrl, oData, fnCallBack, [isAsync])

```
sun.ajax.getJSON('~/defined/product.json', oData, fnCallBack, [isAsync]);
=> { "name" : "sun" }
```

sun.context
-----------

**getQueryStringByName** sun.context.getQueryStringByName(name)

It will return the value of checking url.If name is null, then null will be returned.

```
 sun.context.getQueryStringByName("id");
 => 10035
```

sun.context.cookie
------------------

**set** sun.context.cookie.set(name, value)

```
sun.context.cookie.set('passId', 350350);
```

**setExpires**  sun.context.cookie.setExpires(name,value,expiresValue)

The arguments expiresValue type is int.

```
sun.context.cookie.setExpires("passId", 350350, 15);
```

**get** sun.context.cookie.get(name, value)

```
sun.context.cookie.get('passId');
=> 350350
```

**del** sun.context.cookie.del(name, value)

```
sun.context.cookie.del('passId');
```

sun.context.localStorage
------------------

**set** sun.context.localStorage.set(name, value)

```
sun.context.localStorage.set('passId', 350350);
```

**get** sun.context.localStorage.get(name, value)

```
sun.context.localStorage.get('passId');
=> 350350
```

**del** sun.context.localStorage.del(name, value)

```
sun.context.localStorage.del('passId');
```

**clearAll** sun.context.localStorage.clearAll()

```
sun.context.localStorage.clearAll();
```

sun.md
------------------

**userAgent** sun.md.userAgent

```
sun.md.userAgent
=> Mozilla/5.0 (iPod; CPU iPhone OS 6_0_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10A523 MicroMessenger/5.0
```

**screen** sun.md.screen

```
sun.md.userAgent
=> 
网页可见区域宽：980
网页可见区域高：305
网页可见区域宽：980 (包括边线和滚动条的宽)
网页可见区域高：305 (包括边线的宽)
网页正文全文宽：980
网页正文全文高：1415
网页被卷去的高(ff)：0
网页被卷去的高(ie)：0
网页被卷去的左：0
网页正文部分上：0
网页正文部分左：0
屏幕分辨率的高：568
屏幕分辨率的宽：320
屏幕可用工作区高度：548
屏幕可用工作区宽度：320
你的屏幕设置是 32 位彩色
物理像素/独立像素比: 2 像素/英寸
你的屏幕设置 undefined 像素/英寸
```

**setViewPortContent** sun.md.setViewPortContent(object)

```
sun.md.setViewPortContent({
	initWidth: 300, 
    initHeight: 600,
    isUserScale: false,
    initScale: 1.0,
    minScale: 0.1,
    maxScale: 10,
    isIntelligence: false
});

or

sun.md.setViewPortContent({ initWidth : '100%' });

or

sun.md.setViewPortContent({ initWidth : 540 });
```

**isAndroid** sun.md.isAndroid()

```
sun.md.isAndroid()
=>true/false
```

**isWindows** sun.md.isWindows()

```
sun.md.isWindows()
=>true/false
```

**isWinPhone** sun.md.isWinPhone()

```
sun.md.isWinPhone()
=>true/false
```

**isIOS** sun.md.isIOS()

```
sun.md.isIOS();
=>true/false
```

sun.util
--------

**formatIntNum** sun.util.formatIntNum(int)

```
sun.util.formatIntNum(12000);
=> '1,2000'
```

**isEven**  sun.util.isEven(int)

```
sun.util.isEven(4);
=> true
sun.util.isEven(41);
=> false
```

**getCurrentTime** sun.util.getCurrentTime([string])

```
sun.util.getCurrentTime();
=> "2013-12-04 10:49:25"
sun.util.getCurrentTime('hh:mm:ss yy/MM/dd');
=> "10:51:19 13/12/04"
```

**htmlDecode** sun.util.htmlDecode(string)

```
sun.util.htmlDecode('&lt;span&gt;I am Hero!&lt;/span&gt;');
=>"<span>I am Hero!</span>"
```

**htmlEncode** sun.util.htmlEncode(string)

```
sun.util.htmlEncode('<span>I am Hero!</span>');
=>"&lt;span&gt;I am Hero!&lt;/span&gt;"
```

**parseToInt** sun.util.parseToInt(string, defaultNum, [radix])    ---beta

If you ignore 'radix', and it will be 10 in default;

```
sun.util.parseToInt("3333", 33);
=> 3333
```

**replaceAll** sun.util.replaceAll(string, AFindText, ARepText);

```
sun.util.replaceAll('I am a boy', 'boy', 'girl');
=> "I am a girl"
```

**removeAt** sun.util.array.removeAt(arrayList, numIndex);

```
sun.util.array.removeAt([11,22,33,44], 3);
=> [11, 22, 44]
sun.util.array.removeAt([11,22,33,44], [3, 1]);
=> [22, 44]
```

**stringFormat**  sun.util.stringFormat(string, augments)

```
sun.util.stringFormat('best {0} for {1}', 'wish', 'you');
=> 'best wish for you'
```



