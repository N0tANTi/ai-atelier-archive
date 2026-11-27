---
id: "12"
slug: "inkbound-wilderlight"
title: "墨林残枫 · INKBOUND"
subtitle: "Three.js WebGL2 东方水墨电影视觉二创版（Wilderlight Remix）· 五幕自动观影与手动动作游玩 · 飞白毛笔特效"
date: "2026-11-27"
tags:
  - "Three.js"
  - "WebGL2"
  - "东方水墨"
  - "后处理管线"
  - "动作游戏"
  - "GLSL着色器"
summary: "基于开源项目 Wilderlight（MIT）深度重构的东方水墨电影交互体验：将白桦林重绘为素雪墨林、残枫血月与黑泽留朱三重影调，搭载真实浅景深、宽银幕光晕、2.39:1 画幅与自定义 GLSL 飞白毛笔技能着色器，支持自动五幕观影与 WASD 手动入林对决。"
featured: true
repo: "https://github.com/N0tANTi/inkbound-wilderlight"
demo: "https://n0tanti.github.io/inkbound-wilderlight/"
demoTag: "THREE.JS WEBGL2 · ORIENTAL INK-WASH CINEMA"
demoControls: "点「观 影」进入无 UI 五幕电影运镜 · 点「入 林」手动游玩：WASD 移动 · 空格闪避 · 鼠标/技能键施放飞白墨焰斩 · Esc 暂停"
runCommand: "git clone https://github.com/N0tANTi/inkbound-wilderlight.git && cd inkbound-wilderlight && py -3 start.py"
downloads:
  - "1080p 电影演示成片 MP4（含古琴/尺八/太古战鼓原声）|https://github.com/N0tANTi/inkbound-wilderlight/raw/main/docs/inkbound-cinema-demo.mp4"
preview: "./previews/inkbound-cover.jpg"
license: "MIT License (Wilderlight Remix)"
palette:
  - "#1B1D20"
  - "#C93B2B"
  - "#E6E4DF"
  - "#4F6457"
sourceMap:
  - "Ink World & Lighting|素雪墨林、残枫血月与黑泽留朱影调、昼夜大气与动态光照过渡|src/original-world.js, src/night-lighting.js, src/night-atmosphere.js, src/forest-culling.js"
  - "Cinema Director|五幕自动电影运镜、低机位跟拍、升格慢动作特写与 2.39:1 宽银幕调度|src/cinema-director.js, src/scene.js, app.js"
  - "Brush VFX Shaders|飞白毛笔旋风斩、剑气飘带、焦墨火阵、灼烧与 Boss 预警着色器|src/advanced-effects.js, src/effects.js, src/cel-flame.js, src/burn-effects.js, src/skill-drawing.js"
  - "Combat & Boss|核心模拟循环、角色对象池、动作战斗判定、Boss 规则与成长进度|src/core.js, src/simulation.js, src/combat-rules.js, src/boss-rules.js, src/actor-pool.js, src/progression.js"
  - "Audio & Runtime|章节古琴/尺八/战鼓配乐调度、浏览器音频桥接与零构建本地服务|src/chapter-music.js, src/audio.js, browser-audio.js, start.py, index.html"
---

《墨林残枫（INKBOUND）》是基于开源 WebGL 动作冒险项目 [Wilderlight](https://github.com/awplanets/Wilderlight)（MIT）打造的 **东方水墨电影视觉二创版**，零构建依赖即可在浏览器中实时运行。

作品将原本的奇幻白桦林全面重构为 **「素雪墨林 → 残枫血月 → 黑泽留朱」** 三段式东方影调：宣纸霜雪覆地、焦墨枯干参天、朱砂残枫随风飞舞，叠加 2.39:1 宽银幕遮幅、浅景深虚化、胶片颗粒与自定义 GLSL 飞白毛笔特效。既可点击 **「观 影」** 欣赏五幕全自动导演运镜（含升格慢动作与玄骨魔将对决），也可点击 **「入 林」** 亲自操控角色闪避挥斩。
