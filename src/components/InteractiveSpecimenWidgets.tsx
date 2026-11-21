import { useState } from 'react';
import { Copy, Check, Sun, Sunset, CloudSun, Sparkles } from 'lucide-react';
import { useCopy } from '../lib/useCopy';

interface TimePalette {
  id: string;
  label: string;
  en: string;
  icon: typeof Sun;
  moodDesc: string;
  skyTop: string;
  skyHorizon: string;
  meadowLit: string;
  meadowShadow: string;
  warmInk: string;
}

const TIME_PALETTES: TimePalette[] = [
  {
    id: 'noon',
    label: '正午',
    en: 'HIGH NOON',
    icon: Sun,
    moodDesc: '高明度晴空钴蓝与明亮水粉绿草浪，冷调阴影与暖纸高光形成清透动画质感。',
    skyTop: '#2E78C8',
    skyHorizon: '#9FD4F5',
    meadowLit: '#79B65B',
    meadowShadow: '#356455',
    warmInk: '#2D2421',
  },
  {
    id: 'afternoon',
    label: '午后',
    en: 'AFTERNOON',
    icon: CloudSun,
    moodDesc: '太阳斜射拉长球团树影，空气透视轻度偏暖，远山呈现柔和青紫分面。',
    skyTop: '#3B72B8',
    skyHorizon: '#D6E2D5',
    meadowLit: '#94BA54',
    meadowShadow: '#3D5E5C',
    warmInk: '#382922',
  },
  {
    id: 'golden',
    label: '黄金时刻',
    en: 'GOLDEN HOUR',
    icon: Sparkles,
    moodDesc: '受光面全面镀上琥珀金黄，暗部手调偏冷青灰（禁止压黑），角色轮廓暖墨描边最为通透。',
    skyTop: '#4A5F96',
    skyHorizon: '#F7C274',
    meadowLit: '#C9B14A',
    meadowShadow: '#42525E',
    warmInk: '#4A2B1D',
  },
  {
    id: 'sunset',
    label: '晚霞日落',
    en: 'SUNSET DUSK',
    icon: Sunset,
    moodDesc: '绿野晚霞核心氛围：天幕由暮紫过渡至橘红晚霞，全景远山实时重打光无需重绘。',
    skyTop: '#3C3268',
    skyHorizon: '#FA6E3A',
    meadowLit: '#B87442',
    meadowShadow: '#31334A',
    warmInk: '#3D1E1B',
  },
];

interface AlphaZone {
  id: string;
  range: string;
  label: string;
  en: string;
  color: string;
  widthPercent: number;
  kuwahara: string;
  outline: string;
  detail: string;
}

const ALPHA_ZONES: AlphaZone[] = [
  {
    id: 'character',
    range: '0.03 ~ 0.21',
    label: '赛璐璐主角部位 ID',
    en: 'CHARACTER CEL IDs',
    color: '#FA551E',
    widthPercent: 28,
    kuwahara: '跳过滤镜（alpha < 0.6），保持三阶赛璐璐干净平涂',
    outline: '触发深度感知暖棕色墨线（alpha < 0.23 且未被前景草叶遮挡）',
    detail: '不同部位（头发、皮肤、上衣、披风）写入唯一 Alpha ID，后处理仅检测相邻 ID 跳变处描边。',
  },
  {
    id: 'vista',
    range: '0.25 ~ 0.59',
    label: '手绘远景 / 村庄 / 天幕',
    en: 'HAND-PAINTED VISTA',
    color: '#0061FF',
    widthPercent: 34,
    kuwahara: '跳过滤镜（alpha < 0.6），保留离线烘焙云层与锐利远山分面',
    outline: '不描边（alpha ≥ 0.23），维持柔和空气透视',
    detail: '远山全景条带与程序村庄已自带手绘笔触与抗闪烁衰减，避免被 Kuwahara 糊掉细节。',
  },
  {
    id: 'meadow',
    range: '1.00',
    label: '草海与地形笔触层',
    en: 'MEADOW & TERRAIN',
    color: '#B4DC19',
    widthPercent: 38,
    kuwahara: '启用分距离 Kuwahara（中景 r=2，近远景 r=1）',
    outline: '充当前景深度遮挡判定者（草叶更近时自动截断角色描边）',
    detail: '将 4 圈实例化草叶与地形色块揉合为大片水粉笔触油画质感，与主体赛璐璐形成材质反差。',
  },
];

