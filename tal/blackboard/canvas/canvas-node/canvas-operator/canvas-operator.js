"use strict";
// import baseCss from './index.module.css'
/**
 * 画布操作框 移动 旋转 缩放
 * @method show 显示画布操作框
 * @method hide 隐藏画布操作框
 * @method
 */
exports.__esModule = true;
var CanvasOperator = /** @class */ (function () {
    function CanvasOperator() {
        this.createOperator();
    }
    CanvasOperator.prototype.createOperator = function () {
        var canvasOperatorElements = "\n    <div id=\"shape-control-content\" tabindex=\"0\">\n\n    </div>\n  ";
        var div = document.createElement('div');
        div.innerHTML = canvasOperatorElements;
        document.getElementsByTagName('body')[0].appendChild(div);
    };
    CanvasOperator.prototype.show = function (pos) {
    };
    CanvasOperator.prototype.hide = function () {
    };
    return CanvasOperator;
}());
exports["default"] = CanvasOperator;
