---
id: "04"
slug: "watercolour"
title: "水彩漫开"
subtitle: "Three.js 宣纸铅笔素描森林 · 小红帽脚步水彩实时晕开与深度感知湿画法（~650,000 笔触）"
date: "2026-11-23"
tags:
  - "Three.js"
  - "水彩渲染"
  - "GLSL"
  - "Prompt工程"
  - "湿画法"
summary: "一片以纯白水彩纸与黑白铅笔素描开场的 Three.js 3D 森林：操作红斗篷女孩踏过林间小径与溪流石阶，颜料以不规则湿边从脚下向外漫开、顺着树根攀爬点亮枝叶与花海，走到终点樱花树时触发覆盖全境的水彩浪潮。"
featured: true
repo: "https://github.com/N0tANTi/watercolour-walk"
demo: "https://n0tanti.github.io/watercolour-walk/"
demoTag: "THREE.JS · 650K WATERCOLOUR DABS"
demoControls: "点击锁定视角 · WASD 移动 · Shift 奔跑 · Space 跳跃 · 滚轮拉近拉远 · H 隐藏提示（支持 ?painted / ?wet=0 参数）"
preview: "./previews/watercolour-cover.jpg"
license: "MIT / CC0 1.0"
palette:
  - "#C73E3A"
  - "#4A7C59"
  - "#5B7BB2"
  - "#F6F1E6"
sourceMap:
  - "Module 01|水彩时间图、万物定根扩散与点彩笔触着色器|src/wash.js, src/noise.js"
  - "Module 02|全屏宣纸肌理、铅笔外轮廓与深度感知湿画法|src/page.js, src/pencil.js"
  - "Module 03|3D 林间空地、溪流、五重远山与 65 万笔触植物|src/glade/world.js, src/shape.js"
  - "Module 04|红斗篷女孩角色缝合与披风摆动|src/hood.js, src/main.js"
  - "Module 05|角色控制器、动画状态机与 Rapier 物理碰撞|src/figure/player.js, src/figure/animator.js, src/figure/camera.js"
---

《水彩漫开（Watercolour）》不是套在现成 3D 游戏上的后期滤镜，而是一套**「先落笔素描、再随脚步着水彩」**的底层着色与几何体系。

进入林地时，眼前只有宣纸底纹、石墨暗部排线与铅笔轮廓；每踏出一步，地面到达时间图即刻记录此刻并向外泛起边缘浓深的水渍，颜料沿着每棵树的树根一路爬满树冠、点亮蓝铃花与草甸，唯有被染上颜色的草木才会开始随风摇曳、落瓣飞蝶；当你穿过溪流走上草坡触碰那棵盛开的樱花树，最后一波水彩浪潮将席卷整片山谷与五重远山。
