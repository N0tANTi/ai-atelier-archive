---
title: "魔女飞行 · 风格化 3D 飞行 Prompt 卡片集与原始工程 Brief"
type: "prompt-deck"
---

## 一、 6 张核心工程 Prompt 卡片（提炼自完整 Brief 与迭代升级）

### 卡片 #1｜美术铁律与三套实时画风（Stage 1）
```text
[PROMPT 01 · 莫比乌斯清线 + 吉卜力晴夏 + 金色黄昏]
1. 严禁写实 PBR 与外部照片贴图，全场景以水粉/清线手绘感为核心，所有阴影柔和扩散
2. 莫比乌斯清线：薄荷青至蜜桃粉天空 + 光环巨行星与轨道弧 + 极细梅紫墨线 + 阴影交叉排线 + 宣纸颗粒
3. 支持 1/2/3 键零刷新切换「吉卜力晴夏（蔚蓝晴空与冷蓝云底）」与「金色黄昏（液态金水光 + 灯塔体积光束 + 全城暖窗灯火）」
```

### 卡片 #2｜阶梯赛璐璐、距离衰减描边与水体着色（Stage 2）
```text
[PROMPT 02 · Toon Shader + 清线后处理 + 手绘水面]
1. 全部材质采用 2~3 阶自定义 Toon Shader（受光面 + 阴影阶 + 边缘轮廓光），叠微弱手绘笔触起伏
2. 边缘描边按深度与距离平滑变细，避免远处建筑群糊成一团黑墨；关闭 SSAO 保持通透平面绘本感
3. 水体采用双色扁平手绘着色，叠加随风闪动的笔触高光斑，并在堤岸、礁石与桥墩边缘绘制白色浪沫线
```

### 卡片 #3｜双程序化世界：海港风车城 & 布拉格河谷（Stage 3）
```text
[PROMPT 03 · 零模型纯代码双城引擎]
1. 海港风车城：依山拾级而上的陶红屋顶阶梯小镇、绿铜尖顶钟楼广场、4 座山顶风车、6 孔石拱高架桥、可穿行的海上石灰岩拱门与红白灯塔
2. 布拉格河谷：伏尔塔瓦河与五孔查理大桥（含桥头塔与雕像）、老城广场与随真实时间走针的天文钟、泰恩双尖塔与圣维特大教堂
3. 性能优化：将上千栋房屋的窗户改为平面手绘面片并剔除院内贴墙面，合并为极少 Draw Call 的单一网格，保证 60fps 流畅飞行
```

### 卡片 #4｜小魔女、红丝带、雕木扫帚与黑猫（Stage 4）
```text
[PROMPT 04 · 角色动态与扫帚细节]
1. 低多边形动画风小魔女：短发层次、随风飘动的双环大红丝带蝴蝶结、米白滚边短披肩、实时布料波动的百褶裙与酒红短靴
2. 雕木扫帚配笔刷状束草尾、黄铜红饰环与飘穗、摇曳黄铜小提灯、挂皮书包与卷轴，以及蹲坐扫帚尾端的小黑猫
3. 飞行联动动画：裙摆与红丝带随空速加速翻飞，身体随压坡转弯与俯仰倾斜，黑猫耳朵与尾巴在俯冲时压低、慢飞时四处张望
```

### 卡片 #5｜浮空飞行手感、软碰撞与电影跟随机位（Stage 5）
```text
[PROMPT 05 · 零压力探索与三机位系统]
1. 无战斗、无计分、无坠毁，自动温和巡航前进；W/S 调速（可近乎悬停），A/D 平滑压坡转弯，Space/Shift 或鼠标爬升下降
2. 软碰撞边界：贴近屋顶、塔楼、灯塔或海面时温柔推离并减速，穿入积云触发短暂云雾白化，飞至湾区边缘自动柔和折返
3. 第三人称滞后跟随相机随速度微拉远并展宽 FOV、随压坡轻度横滚，遇遮挡自动前推防穿模；C 键切换飞行 / 广角 / 魔女特写三机位
```

