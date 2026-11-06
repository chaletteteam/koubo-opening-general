import React from "react";
import { interpolate, random } from "remotion";

// 2nd Collage｜复古撕纸 共用素材
// 方格米白纸底 + 斜放牛皮纸色带 + 撕边纸卡 + 胶带 + 报纸碎片 + 砖红手绘标记
// 动效原则：硬切进入，骨架（底、色带、标题条、空卡、照片框）第 0 帧就在；
// 内容按讲话时间"贴上去"（0.14 秒淡入+轻微落下），不弹跳、不逐字蹦、不闪烁。
export const C = { PAPER: "#ECE5D6", CARD: "#F2ECDF", KRAFT: "#B39A72", INK: "#171713", MARK: "#A53527", TAPE: "rgba(201,180,138,0.92)", SCRAP: "#D8D2C3" };
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
export const cnFont = (p) => `"${p.fontFamily ?? "Xinqingnian Ti"}", "Noto Sans SC"`;
export const numFont = (p) => `"${p.numFontFamily ?? "Archivo Black"}", "${p.fontFamily ?? "Xinqingnian Ti"}", "Noto Sans SC"`;

export function layerFlags(p) {
  const layer = p.layer ?? "bg";
  return { showBg: layer !== "fg", showFg: layer !== "bg" };
}

export function ramp(time, a, b) {
  return interpolate(time, [a, b], [0, 1], clamp);
}

// 贴入：0.14 秒内透明→不透明、从上方 10px 落下、1.03→1
export function Paste({ at, time, children, style, dy = 10 }) {
  if (at == null || time < at) return null;
  const k = ramp(time, at, at + 0.14);
  const e = 1 - Math.pow(1 - k, 3);
  return (
    <div style={{ ...style, opacity: e, transform: `${style?.transform ?? ""} translateY(${(1 - e) * -dy}px) scale(${1.03 - 0.03 * e})` }}>
      {children}
    </div>
  );
}

// 撕边多边形（确定性随机）
export function tornPath(w, h, seed, amp = 7, step = 16) {
  const pts = [];
  const r = (i) => (random(`${seed}-${i}`) - 0.5) * 2 * amp;
  let i = 0;
  for (let x = 0; x <= w; x += step) pts.push([x, Math.max(0, amp + r(i++)) ]);
  for (let y = step; y <= h; y += step) pts.push([w - Math.max(0, amp + r(i++)), y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h - Math.max(0, amp + r(i++))]);
  for (let y = h; y >= step; y -= step) pts.push([Math.max(0, amp + r(i++)), y]);
  return "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L") + " Z";
}

export function Grain({ id, opacity = 0.5, freq = 0.9 }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="2" seed="11" result="n" />
      <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0.35  0 0 0 0 0.29  0 0 0 0 0.2  0 0 0 ${opacity} -0.2`} />
    </filter>
  );
}

// 撕边纸卡：children 用绝对/flex 自行排版
export function TornCard({ x, y, w, h, rot = 0, seed = "c", fill = C.CARD, amp = 6, shadow = true, children, style }) {
  const gid = `g-${seed}`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, ...style }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible", filter: shadow ? "drop-shadow(2px 4px 5px rgba(60,45,25,0.28))" : "none" }}>
        <defs><Grain id={gid} opacity={0.22} /></defs>
        <path d={tornPath(w, h, seed, amp)} fill={fill} />
        <path d={tornPath(w, h, seed, amp)} filter={`url(#${gid})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}

export function Tape({ x, y, w = 170, h = 52, rot = -4, color = C.TAPE }) {
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: color, transform: `rotate(${rot}deg)`, boxShadow: "1px 2px 3px rgba(60,45,25,0.18)" }} />;
}

