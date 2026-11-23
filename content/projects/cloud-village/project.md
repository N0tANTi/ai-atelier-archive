---
id: "03"
slug: "cloud-village"
title: "天空之城"
subtitle: "Blender Python 程序化 19 秒水彩浮岛动画（The Cloud Road）· 五段运镜 · 原创代码配乐"
date: "2026-11-23"
tags:
  - "Blender"
  - "Python"
  - "水彩动画"
  - "Prompt工程"
  - "程序化生成"
summary: "一部完全由 Blender Python 与 NumPy 生成的 19 秒浮岛村庄水彩动画（1920×1080 / 30fps / 570 帧）：五个机位串联云海、六跨石桥、织工阳台、崖边瀑布与钟楼全景，并沉淀了从灰模到有声成片的 10 轮完整 AI 协作提示词。"
featured: true
repo: "https://github.com/N0tANTi/cloud-village-film"
video: "https://github.com/N0tANTi/cloud-village-film/releases/download/v2.0.0/cloud_village.mp4"
demoTag: "BLENDER 5.2 LTS · 19S WATERCOLOR FILM"
demoControls: "1920×1080 · 30fps · 570 帧 · EEVEE 水彩纸纹合成 · 含竖琴/木笛/钟声/风声原创立体声配乐"
runCommand: "git clone https://github.com/N0tANTi/cloud-village-film.git && cd cloud-village-film && blender --background --factory-startup --python-exit-code 1 --python scene/build_cloud_village.py -- --render"
downloads:
  - "1080p 成片 MP4|https://github.com/N0tANTi/cloud-village-film/releases/download/v2.0.0/cloud_village.mp4"
  - "可编辑 .blend 工程|https://github.com/N0tANTi/cloud-village-film/releases/download/v2.0.0/cloud_village.blend"
  - "完整素材包 ZIP|https://github.com/N0tANTi/cloud-village-film/releases/download/v2.0.0/cloud-village-prompt-kit.zip"
  - "离线图文提示词 HTML|https://github.com/N0tANTi/cloud-village-film/releases/download/v2.0.0/cloud-village-prompts.html"
preview: "./previews/cloud-village-panorama.jpg"
license: "Open Source"
palette:
  - "#5B8FB9"
  - "#C76B4A"
  - "#7B8E5B"
  - "#4E4663"
sourceMap:
  - "Module 01|五段运镜、颜料明暗、纸纹合成与视频导出|scene/build_cloud_village.py"
  - "Module 02|钟楼、半木结构住宅、六跨石桥与风车|scene/cloud_village_buildings.py"
  - "Module 03|悬崖、树冠、苔草、瀑布与落水池|scene/cloud_village_land.py"
  - "Module 04|热气球、桥下花园与崖边木台|scene/cloud_village_air.py"
  - "Module 05|环景天空与多层次云海|scene/cloud_village_sky.py"
  - "Module 06|竖琴、木笛、钟声与风声原创配乐合成|scene/cloud_village_audio.py"
  - "Docs|10 轮迭代提示词原文文档|docs/prompts.md"
---

《天空之城（云上村落 · The Cloud Road）》是一部完全由 **Blender Python + NumPy** 程序化生成的 19 秒浮岛水彩动画短片。

五个镜头从云海推入六跨石桥，掠过织工家的半木结构阳台，沿崖边瀑布直落到下层水潭小岛，最后从钟楼缓缓拉回双岛全景。所有房屋、植被、近远云层、宣纸纤维合成以及竖琴木笛配乐均由代码构建，同时完整沉淀了 **10 轮「人类定审美 + 模型写脚本执行」的迭代 Prompt 工作流**。
