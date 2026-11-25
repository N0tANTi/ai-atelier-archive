---
id: "07"
slug: "moonmere"
title: "月夜城堡 · 月沼白堡"
subtitle: "Three.js WebGL2 月夜水园实时场景（Moonmere）· 平面镜面倒影 · 四步复刻提示词与静态参考图"
date: "2026-11-24"
tags:
  - "Three.js"
  - "WebGL2"
  - "Blender"
  - "水面倒影"
  - "Prompt工程"
  - "月夜建筑"
summary: "一座完全由代码实时渲染的月夜水园：前景发光白睡莲与阔叶框出暗水通道，视线穿过中景三联拱廊直抵林间升起的哥特白堡。涵盖 Blender 灰模定构图、Three.js 石雕与花瓣几何重建、1024×1024 平面镜像反射、离屏月夜调色开关与单文件离线打包。"
featured: true
repo: "https://github.com/N0tANTi/moonmere-three"
demo: "https://n0tanti.github.io/moonmere-three/"
demoTag: "THREE.JS WEBGL2 · MOONLIT WATER GARDEN"
demoControls: "拖动底部进度条切换白堡全景与池边近景 · 拖动画面环视细节 · 暂停后点「调色」实时对比受光叶簇与林下深影"
runCommand: "git clone https://github.com/N0tANTi/moonmere-three.git && cd moonmere-three && npm ci --prefix scene/moonmere_three && node scene/moonmere_three/build.mjs --engraved"
downloads:
  - "参考图 01 · 空间与构图|https://github.com/N0tANTi/moonmere-three/releases/download/v1.0.0/01-framing.jpg"
  - "参考图 02 · 白堡石雕细节|https://github.com/N0tANTi/moonmere-three/releases/download/v1.0.0/02-stone.jpg"
  - "参考图 03 · 睡莲与暗水倒影|https://github.com/N0tANTi/moonmere-three/releases/download/v1.0.0/03-lily-pond.jpg"
  - "参考图 04 · 月光树影对比|https://github.com/N0tANTi/moonmere-three/releases/download/v1.0.0/04-shadow.jpg"
  - "GitHub Release v1.0.0|https://github.com/N0tANTi/moonmere-three/releases/tag/v1.0.0"
preview: "./previews/moonmere-cover.jpg"
license: "Open Source / Three.js MIT"
palette:
  - "#0E161A"
  - "#DCE4EC"
  - "#5A7D38"
  - "#2C3B28"
sourceMap:
  - "Stage 01|主场景总装、相机路径、月光阴影与观察视图|scene/moonmere_three/scene.js, scene/moonmere_three/viewer.html"
  - "Stage 02|白堡主窗竖梃、圆塔浮雕与三联拱廊几何生成|scene/moonmere_three/architecture.js, scene/moonmere_three/castle-ornament.js"
  - "Stage 03|四圈弯曲睡莲瓣、成群浮叶、林冠与崖壁藤蔓|scene/moonmere_three/garden.js, scene/moonmere_three/sky.js"
  - "Stage 04|1024×1024 平面镜像反射、交错波纹扰动与离屏调色|scene/moonmere_three/water.js, scene/moonmere_three/finish.js"
  - "Build|esbuild 单文件打包器（支持基础版 / --refined / --engraved）|scene/moonmere_three/build.mjs, scene/moonmere_three/capture.mjs"
  - "Blender|早期 Blender 5.2 空间灰模与分模块构建脚本|scene/build_moonmere.py, scene/moonmere_castle.py, scene/moonmere_grove.py, scene/moonmere_land.py, scene/moonmere_sky.py"
---

《月夜城堡 · 月沼白堡（Moonmere）》是一次从 **Blender 灰模构图推敲 → Three.js 纯代码实时渲染** 的完整空间与光影实验。

画面由清晰的三层纵深构成：近处左下方一朵四圈透光薄瓣的白睡莲与阔叶形成画框，中央暗水带与交错浮叶将视线穿过三联石拱廊，最终落在从柏树林冠中升起的哥特式石灰岩白堡与星月夜空上。所有石雕、窗饰、枝叶、星点与水面镜像倒影均由代码实时生成，并支持在同一视角下实时开关全屏月夜调色，逐项验收受光叶簇与林下深影的对比。