// 方格米白纸 + 牛皮纸色带 + 右上报纸碎片（只画灰色字条纹理，不伪造新闻文字）
export function CollageBackground({ id = "cb" }) {
  const band = "M0 372 L1080 318 L1080 1405 L0 1462 Z";
  const lines = [];
  for (let i = 0; i < 9; i++) lines.push(<rect key={i} x={18} y={22 + i * 30} width={150 + random(`s${i}`) * 110} height={11} rx={2} fill="#8E887B" opacity={0.55} />);
  return (
    <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <pattern id={`${id}-grid`} width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0 L0 0 0 44" fill="none" stroke="#171713" strokeOpacity="0.06" strokeWidth="1.5" />
        </pattern>
        <Grain id={`${id}-grain`} opacity={0.35} />
        <Grain id={`${id}-kgrain`} opacity={0.55} freq={0.75} />
      </defs>
      <rect width="1080" height="1920" fill={C.PAPER} />
      <rect width="1080" height="1920" fill={`url(#${id}-grid)`} />
      <rect width="1080" height="1920" filter={`url(#${id}-grain)`} />
      <g transform="translate(790 -30) rotate(8)">
        <path d={tornPath(330, 360, `${id}-scrap`, 5)} fill={C.SCRAP} />
        {lines}
      </g>
      <g>
        <path d={band} fill={C.KRAFT} />
        <path d={band} filter={`url(#${id}-kgrain)`} />
        {/* 色带上下撕边亮边 */}
        <path d="M0 372 L1080 318" stroke="#D9CBB0" strokeWidth="5" opacity="0.7" />
        <path d="M0 1462 L1080 1405" stroke="#D9CBB0" strokeWidth="5" opacity="0.7" />
      </g>
    </svg>
  );
}

// 顶部撕纸标题条：砖红序号（可空）+ 黑色粗字标题
export function TitleStrip({ num, title, p }) {
  const size = fit(title, num ? 700 : 820, 96);
  return (
    <>
      <TornCard x={68} y={105} w={945} h={225} rot={-1.2} seed="title" amp={9}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 22 }}>
          {num ? <span style={{ fontFamily: numFont(p), fontSize: Math.min(96, size * 1.05), color: C.MARK, lineHeight: 1 }}>{num}</span> : null}
          <span style={{ fontFamily: cnFont(p), fontSize: size, color: C.INK, lineHeight: 1.15, whiteSpace: "nowrap" }}>{title}</span>
        </div>
      </TornCard>
      <Tape x={445} y={74} w={170} h={56} rot={-5} />
    </>
  );
}

export function SubLabel({ text, p }) {
  if (!text) return null;
  return <div style={{ position: "absolute", left: 72, top: 392, fontFamily: cnFont(p), fontSize: 30, color: C.INK, opacity: 0.85 }}>{text}</div>;
}

// 色带内的红色强调句（在字幕区上方，y≈1150–1230）
export function AccentLine({ text, at, time, p, top = 1150 }) {
  if (!text) return null;
  return (
    <Paste at={at} time={time} style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center" }}>
      <span style={{ fontFamily: cnFont(p), fontSize: 64, color: C.MARK }}>{text}</span>
    </Paste>
  );
}

// 人物照片窗口：V 为人物视频可见矩形（视频放在 bg 与 fg 之间）
export const PHOTO_R = { x: 670, y: 1452, w: 335, h: 390 };
export const PHOTO_L = { x: 75, y: 1452, w: 335, h: 390 };
// photoMode:"band"：人物放在牛皮纸色带里。要点出现前（time < photoMoveAt）放大居中；之后缩小到色带一侧，不压文字
export const PHOTO_BIG = { x: 260, y: 445, w: 560, h: 652 };
export const PHOTO_SIDE_R = { x: 735, y: 560, w: 300, h: 349 };
export const PHOTO_SIDE_L = { x: 45, y: 560, w: 300, h: 349 };
export const isBandPhoto = (p) => (p.photoMode ?? "corner") === "band";
// photoSlot:"side"（默认，照片在色带一侧，文字排到另一侧）或 "below"（照片在色带下部一侧，文字用整宽）
export const photoRect = (p, time = 0) => {
  const left = (p.photoSide ?? "right") === "left";
  if (isBandPhoto(p)) {
    if (time < (p.photoMoveAt ?? 0)) return PHOTO_BIG;
    const side = left ? PHOTO_SIDE_L : PHOTO_SIDE_R;
    return (p.photoSlot ?? "side") === "below" ? { ...side, y: 905 } : side;
  }
  return left ? PHOTO_L : PHOTO_R;
};
// 内容列：人物照片在色带一侧时，文字和素材只用另一侧，保证不重叠；否则返回 null 用版式默认宽度
export const bandColumn = (p) => {
  if (!isBandPhoto(p) || (p.photoSlot ?? "side") === "below") return null;
  return (p.photoSide ?? "right") === "right" ? { x: 60, w: 640 } : { x: 380, w: 640 };
};

