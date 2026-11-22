---
id: "01"
slug: "painted-valley"
title: "绿野晚霞"
subtitle: "Three.js (WebGL2 + GLSL3) 手绘动画电影风格 3D 实时探索场景"
date: "2026-11-21"
tags:
  - "Three.js"
  - "GLSL3"
  - "手绘渲染"
  - "Prompt工程"
  - "Kuwahara"
summary: "一套完整的风格化 3D 场景分阶段工程与可交互演示：从无噪点地形笔触、4 圈 LOD 风吹草海、离线烘焙天幕，到球团树冠、赛璐璐主角 Alpha 编码与分层 Kuwahara 暖墨后处理。"
featured: true
repo: "https://github.com/N0tANTi/painted-valley-sunset"
demo: "https://n0tanti.github.io/painted-valley-sunset/"
demoTag: "LIVE 3D RUNTIME · THREE.JS WEBGL2"
demoControls: "点击画面开始漫游 · WASD 移动 · T 切换 4 套时间色板 · V 切换第一人称视角"
preview: "./previews/painted-valley-sunset.jpg"
license: "MIT / CC0 1.0"
specimens: "painted-valley"
palette:
  - "#5A7D5E"
  - "#3A6B8C"
  - "#FA551E"
  - "#1E1919"
sourceMap:
  - "Stage 1|地形骨架、山谷盆地与 512px 无缝笔触贴图|src/valley/world.js, src/valley/strokes.js, src/valley/floor.js"
  - "Stage 2|4 圈 LOD 实例化草海与滚动风场|src/lib/blades.js, src/lib/ground.js, src/lib/flowers.js"
  - "Stage 3|离线烘焙天空、体积积雨云与 360° 分面远山|src/valley/sky.js, src/valley/clouds.js, src/valley/backdrop.js, src/valley/horizon.js"
  - "Stage 4|球团树冠、树荫阴影图与程序化远景村庄|src/valley/trees.js, src/valley/farwoods.js, src/valley/village.js"
  - "Stage 5|赛璐璐主角、实时布料披风与 Alpha 通道编码|src/valley/wanderer.js, src/figure/cloak.js, src/figure/man.js"
  - "Stage 6|分层 Kuwahara、深度暖墨描边与 4 套时间色板|src/lib/frame.js, src/lib/glsl.js, src/valley/main.js"
---

本项目探索如何用纯代码（Three.js + WebGL2 + GLSL3）在浏览器中实时还原「手绘动画电影」的视觉质感。

核心管线分为 6 个递进阶段：背景环境通过程序化笔触贴图、4 圈 LOD 实例化草海与分层 Kuwahara 滤镜呈现水粉厚涂质感；主角则通过三阶赛璐璐平涂、实时布料披风与深度感知暖墨描边保持清晰轮廓，两者借助 `outColor.a` 通道编码在同一渲染管线中和谐共存。
