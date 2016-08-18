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


    touch.on(Object)

来绑定事件

####  支持的配置项(config)和事件列表(on)

- config

属性 | 含义  |  类型
---|---|---
longTapTime | 触发longTap事件的时间(毫秒),默认700ms |  Number
doubleTapTime | 在多少毫秒内连续点击两次屏幕,触发doubleTap,默认400ms  | Number

- on

属性 | 含义  |  类型
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

#### 在线体验

扫描下方二维码或者手机直接访问https://rwson.github.io/Toucher/

![QR Code](img/demo.png)

- 参考腾讯AlloyTeam手势库[AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)实现
