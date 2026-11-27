---
id: "11"
slug: "monument-valley-sandbox"
title: "纪念碑谷主题沙盒 · Monument Valley"
subtitle: "Three.js + WebGL2 纯代码极简粉彩几何圣殿城建沙盒 · 圆顶穹窿 · 悬浮水域 · 3D 低空飞行穿行"
date: "2026-11-26"
tags:
  - "Three.js"
  - "WebGL2"
  - "TypeScript"
  - "纪念碑谷"
  - "城建沙盒"
  - "程序化生成"
summary: "受《纪念碑谷》启发的纯代码极简粉彩几何 3D 城建沙盒。融合象牙白、珊瑚粉、薄荷青、淡薰衣草紫与暖金圆顶，全部穹顶圣殿、拱形窗洞、极简树林与悬浮青碧水域均由程序实时生成，支持自由拼搭、一键萌芽生长、白昼/黄昏/星夜切换与 3D 低空穿行游览。"
featured: true
repo: "https://github.com/N0tANTi/monument-valley-sandbox"
demo: "https://n0tanti.github.io/monument-valley-sandbox/?lang=zh"
demoTag: "THREE.JS WEBGL2 · PASTEL GEOMETRIC SANDBOX"
demoControls: "左键点击自由放置方块并自动生长圣殿建筑 · 右键拆除 · 拖拽旋转/滚轮缩放视角 · 点击飞行按钮进入 3D 低空穿行模式 · 支持一键生长全岛与昼夜时间滑动"
runCommand: "git clone https://github.com/N0tANTi/monument-valley-sandbox.git && cd monument-valley-sandbox && npm install && npm run dev"
preview: "./previews/monument-valley-cover.jpg"
license: "MIT License (Little City Remix)"
palette:
  - "#5AB7B2"
  - "#F4A3A8"
  - "#B99CE4"
  - "#F2EDE3"
sourceMap:
  - "Pastel Aesthetic|纪念碑谷粉彩全局调色盘、极简平面光照分级与昼夜氛围流转|src/style/palette.ts, src/style/look.ts, src/style/time.ts, src/style/monuments.ts"
  - "Sacred Geometry|圆顶穹窿、拱形窗洞、几何圣殿、高塔城墙与极简树林程序化生成|src/gen/house/house.gen.ts, src/gen/tower/tower.gen.ts, src/gen/arch/arch.gen.ts, src/gen/marble/pavilion.ts, src/gen/tree/tree.gen.ts"
  - "Town Grower|规则驱动浮空岛城镇生长器与街区/广场/水岸自动布局|src/townmaker/grower.ts, src/townmaker/town.ts, src/rules/urban/U12.centre-and-edge.rule.ts"
  - "3D Flight & Camera|等轴上帝视角与 3D 第一人称低空滑翔穿行控制|src/fly/flight.ts, src/fly/glide.ts, src/fly/look.ts"
  - "App & Audio|主交互状态、多语言中文 UI 与定制静谧氛围配乐播放器|src/app/main.ts, src/app/game.ts, src/app/music.ts, src/i18n/locales/zh.json"
---

《纪念碑谷主题沙盒（Monument Valley Sandbox）》是一款基于开源城建引擎 [littlecity](https://github.com/yaoderek/littlecity)（MIT）重构的 **极简粉彩几何 3D 建筑沙盒**（同时对应整合源码库 [`N0tANTi/littlecity`](https://github.com/N0tANTi/littlecity) 的 `feat/monument-valley` 分支）。

所有建筑、圆顶穹窿、拱门阶梯、几何树木与青碧悬浮水域全部由 TypeScript 与自定义 WebGL2 / GLSL3 着色器纯代码生成，不依赖外部贴图。只需轻点几下地块即可自动演化出静谧舒展的粉彩几何圣殿，亦可随时切换至 3D 低空穿行视角步入穹顶长廊，伴随定制氛围配乐欣赏白昼、暮色与弯月星夜的柔和光影流转。
