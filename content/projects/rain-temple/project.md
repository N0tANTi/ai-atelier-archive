---
id: "02"
slug: "rain-temple"
title: "雨过山寺"
subtitle: "Three.js 武侠水彩 3D 互动 Demo · 拨动竹槽引水上色 · 配乐《过桥听雨》"
date: "2026-11-22"
tags:
  - "Three.js"
  - "水彩渲染"
  - "武侠风"
  - "GLSL"
  - "WebAudio"
summary: "以纯代码驱动的武侠水彩互动场景：初始全场景呈现宣纸铅笔线稿，拨动竹槽引水过廊桥后，水彩颜料沿建筑与苍松根部实时向上晕染上色，伴随配乐《过桥听雨》及实时合成的雨声、滴水与铜铃声。"
featured: true
repo: "https://github.com/N0tANTi/rain-temple-wuxia"
demo: "https://n0tanti.github.io/rain-temple-wuxia/"
demoTag: "THREE.JS · WATERCOLOR WASH SHADER"
demoControls: "点击竹槽或按 E 引水开声 · 拖动环视 · 滚轮缩放 · R 重置 · 点击「观看短片」自动运镜游览"
preview: "./previews/rain-temple-cover.jpg"
license: "MIT / CC0 1.0"
palette:
  - "#31554B"
  - "#914631"
  - "#B69D74"
  - "#F6F1E6"
sourceMap:
  - "Module 01|铅笔线稿、宣纸肌理与水彩扩散着色器|src/wash.js, src/pencil.js, src/page.js"
  - "Module 02|主入口、相机运镜与引水事件编排|src/rain-temple.js, src/noise.js"
  - "Module 03|程序化山寺亭台、廊桥与引水竹槽|src/temple.js, src/shape.js"
  - "Module 04|远山烟岚、雨势与奔涌水流系统|src/temple-weather.js"
  - "Module 05|武侠行者、竹编斗笠、背负佩剑与 2-Bone IK|src/wayfarer.js, src/figure/man.js"
  - "Module 06|配乐《过桥听雨》与实时雨滴铜铃音效|src/temple-sound.js"
---

《雨过山寺》是一次围绕「从线稿到设色」视觉叙事展开的 WebGL 风格化实验。

与常规一开始就全彩渲染的 3D 场景不同，进入山寺时画面只铺开宣纸纸白与石墨铅笔线稿；直到访客点击竹槽或按下 `E` 键，行者伸手拨动竹槽引清泉流过廊桥，水彩才以地面时间图为原点，沿山寺檐柱与苍松根部逐寸浸润晕开。
