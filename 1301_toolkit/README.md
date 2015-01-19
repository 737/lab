
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
sun.toolkit.stringFormat('{2} {0} {1}, and best {0} for {1}', 'wish', 'you', 'I'); 
=> 'I wish you, and best {0} for you'
```

