---
id: "09"
slug: "the-last-star"
title: "最后一颗星 · The Last Star"
subtitle: "Blender Python 59 秒手绘绘本风 NPR 动画短片 + HTML5 Canvas 四幕交互绘本小游戏 · 原创立体声配乐"
date: "2026-11-25"
tags:
  - "Blender"
  - "Python"
  - "NPR绘本"
  - "HTML5游戏"
  - "WebAudio"
  - "程序化生成"
summary: "以法式水粉绘本与墨线描边打造的 59 秒纯代码 2.5D NPR 动画短片（10 个分镜 / 1,416 帧），同步制作零依赖 HTML5 Canvas 四幕交互绘本小游戏：操控单眼提灯机器人推开暮色天文台、唤醒双球星象仪、亲手连出星座座头鲸与三层极光，并接住最后一颗星。"
featured: true
repo: "https://github.com/N0tANTi/the-last-star"
demo: "https://n0tanti.github.io/the-last-star/"
demoTag: "HTML5 CANVAS GAME · BLENDER 5.2 NPR FILM"
demoControls: "A/D 或 ←/→ 移动机器人 · 点击或按空格点亮 7 枚黄铜星辰镜头 · 划过夜空星点连线召唤星鲸与极光 · 内置 Web Audio 实时竖琴/钢片琴配乐"
runCommand: "git clone https://github.com/N0tANTi/the-last-star.git && cd the-last-star && .\\render.ps1 -Mode preview -Width 960 -Height 540 -Samples 16"
downloads:
  - "59 秒高清中文动画短片 MP4 (23.7MB)|https://github.com/N0tANTi/the-last-star/releases/download/v1.0.0/TheLastStar.mp4"
  - "GitHub Release v1.0.0|https://github.com/N0tANTi/the-last-star/releases/tag/v1.0.0"
preview: "./previews/the-last-star-cover.jpg"
license: "Open Source"
palette:
  - "#2B3C63"
  - "#7FE5D0"
  - "#A888D8"
  - "#F7D98C"
sourceMap:
  - "Interactive Game|零依赖 HTML5 Canvas 四幕绘本交互小游戏与 Web Audio 竖琴/钢片琴合成|docs/index.html"
  - "NPR Shader|法式水粉 2.5D NPR 着色器（ShaderToRGB + 墨线描边 + 合成器星芒）|src/npr.py"
  - "Character|单眼圆头小机器人与提灯程序化建模及肢体动画|src/robot.py"
  - "Observatory|暮色天文台外景/内景、穹顶天窗与双球蔡司星象仪建模|src/observatory.py"
  - "Celestial FX|银河星尘涡流、30 点平滑星座座头鲸、三层极光与中文手写片尾|src/fx.py"
  - "Cinematography|全片 10 个分镜编排（00:00–00:59 @ 24fps = 1,416 帧）与渲染封装|src/shots.py, src/pipeline.py, render.ps1"
  - "Audio Engine|纯 NumPy 合成 59 秒立体声配乐与同步音效|src/sound.py"
---

《最后一颗星（The Last Star）》是一部兼具 **59 秒纯代码 Blender 5.2 NPR 动画短片** 与 **浏览器即玩 HTML5 Canvas 绘本小游戏** 的双形态原创作品。

视觉采用法式水粉 / 绘本插画风 2.5D NPR（`ShaderToRGB` 色阶 + 墨线描边 + 合成器星芒），讲述一只提着暖灯的单眼小机器人走入暮色天文台、唤醒双球星象仪、让银河星流涌出穹顶化作三层极光与星座座头鲸，并在石廊上接住最后一颗星的治愈故事。站内可直接试玩四幕互动版本（内置 Web Audio 实时竖琴/钢片琴配乐），也可一键下载 59 秒中文高清有声成片。
