---
id: "02"
title: "雨过山寺 · 武侠水彩 3D 互动 Demo"
subtitle: "Three.js 铅笔线稿与水彩晕染实时着色器 · 拨动竹槽引水上色 · 配乐《过桥听雨》"
category: "技术笔记"
type: "note"
date: "2026-11-22"
tags:
  - "Three.js"
  - "水彩渲染"
  - "武侠风"
  - "GLSL"
  - "WebAudio"
summary: "一个以纯代码驱动的 Three.js 武侠水彩互动场景：未引水前全场景为宣纸铅笔线稿，拨动竹槽引水过廊桥后，颜料沿建筑与苍松根部实时向上晕染上色，并辅以配乐《过桥听雨》及程序化雨声、滴水与铜铃音效。"
featured: true
repo: "https://github.com/N0tANTi/rain-temple-wuxia"
demoTag: "THREE.JS · WATERCOLOR WASH SHADER"
demoControls: "点击竹槽或按 E 引水开声 · 拖动环视 · 滚轮缩放 · R 重置 · 点击「观看短片」自动运镜游览"
license: "MIT / CC0 1.0"
palette:
  - "#31554B"
  - "#914631"
  - "#B69D74"
  - "#F6F1E6"
sourceMap:
  - "Module 01|铅笔线稿、宣纸肌理与水彩扩散着色器|src/wash.js, src/pencil.js, src/page.js"
  - "Module 02|主入口、相机运镜与引水事件编排|src/rain-temple.js, src/noise.js"
  - "Module 03|程序化山寺亭台、廊桥与引水竹槽|src/temple.js, src/shape.js"
  - "Module 04|远山烟岚、雨势与奔涌水流系统|src/temple-weather.js"
  - "Module 05|武侠行者、竹编斗笠、背负佩剑与 2-Bone IK|src/wayfarer.js, src/figure/man.js"
  - "Module 06|配乐《过桥听雨》与实时雨滴铜铃音效|src/temple-sound.js"
---

## 一、 核心体验与美术构思

《雨过山寺》是一个基于 **Three.js + 自定义 GLSL 着色器** 的武侠水彩风 3D 互动场景。与常规一开始就全彩渲染的 3D 场景不同，它的视觉叙事围绕**「从线稿到设色」**展开：

1. **初始线稿态**：画面铺开一张微暖的宣纸底色（`#F6F1E6`），山寺、廊桥与人物仅以石墨排线（Graphite Hatching）和铅笔外轮廓呈现。
2. **拨动竹槽引水**：点击场景中的竹槽或按下 `E` 键，剑客通过 2-Bone IK 伸手拨动竹槽，清泉顺槽涌入廊桥与池面，同时开启《过桥听雨》配乐与实时雨声。
3. **颜料实时晕染**：水彩并非整体淡入，而是以地面时间图（`uMap`）记录水流抵达时刻——色彩从建筑与树木的「根部（`root`）」向上攀爬浸润，湿润前沿颜色最浓，干燥后在纸纹低谷处沉淀出柔和不均的水渍与冷紫色二遍罩染。

---

## 二、 核心技术模块拆解

### 1. 宣纸铅笔线稿与水彩扩散着色器（`wash.js` / `pencil.js` / `page.js`）
- **时间扩散图（`wcAge`）**：在 `createWash({ x0: -32, z0: -35, size: 68, cells: 384 })` 中维护一张世界空间时间图，每个像素根据 `uNow - T - climb - rag` 计算颜料抵达后的湿润时长，并用多层 3D 噪声制造参差不齐的水痕前沿。
- **水彩光学建模（`wcPaint`）**：先以 `pcTooth` 和 `pcStrokes` 绘制纸纹与石墨暗部排线；染色后计算湿润度 `wet` 与前沿浓边 `rim`，让水彩自然呈现「亮部透纸白、湿边色最深、干后渐清透」的真实质感。
- **全屏宣纸后处理（`page.js`）**：叠加整幅画面的纸张肌理、边缘铅笔勾线与全局湿润系数（`page.wet.value = 0.76`）。

### 2. 程序化山寺建筑与天气水体（`temple.js` / `shape.js` / `temple-weather.js`）
- 山寺殿宇、飞檐、廊桥、竹槽及悬崖苍松全部通过参数化几何工具（`shape.js`）在代码中生成，避免重型外部模型依赖。
- `temple-weather.js` 负责远山层叠烟岚、雨丝飘落与水体流动，配合竹槽开启触发完整的水流动画序列。

### 3. 武侠行者与骨骼 IK 交互（`wayfarer.js` / `figure/man.js`）
- 角色在基础骨骼网格之上，程序化缝合了**竹编斗笠**（多层细密环线 + 帽绳）与**背负式长剑**（绑定至 `spine_03` 骨骼，含木鞘、黄铜箍饰、缠柄与剑穗）。
- 内置轻量级 **双骨骼逆向运动学（2-Bone IK `reach()`）**，让行者在引水触发时自然抬起右肩与前臂伸向竹槽目标点。

### 4. 配乐融合与实时声景（`temple-sound.js`）
- 结合《过桥听雨》（`public/audio/过桥听雨.m4a`）主旋律与 Web Audio API 实时合成的雨声、檐下滴水声及铜铃声，形成有层次的东方雨夜氛围。

---

## 三、 本地运行与单文件离线打包

项目采用 `Node.js 24 + Vite 8 + Three.js 0.186`，构建脚本 `build.mjs` 除了产出标准静态目录 `dist/`，还会自动内联资源打包出一个可直接双击打开的单文件版本 `雨过山寺.html`：

```bash
git clone https://github.com/N0tANTi/rain-temple-wuxia.git
cd rain-temple-wuxia
npm ci
npm run build
npm run serve
```

### 交互操作速查

| 按键 / 操作 | 效果 |
| :--- | :--- |
| 点击竹槽 / `E` | 拨动竹槽引水上色，并开启配乐与雨声 |
| 鼠标拖动 / 滚轮 | 环视山寺与缩放景别 |
| `R` | 重置水流与重新引水 |
| 点击「观看短片」 | 场景内自动引水并跟随电影镜头游览 |
