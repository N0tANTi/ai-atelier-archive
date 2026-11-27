---
title: "纪念碑谷主题沙盒架构拆解：粉彩几何美学、规则驱动建筑生长与 3D 穿行"
summary: "解析 Monument Valley Sandbox 如何在 Little City 的程序化城建规则引擎之上重构极简粉彩调色体系、圆顶拱窗建筑原型、悬浮水域光影与低空飞行漫游体验。"
readingMinutes: 5
---

## 一、 从写实手绘小镇到纪念碑谷极简粉彩

原作 `littlecity` 主打手绘海港小镇质感；本项目围绕《纪念碑谷》的视觉语言进行了系统性美学重构：

- **统一粉彩色阶（`src/style/palette.ts`、`src/style/look.ts`）**：剥离杂乱表面噪点与高频写实纹理，确立象牙白、珊瑚粉、薄荷青、淡薰衣草紫与暖金圆顶五大主色，搭配低饱和青碧悬浮水面；
- **柔和阶梯光照与昼夜演进（`src/style/time.ts`）**：让平面建筑的受光面、过渡面与阴影面保持清晰舒展的插画式色块关系，在黄昏与星夜自动点亮暖金拱窗与灯塔光束。

---

## 二、 纯代码几何建筑原型与规则生长

| 模块目录 | 职责 | 改造亮点 |
| --- | --- | --- |
| `src/gen/house/`、`src/gen/tower/`、`src/gen/marble/` | 建筑网格程序化生成 | 定制球形穹顶、圆拱窗洞、对称高塔、露台阶梯与圣殿长廊，零外部 3D 模型文件 |
| `src/rules/` & `src/townmaker/` | 城镇空间语法与一键生长 | 玩家只需放置基础地块或点击「生长」，规则系统即自动衔接拱桥、阶梯、庭院、广场与水岸 |
| `src/fly/` | 3D 低空穿行引擎 | 在等轴微缩沙盒与贴近街巷的 3D 飞行视角间平滑切换，近距离穿梭几何拱廊 |

---

## 三、 中文界面与静谧氛围配乐

- 通过 `src/i18n/locales/zh.json` 与 URL 参数 `?lang=zh` 提供完整中文界面；
- `src/app/music.ts` 使用 `import.meta.env.BASE_URL` 动态加载定制静谧氛围主题曲（`public/music/monument-valley-theme.mp3`），经由 Web Audio 增益节点控制淡入淡出与暂停静音；
- 通过 GitHub Actions 以 `--base=/monument-valley-sandbox/` 自动构建生产包并发布至 GitHub Pages，实现站内即点即玩。
