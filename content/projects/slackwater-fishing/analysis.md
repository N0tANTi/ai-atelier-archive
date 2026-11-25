---
title: "浅水垂钓 v0.2.0 工程拆解：WESL 浅湾水面、2-Bone IK 动画衔接与程序化微缩生态"
summary: "全面解析 Slackwater Fishing 如何用 RAEA + React + TypeScript + Blender 搭建完整桌面 3D 垂钓游戏：自定义 WESL 浅湾水面、AgX/SSAO/DoF 电影后处理、零硬切双臂 2-Bone IK 划桨起竿、水中 S 形搏斗与 Karplus-Strong 原声吉他合成。"
readingMinutes: 7
---

## 一、 整体技术栈与全程序化资产管线

与传统需要手工摆放 FBX 与购买素材包的独立游戏不同，《浅水垂钓》将「建模、着色器、交互状态机、UI 与原声音乐」全部统一在同一套代码仓库里：

| 层级 | 核心技术 | 仓库入口文件 |
| --- | --- | --- |
| 桌面 3D 运行时 | RAEA 0.1.9（DirectX 12 / Vulkan，官方 SHA-256 校验自动拉取） | `play.cmd` · `tools/run.ps1` |
| 场景与 UI 编排 | React + TypeScript 声明式组件树 | `game.tsx` · `demo.tsx` · `src/world.tsx` · `src/hud.tsx` |
| 水面着色器 | 自定义 WESL（WebGPU Shading Language 扩展） | `shaders/lagoon.wesl` · `src/water.tsx` |
| 角色动作与镜头 | 连续混合通道 + 双臂 2-Bone IK + 二阶阻尼镜头 | `src/motion.ts` · `src/game.ts` |
| 3D 模型与生态 | Blender 5.2 后台 Python 脚本，自动导出 15 个多材质 `.glb` | `tools/build_media.py` · `tools/boat.py` · `tools/lagoon.py` · `tools/otter.py` |
| 原创湖畔音频 | Python 物理建模音频合成（Karplus-Strong 吉他 + 卡林巴琴） | `tools/sound.py` |

---

## 二、 自定义 WESL 浅湾水面与电影级后处理栈

在 `v0.2.0` 中，水面渲染彻底移除了容易产生边缘接缝与重影的屏幕空间折射，改为完全定制的 **`shaders/lagoon.wesl`**：

- **双时段冷暖撞色**：白昼呈现清澈的**宝石翠绿**浅湾，黄昏切入**暮金船头油灯暖晕 × 深靛青水面**的强对比电影质感；
- **多层次液面光学细节**：融合聚簇液态波光、四角星芒高光、投射在浅水砂底的流动焦散，以及船体划行与鱼类挣扎时的动态水花尾浪；
- **渲染后处理全开**：开启 `AgX ToneMapping`、`SSAO` 接触阴影、`Bloom` 柔光、`DepthOfField` 微缩移轴景深、`Grade` 调色以及 `4096×4096` 高精度阴影贴图，让微缩场景拥有手工立体模型的温润触感。

---

## 三、 零硬切动作系统：连续混合通道与双臂 2-Bone IK

垂钓游戏最容易出戏的瞬间，往往是「划桨 → 停船 → 抛竿 → 抱鱼展示」之间的姿态突变。`src/game.ts` 与 `src/motion.ts` 引入了四个连续过渡通道：

1. **`rowBlend` / `oarPhase`**：前进或转向时平滑展开双桨并驱动划水周期，松手后自然收桨归位；
2. **`rodBlend` / `holdBlend`**：蓄力抛竿与起鱼展示之间按权重平滑插值，彻底消除硬切；
3. **统一双臂 2-Bone IK**：实时解算左右手肘与手腕空间位置，确保渔夫双手在划桨、持竿、拉线与抱鱼时都牢牢贴合桨柄与钓竿；
4. **水中 S 形搏斗与世界→屏幕投影 HUD**：鱼咬钩后在水中沿 S 形轨迹挣扎并在收线末段破水高跃；环形收线精力条通过 3D→2D 投影紧随鱼身移动，配合二阶阻尼镜头带来极具临场感的提竿手感。

---

## 四、 宣纸手账风中文 UI 与物理建模原声配乐

- **全中文博物手账界面（`src/hud.tsx`）**：白昼浅湾主要邂逅「芦苇鲈」，暮金油灯点亮时分主要邂逅「灯笼鲤」；过早提竿、错过咬钩与鱼线松弛均有清晰中文反馈，破纪录时会自动盖上「新纪录」红色印章并永久录入本次鱼获图鉴（按 `J` 或 `Tab` 翻阅）。
- **零外部版权曲库的原创配乐（`tools/sound.py`）**：使用 **Karplus-Strong 拨弦物理建模**合成尼龙原声吉他、柔和电钢与卡林巴琴构成的 F 大调湖畔治愈 BGM，同时生成挥竿、入水、咬钩与落船同步音效。

---

## 五、 操作指南与本地验证命令

| 操作 | 按键 |
| --- | --- |
| 前进 / 后退（自动展开双桨双手划船） | `↑ / ↓` 或 `W / S` |
| 转向 / 调整抛竿方向 | `← / →` 或 `A / D` |
| 抛竿（平滑收桨起竿） | 按住 `Space` 蓄力，松开抛出 |
| 提竿与收线 | 待红漂下沉、感叹号亮起后，按住 `Space` 填满环形精力条 |
| 提前收回鱼线 | `X` |
| 打开 / 收起宣纸鱼获图鉴 | `J` 或 `Tab` |
| 查看 / 收起中文按键说明 | `H` |

### 开发者演示与自动化验收命令

```powershell
# 运行 25 秒自动演示镜头
.\play.cmd -Demo

# 仅准备引擎与 Blender 程序化资产
.\tools\run.ps1 -PrepareOnly

# 运行核心游戏逻辑单元测试（Node 24）
node --experimental-strip-types tests/game.test.mjs

# 离线渲染 1280×720 30fps 高画质演示视频
.\.local\raea\bin\raea.exe render demo.tsx -o output/Slackwater.mp4 --quality high
```
