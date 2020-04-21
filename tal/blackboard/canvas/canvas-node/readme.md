# 画笔基本功能重构

使用 ts 构建代码，完成下面几部分功能。

- 画笔

- 橡皮

- 撤销/恢复

- 圈选/点选

- 单个画笔/多条笔记

- 移动/缩放等操作


## 注意点

- canvas 设置宽高 <canvas id="canvasId" width="1920" height="1080"></canvas> 不能用css设置


# 高级功能

- 插件化（几何画板，尺规，神笔等）

# TODO LIST

- ts文件怎么批量导入某一文件夹下所有的文件模块

使用 fs 相关 api 参考 helper 中的方法

- 怎么传入工厂方法给 handWritting.ts 来构造

参考 helper中的方法

- 是否需要定义 .d.ts 来申明interface class等

- 移动缩放等功能

drawend时触发编辑外框，通过对外框的几个点 绑定 dragstart, dragmove等事件，来不断触发 activeEles 的重新渲染

如何解决频繁渲染引起的卡顿？？