export function PhotoMount({ V }) {
  const b = 16;
  return <div style={{ position: "absolute", left: V.x - b, top: V.y - b, width: V.w + b * 2, height: V.h + b * 2, background: C.CARD, boxShadow: "3px 6px 10px rgba(60,45,25,0.3)" }} />;
}

export function PhotoTape({ V }) {
  return <Tape x={V.x + V.w / 2 - 85} y={V.y - 38} w={170} h={54} rot={-2} />;
}

// 红色手绘双下划线（按进度画出）
export function DoubleUnderline({ width, progress, color = C.MARK }) {
  const d1 = `M4 10 C ${width * 0.3} 4, ${width * 0.7} 2, ${width - 4} 4`;
  const d2 = `M14 26 C ${width * 0.35} 20, ${width * 0.7} 18, ${width - 18} 18`;
  return (
    <svg width={width} height={34} style={{ display: "block", overflow: "visible" }}>
      <path d={d1} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - progress} />
      <path d={d2} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, progress * 1.4 - 0.4)} />
    </svg>
  );
}

// 照片旁的关键词 + 红色双下划线 + 角落红星
export function PhotoLabel({ text, at = 0, time, p }) {
  if (!text) return null;
  const left = (p.photoSide ?? "right") === "left";
  const band = isBandPhoto(p);
  const size = Math.min(72, Math.floor(520 / Math.max(4, Array.from(text).length)));
  const prog = ramp(time, at + 0.1, at + 0.4);
  return (
    <>
      <div style={{ position: "absolute", top: band ? 1560 : 1545, ...(band ? { left: 0, width: 1080, textAlign: "center" } : left ? { left: 470, width: 560 } : { left: 70, width: 560 }), transform: "rotate(-3deg)" }}>
        <div style={{ display: "inline-block", opacity: ramp(time, at, at + 0.12) }}>
          <div style={{ fontFamily: cnFont(p), fontSize: size, color: C.INK, whiteSpace: "nowrap", lineHeight: 1.15 }}>{text}</div>
          <DoubleUnderline width={Math.round(size * Array.from(text).length * 1.02 + 20)} progress={prog} />
        </div>
      </div>
      <RedStar x={band ? 940 : left ? 1005 : 68} y={band ? 1720 : 1770} size={58} />
    </>
  );
}

export function RedStar({ x, y, size = 56, color = C.MARK }) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? size * 0.21 : size * 0.5;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: "rotate(-8deg)" }}>
      <polygon points={pts.join(" ")} fill={color} />
    </svg>
  );
}

// 红色手绘向下箭头
export function HandArrow({ x, y, h = 90, progress = 1, color = C.MARK }) {
  return (
    <svg width="60" height={h + 10} style={{ position: "absolute", left: x - 30, top: y, overflow: "visible" }}>
      <path d={`M30 4 C 27 ${h * 0.35}, 33 ${h * 0.65}, 30 ${h}`} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - progress} />
      <path d={`M10 ${h - 22} L30 ${h} L50 ${h - 24}`} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={progress >= 0.95 ? 1 : 0} />
    </svg>
  );
}

