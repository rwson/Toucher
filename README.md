### Toucher

移动端手势库

#### API
        
    Toucher("#node").config(Object).on(Object)

        或者
        
    var toucher = Toucher("#node");
    toucher.config(Object);
    toucher.on(Object);
    
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
doubleTapTime | 在多少毫秒内连续点击两次屏幕,触发doubleTap,默认300ms  | Number

- on

属性 | 含义  |  类型
---|---|---
tap | 轻击(单个手指) |  Fucntion
touchStart | 手指放到屏幕(单个手指) |  Fucntion
mutilTouchStart | 手指(多个)放到屏幕 |  Fucntion
longTap | 长按 |  Fucntion
touchMove | 手指在屏幕上移动 |  Fucntion
touchUp | 上滑 |  Fucntion
touchDown | 下滑 |  Fucntion
touchLeft | 左滑 |  Fucntion
touchRight | 右滑 |  Fucntion

参考腾讯AlloyTeam手势库[AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)

