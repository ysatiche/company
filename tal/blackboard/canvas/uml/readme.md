# canvas 重构

## 对象

- `hand-writting.ts` 整体笔记操作文件, 入口文件


- `element-base.ts` 所有笔记元素的基础类

```js
choosePen, Pen, Eraser, ControlGroup extends elementbase {}
```

## 重要数据流

### 基础笔记（画笔，橡皮）数据流

```js
startRender() -> render() -> _render(this.from)

drawbegin() -> drawing() -> drawend()

```

### 圈选

```js
elementBase(rectContainer, pointlist) -> judgeIsPointInPath()
```

### 旋转/移动/缩放

```js
elmentBase(matrix)
```

#### 流程图

旋转/移动/缩放
1.当圈选后有元素时，将 【元素从ctx取出】 再【ctxtemp中渲染，同时包含control】
2.在【drawbegin/drawing中判断是否在control下，获取点，若不在control下，则清楚ctxtemp，放回ctx渲染】
3.在【render中调用control中的矩阵数组，调用renderactive】


### 撤销/恢复

```js
historyDoc
```
