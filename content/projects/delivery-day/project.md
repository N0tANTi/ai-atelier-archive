---
id: "05"
slug: "delivery-day"
title: "魔女飞行"
subtitle: "Three.js 莫比乌斯清线 & 吉卜力风格 3D 扫帚飞行 · 三套实时画风 · 海港风车城 & 布拉格双世界"
date: "2026-11-24"
tags:
  - "Three.js"
  - "莫比乌斯清线"
  - "吉卜力"
  - "GLSL"
  - "Prompt工程"
  - "WebAudio"
summary: "零外部模型、零贴图、零音频文件的纯代码 Three.js 3D 飞行体验：小魔女与黑猫驾扫帚掠过地中海悬崖海港风车城与布拉格伏尔塔瓦河谷，支持 1/2/3 键实时无刷新切换莫比乌斯清线、吉卜力晴夏与金色黄昏三套美术风格。"
featured: true
repo: "https://github.com/N0tANTi/delivery-day-moebius"
demo: "https://n0tanti.github.io/delivery-day-moebius/"
demoTag: "THREE.JS · MOEBIUS LIGNE CLAIRE & GHIBLI"
demoControls: "W/S 调速 · A/D 压坡转弯 · Space/Shift 爬升下降 · 1/2/3 切换三画风 · C 切机位 · P 自动巡航 · H 隐藏 UI · M 静音"
runCommand: "git clone https://github.com/N0tANTi/delivery-day-moebius.git && cd delivery-day-moebius && python -m http.server 8080"
preview: "./previews/delivery-day-cover.jpg"
license: "MIT / Open Source"
palette:
  - "#7EC8C3"
  - "#D66345"
  - "#D93B3B"
  - "#5B4B6B"
sourceMap:
  - "Module 01|飞行操控、软碰撞、三机位平滑跟随与巡航|src/main.js, src/util.js"
  - "Module 02|莫比乌斯 / 吉卜力 / 金色黄昏三套实时画风系统|src/styles.js, src/toon.js"
  - "Module 03|清线墨线描边、交叉排线阴影与纸纹后处理|src/post.js"
  - "Module 04|天幕渐变、巨行星轨道弧、积云与灯塔体积光束|src/atmosphere.js"
  - "Module 05|小魔女、红丝带、动态百褶裙、雕木扫帚与黑猫|src/rider.js"
  - "Module 06|地中海海港风车城 & 布拉格河谷双程序世界|src/world.js, src/prague.js"
  - "Module 07|纯 Web Audio 风声、海鸥、钟声与电车铃声合成|src/audio.js, PROMPT.md"
---

《魔女飞行（Delivery Day · Moebius & Ghibli Edition）》是一次 100% 纯代码驱动的风格化 3D 飞行实验——场景中**没有任何外部 3D 模型、照片贴图或音频文件**，从每一片陶红屋瓦到海风呼啸与教堂钟声，全部由 Three.js、GLSL 着色器与 Web Audio API 实时生成。

按下键盘 `1 / 2 / 3` 可在飞行途中零延迟切换 **莫比乌斯清线（带巨型光环行星、细梅紫墨线与交叉排线）**、**吉卜力晴夏（蔚蓝晴空与水粉软云）** 和 **金色黄昏（液态金海面、体积灯塔光束与满城灯火）** 三套美术体系，还可在「地中海海港风车城」与「布拉格百塔河谷」两座完整程序化城市间自由切换。
