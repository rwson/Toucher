/**
 * 结合Toucher的demo
 */

"use strict";

window.onload = function() {

    var prefixs = ["Webkit", "Moz", "Ms", "O", ""];
    var screenWidth = window.innerWidth;

    //  x-slider
    var xSElToucher = Toucher("#x-slider-container");
    var xSEl = document.querySelector("#x-slider");
    var xSTransIndex = 0;
    var xSTransform;

    xSElToucher
        .on("swipeLeft", function(e) {
            xSTransIndex--;
            if (xSTransIndex < -2) {
                xSTransIndex = -2;
                return;
            }
            xSTransform = "translate3d(" + xSTransIndex * screenWidth + "px, 0px, 0px)";
            setTranstion(xSEl, "all 0.3s cubic-bezier(0.1, 0.57, 0.1, 1)");
            setTransform(xSEl, xSTransform);
        })
        .on("swipeRight", function(e) {
            xSTransIndex++;
            if (xSTransIndex > 0) {
                xSTransIndex = 0;
                return;
            }
            xSTransform = "translate3d(" + xSTransIndex * screenWidth + "px, 0px, 0px)";
            setTranstion(xSEl, "all 0.3s cubic-bezier(0.1, 0.57, 0.1, 1)");
            setTransform(xSEl, xSTransform);
        });

    //  y-slider
    var ySElToucher = Toucher("#y-slider-container");
    var ySEl = document.querySelector("#y-slider");
    var moveHeight = ySEl.children[0].offsetHeight;
    var ySTransIndex = 0;
    var ySTransform;

    ySElToucher
        .on("swipeUp", function(e) {
            ySTransIndex--;
            if (ySTransIndex < -2) {
                ySTransIndex = -2;
                return;
            }
            ySTransform = "translate3d(0px, " + ySTransIndex * moveHeight + "px, 0px)";
            setTranstion(ySEl, "all 0.3s cubic-bezier(0.1, 0.57, 0.1, 1)");
            setTransform(ySEl, ySTransform);
        })
        .on("swipeDown", function(e) {
            ySTransIndex++;
            if (ySTransIndex > 0) {
                ySTransIndex = 0;
                return;
            }
            ySTransform = "translate3d(0px, " + ySTransIndex * moveHeight + "px, 0px)";
            setTranstion(ySEl, "all 0.3s cubic-bezier(0.1, 0.57, 0.1, 1)");
            setTransform(ySEl, ySTransform);
        });

    //  pinch
    var pinchToucher = Toucher("#pinch-container");
    var pinchEl = document.querySelector("#pinch-img-item");
    var pinchTransform, scale;

    pinchToucher.on("pinch", function(e) {
        scale = e.scale;
        if (scale < 0.4) {
            return;
        } else if (scale > 2.5) {
            return;
        }

        pinchTransform = "scale3d(" + scale + ", " + scale + ", 1)";
        setTransform(pinchEl, pinchTransform);
    });

    //  rotate
    var rotateToucher = Toucher("#rotate-container");
    var rotateEl = document.querySelector("#rotate-container");
    var rotateTransform, angle;

    rotateToucher.on("rotate", function(e) {
        angle = e.angle;
        rotateTransform = "rotate(" + angle + "deg)";
        setTransform(rotateEl, rotateTransform);
    });

    //  设置元素的transition样式
    function setTranstion(el, style) {
        prefixs.forEach(function(prefix) {
            el.style[prefix + "Transition"] = style;
        });
    }

    //  设置元素的transform样式
    function setTransform(el, style) {
        el.style.transform = style;
    }

    //  获取元素的transform样式,并以对象的形式返回,只判断了少量情况
    function getTransform(el) {
        var curTransform, res, replaced, transName, matrixObj, _tmp,
            transReg = /^[\w\W]+\(/g,
            endBrackets = /\($/,
            elStyle = el.style;
        curTransform = el.transform || elStyle.webkitTransform || elStyle.mozTransform || elStyle.oTransform || elStyle.msTransform;

        if (curTransform) {
            res = {};
            curTransform.split(") ").forEach(function(item) {
                _tmp = {};
                transName = item.match(transReg)[0].replace("(", "");
                replaced = item.replace(transReg, "").replace(endBrackets, "");
                switch (transName) {
                    case "translate3d":
                    case "rotate3d":
                        replaced = replaced.split(",");
                        _tmp["x"] = parseFloat(replaced[0] || 0);
                        _tmp["y"] = parseFloat(replaced[1] || 0);
                        _tmp["z"] = parseFloat(replaced[2] || 0);
                        res[transName] = _tmp;
                        break;

                    case "scale3d":
                        replaced = replaced.split(",");
                        _tmp["x"] = parseFloat(replaced[0] || 1);
                        _tmp["y"] = parseFloat(replaced[1] || 1);
                        _tmp["z"] = parseFloat(replaced[2] || 1);
                        res[transName] = _tmp;
                        break;

                    case "scale":
                        replaced = replaced.split(",");
                        _tmp["x"] = parseFloat(replaced[0] || 1);
                        _tmp["y"] = parseFloat(replaced[1] || 1);
                        res[transName] = _tmp;
                        break;
                    case "matrix":
                        break;
                    default:
                        break;
                }
            });
        }

        return res;
    }
};
