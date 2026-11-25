---
id: "08"
slug: "slackwater-fishing"
title: "浅水垂钓 · Slackwater"
subtitle: "RAEA + React + TypeScript + Blender Windows 桌面浅水垂钓游戏 · 自定义 WESL 水面 · 2-Bone IK 划桨 · 原创吉他配乐"
date: "2026-11-25"
tags:
  - "RAEA"
  - "WESL"
  - "TypeScript"
  - "Blender"
  - "独立游戏"
  - "程序化生成"
summary: "一款基于 RAEA 引擎、React、TypeScript 与 Blender 程序化资产构建的 Windows 桌面微缩浅水垂钓游戏。划着红白木船穿行于宝石翠绿与暮金油灯撞色的浅湾之间，伴随仰泳水獭、斑点鳐鱼、双臂 2-Bone IK 划桨起竿与 Karplus-Strong 尼龙原声吉他 BGM，提供免装 Blender 一键试玩包。"
featured: true
repo: "https://github.com/N0tANTi/slackwater-fishing"
demoTag: "RAEA · WESL WATER SHADER · WINDOWS X64"
demoControls: "W/S 或 ↑/↓ 划船 · A/D 转向 · 按住空格蓄力抛竿/咬钩收线 · X 提前收线 · J/Tab 打开宣纸鱼获图鉴 · H 按键说明"
runCommand: "git clone https://github.com/N0tANTi/slackwater-fishing.git && cd slackwater-fishing && .\\play.cmd"
downloads:
  - "Windows 免装 Blender 试玩版 v0.2.0 (16.7MB)|https://github.com/N0tANTi/slackwater-fishing/releases/download/v0.2.0/Slackwater-Fishing-v0.2.0-win-x64.zip"
  - "GitHub Release v0.2.0 更新说明|https://github.com/N0tANTi/slackwater-fishing/releases/tag/v0.2.0"
preview: "./previews/slackwater-cover.jpg"
license: "Open Source"
palette:
  - "#1F8A70"
  - "#E8A838"
  - "#D6453A"
  - "#1B2A4A"
sourceMap:
  - "Shader|自定义 WESL 浅湾水面着色器（宝石翠绿/暮金靛青、聚簇波光、焦散、油灯暖晕与搏斗水花）|shaders/lagoon.wesl, src/water.tsx"
  - "Gameplay|输入状态机、连续动画混合通道、鱼种生态与图鉴记录|src/game.ts, src/session.tsx, game.tsx, demo.tsx"
  - "Motion & IK|二阶阻尼镜头、双臂 2-Bone IK 划桨/持竿衔接、水中 S 形搏斗轨迹与 3D→2D 投影|src/motion.ts"
  - "World & UI|场景光照、AgX/SSAO/Bloom/DoF 后处理、宣纸手账风中文鱼获卡与环形收线精力条|src/world.tsx, src/hud.tsx"
  - "Blender Assets|木船、围巾渔夫、水獭、鳐鱼、锦鲤、珊瑚海胆与湖底多材质程序化生成|tools/build_media.py, tools/boat.py, tools/lagoon.py, tools/bed.py, tools/otter.py, tools/geometry.py, tools/ripple.py"
  - "Audio & QA|Karplus-Strong 尼龙原声吉他/卡林巴琴 BGM、同步音效、一键启动脚本与自动化测试|tools/sound.py, tools/run.ps1, play.cmd, tests/game.test.mjs"
---

《浅水垂钓（Slackwater Fishing）》是一款使用 **RAEA 引擎、React、TypeScript 与 Blender Python** 从零构建的 Windows 桌面微缩生态垂钓游戏。

玩家划着红白条纹小木船穿梭在宝石翠绿的白昼浅湾与暮金油灯点亮的靛青水域之间，水下有仰泳水獭、斑点鳐鱼、管状珊瑚、紫海胆与成群橙白锦鲤相伴。全套 3D PBR 模型、自定义 WESL 水面着色器、双臂 2-Bone IK 划桨起竿动画、全中文宣纸手账风鱼获图鉴，以及 F 大调原声吉他 + 卡林巴琴治愈 BGM，全部由仓库脚本程序化生成。

**免装 Blender 快速试玩**：下载右侧 `Slackwater-Fishing-v0.2.0-win-x64.zip`（内置已编译的 3D 模型与原声音频）解压后双击 `play.cmd`，脚本将自动拉取并校验官方 RAEA 0.1.9 便携引擎并直接启动游戏。