export function InteractiveSpecimenWidgets() {
  const [activeTimeId, setActiveTimeId] = useState<string>('sunset');
  const [activeAlphaId, setActiveAlphaId] = useState<string>('character');
  const { copiedId, copy } = useCopy();

  const currentPalette =
    TIME_PALETTES.find((p) => p.id === activeTimeId) ?? TIME_PALETTES[3];
  const currentAlpha =
    ALPHA_ZONES.find((z) => z.id === activeAlphaId) ?? ALPHA_ZONES[0];

  const swatches = [
    { name: '天顶 SKY TOP', hex: currentPalette.skyTop },
    { name: '地平 HORIZON', hex: currentPalette.skyHorizon },
    { name: '受光草浪 LIT', hex: currentPalette.meadowLit },
    { name: '冷暗面 SHADOW', hex: currentPalette.meadowShadow },
    { name: '暖墨描边 INK', hex: currentPalette.warmInk },
  ];

  return (
    <div className="space-y-8">
      {/* Widget 1: Dropbox /color inspired 4 Time-of-Day Painterly Palette Switcher */}
      <div className="border border-[var(--blueprint-line-strong)] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--blueprint-line)] px-6 py-4">
          <div>
            <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
              INTERACTIVE SPECIMEN 01 · STAGE 6 COLOR SYSTEM
            </span>
            <h3 className="mt-1 font-display text-lg font-bold text-[var(--ink-base)]">
              4 套线性光时间色板实时预览（点击切换时段）
            </h3>
          </div>

          {/* Dropbox-style crisp Pill Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {TIME_PALETTES.map((p) => {
              const Icon = p.icon;
              const active = p.id === activeTimeId;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveTimeId(p.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 font-display text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-[var(--brand-blue)] text-white'
                      : 'border border-[var(--hairline-strong)] bg-white text-[var(--ink-base)] hover:bg-[var(--ink-base)] hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Live Layered Painterly Mood Preview */}
          <div
            className="relative flex min-h-[210px] flex-col justify-between overflow-hidden p-6 text-white transition-all duration-500 ease-dropbox lg:col-span-5"
            style={{
              background: `linear-gradient(180deg, ${currentPalette.skyTop} 0%, ${currentPalette.skyHorizon} 58%, ${currentPalette.meadowLit} 58%, ${currentPalette.meadowShadow} 100%)`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="bg-black/30 px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-[0.14em] backdrop-blur-xs">
                {currentPalette.en}
              </span>
              <span className="bg-black/30 px-2 py-0.5 font-mono-tech text-[10px] backdrop-blur-xs">
                PAINTERLY CURVE
              </span>
            </div>

            <div className="mt-10 bg-black/45 p-3.5 backdrop-blur-xs">
              <p className="text-xs leading-relaxed text-white/95">
                {currentPalette.moodDesc}
              </p>
            </div>
          </div>

          {/* 5 Click-to-Copy Swatch Columns (Dropbox /color Swatch Showcase) */}
          <div className="grid grid-cols-2 divide-x divide-y divide-[var(--hairline)] sm:grid-cols-5 sm:divide-y-0 lg:col-span-7">
            {swatches.map((sw) => {
              const id = `${currentPalette.id}-${sw.hex}`;
              const isCopied = copiedId === id;
              return (
                <button
                  key={sw.name}
                  onClick={() => copy(sw.hex, id)}
                  className="group flex flex-col justify-between p-4 text-left transition-colors hover:bg-[var(--bg-subtle)]"
                >
                  <div
                    className="h-24 w-full transition-transform duration-300 group-hover:scale-[1.03]"
                    style={{ backgroundColor: sw.hex }}
                  />
                  <div className="mt-4">
                    <span className="block font-mono-tech text-[10px] text-[var(--ink-muted)]">
                      {sw.name}
                    </span>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-mono-tech text-xs font-semibold text-[var(--ink-base)]">
                        {sw.hex}
                      </span>
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-[var(--ink-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Widget 2: Alpha-ID Channel Encoding Visualizer (Stage 5 + Stage 6) */}
      <div className="border border-[var(--hairline-strong)] bg-[var(--bg-dark-band)] p-6 text-white sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/12 pb-4">
          <div>
            <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3DD6F5]">
              INTERACTIVE SPECIMEN 02 · OUTCOLOR.A CHANNEL MAP
            </span>
            <h3 className="mt-1 font-display text-lg font-bold text-white">
              Alpha 通道暗码分层图谱（点击分段查看后处理行为）
            </h3>
          </div>
          <span className="font-mono-tech text-[11px] text-white/60">
            OUTLINE &lt; 0.23 · KUWAHARA SKIP &lt; 0.60
          </span>
        </div>

        {/* Interactive Segmented Alpha Bar */}
        <div className="mt-5 flex h-14 w-full gap-1.5">
          {ALPHA_ZONES.map((zone) => {
            const active = zone.id === activeAlphaId;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveAlphaId(zone.id)}
                style={{
                  width: `${zone.widthPercent}%`,
                  backgroundColor: zone.color,
                  color: zone.id === 'meadow' ? '#1E1919' : '#FFFFFF',
                }}
                className={`flex flex-col justify-center px-3 text-left transition-all duration-200 ${
                  active
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1E1919]'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <span className="font-mono-tech text-[11px] font-bold leading-none">
                  {zone.range}
                </span>
                <span className="mt-1 truncate font-display text-xs font-semibold">
                  {zone.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Alpha Zone Diagnostic Readout */}
        <div className="mt-5 grid grid-cols-1 gap-4 bg-white/[0.05] p-5 md:grid-cols-3">
          <div>
            <span className="font-mono-tech text-[10px] uppercase tracking-wider text-white/50">
              SELECTED LAYER · {currentAlpha.range}
            </span>
            <p className="mt-1.5 text-sm font-semibold text-white">
              {currentAlpha.label}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/70">
              {currentAlpha.detail}
            </p>
          </div>

          <div className="border-t border-white/10 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
            <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#FAD24B]">
              KUWAHARA 笔触滤波行为
            </span>
            <p className="mt-1.5 text-xs leading-relaxed text-white/90">
              {currentAlpha.kuwahara}
            </p>
          </div>

          <div className="border-t border-white/10 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
            <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#FA551E]">
              深度感知暖墨描边行为
            </span>
            <p className="mt-1.5 text-xs leading-relaxed text-white/90">
              {currentAlpha.outline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