### 卡片 #6｜纯 Web Audio 合成音景与 Builder-Critic 迭代（Stage 6）
```text
[PROMPT 06 · 零外部音频 + 审片自检闭环]
1. 全部声音由 Web Audio API 实时合成：随空速升高变亮的过滤风噪、贴近屋顶的呼啸声、海鸥鸣叫、海港轻浪、远处轮船汽笛/教堂钟声与电车叮当
2. 采用 Builder → Critic 顺序自检闭环：逐帧对比 100 米高空俯视屋顶层次、云朵是否具有可穿行立体感、飞行是否轻盈舒缓
3. 内置录屏与调试参数：?style=moebius|ghibli|golden、?city=harbour|prague、?auto 自动巡航、?clean 纯净无 UI、?at=x,y,z,yaw 定点机位
```

---

## 二、 完整工程级 Prompt 模板（原始 Brief 全文）

```markdown
Delivery Day — Ghibli-Style Broom Flight — Browser Build

### The Game
Build a third-person flying game in Three.js with a Studio Ghibli / Makoto Shinkai art style. A young witch rides a broom over a European seaside town on a summer morning, a small black cat perched on the bristles behind her. No combat, no score, no timer, no deliveries to complete — just fly and enjoy the town. This is a cinematic experience for a 30-40 second screen recording.

### 全局美术铁律（Art Direction — MOST IMPORTANT）
- Painterly, not photorealistic — colors should look like watercolor/gouache paintings.
- Custom toon/cel shader on ALL materials — flat base color + 1~2 shadow steps + rim light (NO standard PBR, NO SSAO).
- Bold dark outlines on geometry edges (2-3px), thinning smoothly with distance so the far town doesn't turn to ink.
- Soft color palette: terracotta roofs, cream and pastel plaster walls, sea teal to deep blue, sky blue, warm greens on hills; bright diffused summer lighting with NO harsh shadows.
- Volumetric-looking fluffy cumulus clouds with lit tops and cool blue undersides that the player can fly close to and through.
- Zero external downloads: ALL geometry, shaders, textures, and Web Audio soundscape generated 100% in code.

### 模块化分阶段实现要求
1. **着色器与大气系统（Shaders & Sky）**：
   - 2~3 阶自定义 Toon Shader + 距离衰减边缘描边（后处理或反转法线）+ 微妙手绘笔触叠层。
   - 天空渐变着色器 + 立体堆积积雨云；支持扩展莫比乌斯清线（光环行星 + 阴影排线 + 纸纹）、吉卜力晴夏、金色黄昏三套实时画风。
   - 双色手绘海面/河面着色器，带流动高光斑与贴岸/桥墩白色浪沫线。
2. **程序化海港小镇与布拉格双世界（World & Prague）**：
   - 海港风车城：沿山坡拾级而上的 3~4 层陶红屋顶住宅、绿铜尖顶钟楼、面包房、穹顶教堂、4 座风车、6 孔高架石桥、海上自然石拱门与红白灯塔。
   - 布拉格河谷：伏尔塔瓦河、5 孔查理大桥与雕像、老城广场与实时走针天文钟、泰恩双塔、布拉格城堡与圣维特大教堂，合并密集建筑网格保障 60fps。
3. **小魔女、扫帚与黑猫（Rider & Broom）**：
   - 原创动画风低多边形小魔女（短发、大红丝带蝴蝶结、披肩、动态百褶裙）、雕木扫帚与摇曳小黑猫；裙摆、丝带、猫耳尾与身体倾角随空速和俯仰实时联动。
4. **轻盈飞行、软碰撞与三机位相机（Flight & Camera）**：
   - 自动轻柔向前巡航，W/S 调速至悬停、A/D 压坡转向、Space/Shift 或鼠标升降；软碰撞轻推无坠毁，三机位平滑滞后跟随与动态 FOV。
5. **纯 Web Audio 实时声景（Procedural Audio）**：
   - 随空速变化的风声与掠屋呼啸、海鸥鸣叫、浪声、远处轮船汽笛 / 教堂应答钟声与电车铃声，全部由 Web Audio API 实时合成。
6. **录屏辅助与验收（Gauntlet Loop & Helpers）**：
   - 支持 `?style=moebius|ghibli|golden`、`?city=harbour|prague`、`?auto`、`?clean`、`?fps` 与 `?at=x,y,z,yaw`；采用 Builder + Critic 顺序视觉自检闭环打磨至 1080p 60fps。
```
