/**
 * Toucher
 * build by rwson @8/15/16
 * mail:rw_Song@sina.com
 */

"use strict";

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], function() {
            return factory(root);
        });
    } else {
        root.Toucher = factory(root);
    }
}(window, function(root, undefined) {

    if (!"ontouchstart" in window) {
        return;
    }

    var _wrapped;

    //  获取对象上的类名
    function typeOf(obj) {
        return Object.prototype.toString.call(obj).toLowerCase().slice(8, -1);
    }

    //  获取当前时间戳
    function getTimeStr() {
        return +(new Date());
    }

    //  获取位置信息
    function getPosInfo(ev) {
        var _touches = ev.touches;
        if (!_touches || _touches.length === 0) {
            return;
        }
        return {
            pageX: ev.touches[0].pageX,
            pageY: ev.touches[0].pageY,
            clientX: ev.touches[0].clientX || 0,
            clientY: ev.touches[0].clientY || 0
        };
    }

    //  绑定事件
    function bindEv(el, type, fn) {
        if (el.addEventListener) {
            el.addEventListener(type, fn, false);
        } else {
            el["on" + type] = fn;
        }
    }

    //  解绑事件
    function unBindEv(el, type, fn) {
        if (el.removeEventListener) {
            el.removeEventListener(type, fn, false);
        } else {
            el["on" + type] = fn;
        }
    }

    //  获得滑动方向
    function getDirection(startX, startY, endX, endY) {
        var xRes = startX - endX;
        var xResAbs = Math.abs(startX - endX);
        var yRes = startY - endY;
        var yResAbs = Math.abs(startY - endY);
        var direction = "";

        if (xResAbs >= yResAbs && xResAbs > 25) {
            direction = (xRes > 0) ? "Right" : "Left";
        } else if (yResAbs > xResAbs && yResAbs > 25) {
            direction = (yRes > 0) ? "Down" : "Up";
        }
        return direction;
    }

    //  取得两点之间直线距离
    function getDistance(startX, startY, endX, endY) {
        return Math.sqrt(Math.pow((startX - endX), 2) + Math.pow((startY - endY), 2));
    }

    function getLength(pos) {
        return Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2));
    }

    function cross(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    }

    //  取向量
    function getVector(startX, startY, endX, endY) {
        return (startX * endX) + (startY * endY);
    }

    //  获取角度
    function getAngle(v1, v2) {
        var mr = getLength(v1) * getLength(v2);
        if (mr === 0) {
            return 0
        };
        var r = getVector(v1.x, v1.y, v2.x, v2.y) / mr;
        if (r > 1) {
            r = 1;
        }
        return Math.acos(r);
    }

    //  获取旋转的角度
    function getRotateAngle(v1, v2) {
        var angle = getAngle(v1, v2);
        if (cross(v1, v2) > 0) {
            angle *= -1;
        }
        return angle * 180 / Math.PI;
    }

    //  包装一个新的事件对象
    function wrapEvent(ev, obj) {
        var res = {
            touches: ev.touches,
            type: ev.type
        };
        if (typeOf(obj) === "object") {
            for (var i in obj) {
                res[i] = obj[i];
            }
        }
        return res;
    }

    //  构造函数
    function Toucher(selector) {
        return new Toucher.fn.init(selector);
    }

    Toucher.fn = Toucher.prototype = {

        //  修改原型构造器
        constructor: Toucher,

        //  初始化方法
        init: function(selector) {
            this.el = document.querySelector(selector) || document.body;
            this.isDoubleTap = false;
            this.triggedSwipeStart = false;
            this.triggedLongTap = false;
            this.delta = null;
            this.last = null;
            this.now = null;
            this.tapTimeout = null;
            this.singleTapTimeout = null;
            this.longTapTimeout = null;
            this.swipeTimeout = null;
            this.startPos = {};
            this.endPos = {};
            this.preTapPosition = {};

            this.cfg = {
                doubleTapTime: 400,
                longTapTime: 700
            };

            //  支持的事件列表
            this.singleTap = function() {};
            this.doubleTapTime = function() {};
            this.longTap = function() {};
            this.swipe = function() {};
            this.swipeStart = function() {};
            this.swipeEnd = function() {};
            this.swipeUp = function() {};
            this.swipeRight = function() {};
            this.swipeDown = function() {};
            this.swipeLeft = function() {};

            //  绑定4个事件
            bindEv(this.el, "touchstart", this._start.bind(this));
            bindEv(this.el, "touchmove", this._move.bind(this));
            bindEv(this.el, "touchcancel", this._cancel.bind(this));
            bindEv(this.el, "touchend", this._end.bind(this));
            return this;
        },

        //  提供config方法进行配置
        config: function(option) {
            if (typeOf(option) !== "object") {
                throw new Error("method Toucher.config must pass in an anguments which is an instance of Object, but passed in " + option.toString());
            }
            for (var i in option) {
                this.cfg[i] = option[i];
            }
            return this;
        },

        //  on方法绑定事件
        on: function(name, callback) {
            if (typeOf(callback) === "function") {
                this[name] = callback;
            }
            return this;
        },

        //  手指刚触碰到屏幕
        _start: function(ev) {
            if (!ev.touches || ev.touches.length === 0) {
                return;
            }

            var self = this;

            self.now = getTimeStr();
            self.startPos = getPosInfo(ev);
            self.delta = self.now - (self.last || self.now);
            self.triggedSwipeStart = false;
            self.triggedLongTap = false;

            //  快速双击
            if (JSON.stringify(self.preTapPosition).length > 2 && self.delta < self.cfg.doubleTapTime && getDistance(self.preTapPosition.clientX, self.preTapPosition.clientY, self.startPos.clientX, self.startPos.clientY) < 25) {
                self.isDoubleTap = true;
            }

            //  长按定时
            self.longTapTimeout = setTimeout(function() {
                _wrapped = {
                    el: self.el,
                    type: "longTap",
                    timeStr: getTimeStr(),
                    position: self.startPos
                };
                self.longTap(_wrapped);
                self.triggedLongTap = true;
            }, self.cfg.longTapTime);

            //  多个手指放到屏幕
            if (ev.touches.length > 1) {
                self._cancelLongTap();
            }

            self.last = self.now;
            self.preTapPosition = self.startPos;

            ev.preventDefault();
        },

        //  手指在屏幕上移动
        _move: function(ev) {
            if (!ev.touches || ev.touches.length === 0) {
                return;
            }

            var v;
            var self = this;
            var len = ev.touches.length;
            var posNow = getPosInfo(ev);
            var currentX = posNow.pageX;
            var currentY = posNow.pageY;

            //  手指移动取消长按事件
            self._cancelLongTap();

            //  一次按下抬起只触发一次swipeStart
            if (!self.triggedSwipeStart) {
                _wrapped = {
                    el: self.el,
                    type: "swipetart",
                    timeStr: getTimeStr(),
                    position: posNow
                };
                self.swipeStart(_wrapped);
                self.triggedSwipeStart = true;
            } else {
                _wrapped = {
                    el: self.el,
                    type: "swipe",
                    timeStr: getTimeStr(),
                    position: posNow
                };
                self.swipe(_wrapped);
            }

            //  缩放,旋转
            if (len > 1) {
                ev.preventDefault();
            }

            self.endPos = posNow;
        },

        //  触碰取消
        _cancel: function(ev) {
            clearTimeout(this.longTapTimeout);
            clearTimeout(this.tapTimeout);
            clearTimeout(this.swipeTimeout);
            clearTimeout(self.singleTapTimeout);
        },

        //  手指从屏幕离开
        _end: function(ev) {
            if (!ev.changedTouches) {
                return;
            }

            //  取消长按
            this._cancelLongTap();

            var self = this;
            var direction = getDirection(self.endPos.clientX, self.endPos.clientY, self.startPos.clientX, self.startPos.clientY);
            var callback;

            if (direction !== "") {
                self.swipeTimeout = setTimeout(function() {
                    _wrapped = wrapEvent(ev, {
                        el: self.el,
                        type: "swipe",
                        timeStr: getTimeStr(),
                        position: self.endPos
                    });
                    self.swipe(_wrapped);

                    //  获取具体的swipeXyz方向
                    callback = self["swipe" + direction];
                    if (typeOf(callback) === "function") {
                        _wrapped = wrapEvent(ev, {
                            el: self.el,
                            type: "swipe" + direction,
                            timeStr: getTimeStr(),
                            position: self.endPos
                        });
                        callback(_wrapped);
                    }
                }, 0);
            } else if(!self.triggedLongTap) {
                self.tapTimeout = setTimeout(function() {
                    if (self.isDoubleTap) {
                        _wrapped = wrapEvent(ev, {
                            el: self.el,
                            type: "doubleTap",
                            timeStr: getTimeStr(),
                            position: self.startPos
                        });
                        self.doubleTap(_wrapped);
                        clearTimeout(self.singleTapTimeout);
                        self.isDoubleTap = false;
                    } else {
                        self.singleTapTimeout = setTimeout(function() {
                            _wrapped = wrapEvent(ev, {
                                el: self.el,
                                type: "singleTap",
                                timeStr: getTimeStr(),
                                position: self.startPos
                            });
                            self.singleTap(_wrapped);
                        }, 200);
                    }
                }, 0);
            }

            this.startPos = {};
            this.endPos = {};
        },

        //  取消长按定时器
        _cancelLongTap: function() {
            if (typeOf(this.longTapTimeout) !== "null") {
                clearTimeout(this.longTapTimeout);
            }
        }
    };

    Toucher.fn.init.prototype = Toucher.fn;

    return Toucher;

}));
