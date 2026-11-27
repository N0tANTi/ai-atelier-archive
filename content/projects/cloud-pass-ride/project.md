---
id: "13"
slug: "cloud-pass-ride"
title: "云隘山道 · Mist Pass"
subtitle: "Three.js WebGL2 高山石堤摩托骑行交互体验 · 56 秒晴昼/夕照/风雨/月夜动态天气 · 深度近景拖影与实时布料发丝"
date: "2026-11-27"
tags:
  - "Three.js"
  - "WebGL2"
  - "3D骑行"
  - "动态天气"
  - "后处理拖影"
  - "实时布料"
summary: "骑摩托沿高山公路驶上连续 S 弯石堤，看水库在晴昼、夕照、风雨与月夜之间 56 秒循环流转。内置深度还原近景动态拖影、骨骼驱动马尾与短披肩风动网格、实时三维流云与本机 MP3 配乐播放器，单文件离线亦可畅玩。"
featured: true
repo: "https://github.com/N0tANTi/cloud-pass-ride"
demo: "https://n0tanti.github.io/cloud-pass-ride/"
demoTag: "THREE.JS WEBGL2 · PLAYABLE MOTORCYCLE RIDE"
demoControls: "按住 W 加速 · A/D 调整横向路线 · 拖动或方向键环顾（双击/Home 复位）· 滚轮或 -/+ 变焦 · 单击或空格暂停 · 右下角音符可选本机 MP3 配乐"
runCommand: "git clone https://github.com/N0tANTi/cloud-pass-ride.git && cd cloud-pass-ride && python -m pip install -r requirements.txt && npm ci && npm run build"
preview: "./previews/cloud-pass-ride-cover.jpg"
license: "Open Source / Three.js MIT"
palette:
  - "#4A7FA7"
  - "#D98A4E"
  - "#5B8E3E"
  - "#1E2631"
sourceMap:
  - "Ride & Camera|主循环、速度曲线、跟车运镜、交互输入与深度还原近景拖影|ride.js, viewer.html"
  - "Causeway & Vista|320 米循环路线、S 弯石堤拱桥、远山剪影、水库与草坡植被|causeway.js, vista.js, meadow.js"
  - "Atmosphere|56 秒晴昼/夕照/风雨/月夜循环、三组天空球、实时三维云与路肩流雾|atmosphere.js, slipstreams.js"
  - "Rider & Physics|骑姿骨骼贴合、眨眼转头、三束发丝骨骼风动与短披肩实时布料模拟|rider.js, hair.js, mantle.js"
  - "Asset Pipeline|SHA-256 校验素材抓取、跑车与人物烘焙打包及本机音频控制|prepare_materials.py, pack_head.py, pack_models.mjs, pack_outfit.mjs, build.mjs, local_music.js"
  - "Preview & Score|无头 Chrome 720p 实录渲染与音频切片响度配乐工具|capture.mjs, score.mjs, materials.json, riding_models.json"
---

《云隘山道（Mist Pass）》是一款打开即启程的 **Three.js / WebGL2 高山石堤摩托骑行交互作品**，同时支持桌面键鼠与触屏操作。

路线以 320 米为一圈持续推进，第 78 至 179 米为连续 S 弯石堤拱桥：桥面、轮胎接地轨迹、栏柱与石拱共用同一条样条曲线，入弯按车速与曲率自动压弯倾车。画面每 56 秒完成一轮「晴昼 → 夕照 → 风雨 → 月夜」平滑演进，雨中车辙泛起湿润反光，入夜后车灯与远处山城灯火渐次亮起。骑手马尾与短披肩随车速、侧风与压弯实时翻飞，并支持加载本机 MP3 作为随骑行起停的私人配乐。
