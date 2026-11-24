---
id: "06"
slug: "the-blue-hour"
title: "月光下的夜城"
subtitle: "Three.js WebGPU / TSL 1929 装饰派爵士酒吧与高空露台夜城 · 零照片贴图减法渲染"
date: "2026-11-24"
tags:
  - "Three.js"
  - "WebGPU"
  - "TSL"
  - "漫画渲染"
  - "Prompt工程"
  - "ArtDeco"
summary: "推开 1929 年高空爵士酒吧玻璃门走上露台，几百栋装饰派摩天大楼、琥珀碎金河面与室内 400 多个发光酒瓶全由纯代码实时绘制。拆解 MRT 漫画色带、免打光玻璃绘景、2048×1 一维河面倒影与像素级房间分区调色。"
featured: true
repo: "https://github.com/N0tANTi/the-blue-hour"
demo: "https://n0tanti.github.io/the-blue-hour/"
demoTag: "THREE.JS WEBGPU · 1929 ART DECO NOIR"
demoControls: "点击画面锁定视角 · WASD 漫步探索 · Shift 加快脚步 · Esc 暂停 · 内置 1923–1924 公版爵士老唱片配乐"
runCommand: "git clone https://github.com/N0tANTi/the-blue-hour.git && cd the-blue-hour && npm ci && npm run dev"
preview: "./previews/the-blue-hour-cover.jpg"
license: "MIT / CC0 1.0"
palette:
  - "#0C1836"
  - "#E89B4C"
  - "#4B5FA6"
  - "#16141F"
sourceMap:
  - "Module 01|WebGPU/TSL 多渲染目标后处理、硬色带、描边与空间分区调色|src/render/pipeline.ts, src/render/common.ts"
  - "Module 02|零打光「玻璃绘景」摩天夜城、跨河石桥与 2048×1 水面倒影|src/world/city.ts, src/world/looks.ts"
  - "Module 03|1929 装饰派爵士酒吧、彩绘玻璃、吧台与 400+ 酒瓶|src/world/club.ts, src/world/tableware.ts, src/world/art.ts"
  - "Module 04|乐队、吧台酒保、桌边宾客与烟丝粒子|src/world/people.ts, src/world/props.ts, src/world/fx.ts"
  - "Module 05|第一人称漫步控制、Rapier 物理碰撞与空间音频|src/player/controller.ts, src/physics/physics.ts, src/audio/club-audio.ts"
  - "Module 06|世界总装、材质系统与游戏主循环|src/world/build.ts, src/world/mats.ts, src/game.ts"
---

《月光下的夜城（The Blue Hour）》是一次极致克制的 **Graphic Noir（平面黑色漫画）** 实时渲染实验：故事停在 1929 年某个深夜的爵士酒吧，乐队正演奏着 1923–1924 年真实公版老唱片，推开玻璃门走上高空露台，一整座月光下的装饰派摩天夜城与琥珀河面尽收眼底。

全场景不依赖外部写实贴图、不跑光线追踪、甚至对岸几百栋摩天楼一盏真灯都没打——它靠 **「受光与自发光分家」「老电影玻璃绘景叠层」「1 像素一维光带伪造倒影」「像素级房间包围盒调色」** 四步减法，在浏览器里跑出极具电影质感的深夜氛围。
