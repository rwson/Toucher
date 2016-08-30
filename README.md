### Toucher

移动端手势库

#### API
        
    Toucher("#node").config(Object).on(Object)

        或者
        
    var toucher = Toucher("#node");
    toucher.config(Object);
    toucher.on(name, callback);
    
通过

    var toucher = Toucher(css selector);
    
来构造一个Toucher对象

用

    toucher.config(Object)
    
来配置相关事件的触发条件


    touch.on(name, callbck);
    
或

    touch.on(name, target, callbck);

来绑定事件

#### 完整示例

    //  HTML
    <div id="toucher">
        <div id="event"></div>
        <ul>
            <li class="list-item"></li>
            <li class="list-item"></li>
            <li class="list-item"></li>
            <li class="list-item"></li>
            <li class="list-item"></li>
            <li class="list-item"></li>
        </ul>
    </div>
    
    
    //  javascript
    var toucher = Toucher("#toucher");
    
    //  回调函数会在任何时候被执行,只要event.target为<div>#toucher或者其子元素
    toucher.on("singleTap", function(ev) {
        //  ...
    });
    
    //  只有当event.target为<div>#event的时候,才会执行后面的回调函数
    toucher.on("singleTap", "#event", function(ev) {
        //  ...
    });
    
    //  只有当event.target为<li>.list-item的时候,才会执行后面的回调函数
    toucher.on("singleTap", document.querySelector(".list-item"), function(ev) {
        //  ...
    });
    

####  支持的配置项(config)和事件列表(on)

- config

属性 | 含义  |  类型
---|---|---
longTapTime | 触发longTap事件的时间(毫秒),默认700ms |  Number
doubleTapTime | 在多少毫秒内连续点击两次屏幕,触发doubleTap,默认400ms  | Number

- on

###### 两个参数

name属性 | 含义 |  callback类型
---|---|---
singleTap | 轻击(单个手指) |  Fucntion
doubleTap | 手指放到屏幕(单个手指) |  Fucntion
longTap | 长按 |  Fucntion
swipe | 手指在屏幕上移动 |  Fucntion
swipeStart | 手指在屏幕上移动(只触发一次) |  Fucntion
swipeEnd | 下滑 |  Fucntion
swipeUp | 左滑 |  Fucntion
swipeRight | 右滑 |  Fucntion
swipeDown | 下滑 |  Fucntion
swipeLeft | 左滑 |  Fucntion
pinch | 缩放 |  Fucntion
rotate | 旋转 |  Fucntion

###### 三个参数

name和callback和上表一样

target可以为具体的css selector, 也可以为具体的DOM元素(document.querySelector(selector)之类方法获取到的)

#### 在线体验

扫描下方二维码或者手机直接访问https://rwson.github.io/Toucher/

<img src="img/demo.png" width="50%" height="50%" />

- 参考腾讯AlloyTeam手势库[AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)实现
