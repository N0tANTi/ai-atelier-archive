---
id: "10"
slug: "cyberpunk-2099-sandbox"
title: "赛博朋克 2099 立体沙盒 · Cyberpunk 2099"
subtitle: "Three.js + WebGL2 纯代码未来摩天巨城沙盒 · 深渊全息交通轨 · 悬浮飞船空域 · 24 小时昼夜霓虹泛光"
date: "2026-11-26"
tags:
  - "Three.js"
  - "WebGL2"
  - "TypeScript"
  - "赛博朋克"
  - "城建沙盒"
  - "GLSL着色器"
summary: "纯代码驱动的 3D 赛博朋克立体摩天城市沙盒。内置 5 种 15–22 层未来摩天楼原型、四层空中连廊、深渊 3D 全息流光交通网格、巡航飞船无人机群与 24 小时昼夜霓虹泛光着色器，配备黑曜石暗色玻璃 HUD 与定制钢琴主题配乐。"
featured: true
repo: "https://github.com/N0tANTi/cyberpunk-2099-sandbox"
demo: "https://n0tanti.github.io/cyberpunk-2099-sandbox/?lang=zh"
demoTag: "THREE.JS WEBGL2 · CYBERPUNK MEGACITY SANDBOX"
demoControls: "左键放置高密度赛博街区并自动长出摩天巨塔 · 右键拆除 · 拖拽旋转/滚轮缩放 · 点击飞行按钮低空穿行摩天霓虹峡谷 · 拖动时间条切换白昼/黄昏/星夜"
runCommand: "git clone https://github.com/N0tANTi/cyberpunk-2099-sandbox.git && cd cyberpunk-2099-sandbox && npm install && npm run dev"
preview: "./previews/cyberpunk-2099-cover.jpg"
license: "MIT License (Little City Remix)"
palette:
  - "#0B1224"
  - "#00F0FF"
  - "#FF2E93"
  - "#FFB84D"
sourceMap:
  - "Cyber Sky & Bloom|24 小时昼夜大气 GLSL 着色器、真彩双环霓虹泛光与黄昏全城亮灯|src/style/palette.ts, src/style/look.ts, src/style/time.ts, src/life/dusk/window-light.behaviour.ts"
  - "Megacity Towers|5 种 15–22 层未来摩天楼、四层空中连廊、全息立柱与钛合金甲板生成|src/gen/house/house.gen.ts, src/gen/tower/tower.gen.ts, src/gen/arch/arch.gen.ts, src/gen/pillar/pillar.gen.ts"
  - "Abyss & Airspace|深渊 3D 全息流光交通网格、星际巡洋舰、悬浮飞车与无人机立体空域|src/style/ships.ts, src/style/birds.ts, src/life/birds/flight.ts, src/life/boats/floating.ts"
  - "Canyon Flight|摩天峡谷 3D 透视低空飞行穿行与镜头阻尼控制|src/fly/flight.ts, src/fly/glide.ts, src/fly/lens.ts"
  - "Obsidian HUD & BGM|赛博黑曜石毛玻璃中文 UI 与无缝循环钢琴主题配乐|src/ui/ui.css, src/app/music.ts, src/app/main.ts, src/i18n/locales/zh.json"
---

《赛博朋克 2099 立体沙盒（Cyberpunk 2099 Sandbox）》是一款基于开源城建引擎 [littlecity](https://github.com/yaoderek/littlecity)（MIT）彻底重构的 **纯代码 3D 赛博朋克立体摩天巨城沙盒**（同时对应整合源码库 [`N0tANTi/littlecity`](https://github.com/N0tANTi/littlecity) 的 `feat/cyberpunk` 分支）。

无需任何外部模型与贴图，所有 15–22 层阶梯金字塔、双鳍赛博之门、生态玻璃穹塔、霓虹广告刀锋楼、空中连廊与底部 **3D 深渊全息交通轨** 均由程序实时生成。随着 24 小时昼夜时间轴推进，金属银蓝白昼平滑过渡至银翼杀手式金红黄昏与全城千窗霓虹点亮的星夜，配合巡航飞船、黑曜石玻璃 HUD 与定制钢琴 BGM，既可俯瞰巨城拼搭，也可直接扎入摩天峡谷低空穿行。