// 细线图标：黑色线条 + 砖红点缀
export function LineIcon({ name, size = 74 }) {
  const s = { fill: "none", stroke: C.INK, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" };
  const r = { ...s, stroke: C.MARK };
  const g = {
    search: <><circle cx="40" cy="40" r="24" {...s} /><path d="M58 58 L84 84" {...r} strokeWidth="6" /></>,
    user: <><circle cx="50" cy="32" r="18" {...s} /><path d="M16 88 C 18 62, 34 54, 50 54 C 66 54, 82 62, 84 88" {...s} /></>,
    check: <path d="M14 52 L40 78 L88 22" {...r} strokeWidth="8" />,
    house: <><path d="M14 48 L50 16 L86 48" {...s} /><path d="M24 42 L24 86 L76 86 L76 42" {...s} /><path d="M42 86 L42 62 L58 62 L58 86" {...r} /></>,
    phone: <><rect x="28" y="8" width="44" height="84" rx="8" {...s} /><path d="M44 80 L56 80" {...r} /></>,
    chat: <><path d="M14 20 L86 20 L86 66 L44 66 L26 84 L28 66 L14 66 Z" {...s} /><path d="M32 42 L68 42" {...r} /></>,
    money: <><circle cx="50" cy="50" r="34" {...s} /><path d="M60 36 C 52 30, 38 32, 40 42 C 42 52, 62 48, 60 60 C 58 70, 42 70, 38 62 M50 26 L50 74" {...r} /></>,
    camera: <><rect x="10" y="30" width="80" height="54" rx="6" {...s} /><path d="M34 30 L40 18 L60 18 L66 30" {...s} /><circle cx="50" cy="57" r="15" {...r} /></>,
    calendar: <><rect x="12" y="18" width="76" height="70" rx="6" {...s} /><path d="M12 38 L88 38 M32 10 L32 26 M68 10 L68 26" {...s} /><path d="M36 62 L46 72 L66 50" {...r} /></>,
    star: <path d="M50 12 L60 40 L90 40 L66 58 L75 88 L50 70 L25 88 L34 58 L10 40 L40 40 Z" {...r} />,
  }[name];
  if (!g) return null;
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>{g}</svg>;
}

// 公共外壳：bg 层画纸底/色带/标题/照片座/关键词；fg 层只画照片胶带
export function CollageShell({ p, time, children, fgChildren }) {
  const { showBg, showFg } = layerFlags(p);
  const V = photoRect(p, time);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {showBg && <>
        <CollageBackground />
        <TitleStrip num={p.num} title={p.title ?? "【title】"} p={p} />
        <SubLabel text={p.sub} p={p} />
        {children}
        <PhotoMount V={V} />
        {/* 解说文字一律写在对应要点下面，画面底部不放解说（label 已停用） */}
        <RedStar x={isBandPhoto(p) ? 940 : (p.photoSide ?? "right") === "left" ? 1005 : 68} y={isBandPhoto(p) ? 1720 : 1770} size={58} />
      </>}
      {showFg && <>
        <PhotoTape V={V} />
        {fgChildren}
      </>}
    </div>
  );
}

// 按字数缩字号（中文按 1 个字宽，英文/数字按 0.56）
export function fit(text, maxW, base) {
  let n = 0;
  for (const ch of Array.from(text ?? "")) n += /[\x00-\x7F]/.test(ch) ? 0.56 : 1;
  return Math.min(base, Math.floor(maxW / Math.max(1, n)));
}

// 横条贴纸：左侧图标/勾 + 一行粗字
export function StripRow({ x, y, w, h, rot = 0, seed, icon, text, color = C.INK, size = 58, p, sub, subAt = 0, time = 0, subColor = C.MARK, subSize = 42 }) {
  const inner = w - 80 - (icon ? 100 : 0);
  // sub：这条要点的解说（写在要点下面，不放到画面底部），按讲话时间淡入
  return (
    <TornCard x={x} y={y} w={w} h={h} rot={rot} seed={seed}>
      <div style={{ position: "absolute", inset: 0, padding: "0 40px", display: "flex", alignItems: "center", gap: 26 }}>
        {icon ? <LineIcon name={icon} size={Math.min(78, h * 0.55)} /> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontFamily: cnFont(p), fontSize: fit(text, inner, size), color, whiteSpace: "nowrap", lineHeight: 1.15 }}>{text}</span>
          {sub ? <span style={{ fontFamily: cnFont(p), fontSize: fit(sub, inner, subSize), color: subColor, whiteSpace: "nowrap", lineHeight: 1.15, opacity: ramp(time, subAt, subAt + 0.14) }}>{sub}</span> : null}
        </div>
      </div>
    </TornCard>
  );
}
