import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, cnFont, numFont, CollageShell, TornCard, Paste, AccentLine, bandColumn } from "./collage-kit.jsx";

// 版式：数字对比（左右两张纸卡，大号数字逐行贴入）
// 行格式 "数字|单位"；行首加 * 表示该行数字用砖红强调
function Rows({ rows, x, w, color, time, p }) {
  return (
    <div style={{ position: "absolute", left: x + 44, width: w - 80, top: 560, display: "flex", flexDirection: "column", gap: 34 }}>
      {rows.map(([raw, t], i) => {
        const red = raw.startsWith("*");
        const [num, unit] = raw.replace(/^\*/, "").split("|");
        const big = Math.min(140, Math.floor((w - 90) / (Array.from(num).length * 0.78)));
        const stacked = big * Array.from(num).length * 0.78 + (unit ? Array.from(unit).length * 46 : 0) > w - 80;
        return (
          <Paste key={i} at={t} time={time} style={{ display: "flex", flexDirection: stacked ? "column" : "row", alignItems: stacked ? "flex-start" : "baseline", gap: stacked ? 4 : 16 }}>
            <span style={{ fontFamily: numFont(p), fontSize: big, lineHeight: 1, color: red ? C.MARK : color }}>{num}</span>
            {unit ? <span style={{ fontFamily: cnFont(p), fontSize: 46, color: C.INK, lineHeight: 1.1 }}>{unit}</span> : null}
          </Paste>
        );
      })}
    </div>
  );
}

export default function CollageCompare({ item }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const p = item.props || {};
  const L = [[p.l1, p.lt1 ?? 0.4], [p.l2, p.lt2 ?? 1.2], [p.l3, p.lt3 ?? 2.0]].filter(([s]) => s);
  const R = [[p.r1, p.rt1 ?? 2.8], [p.r2, p.rt2 ?? 3.6], [p.r3, p.rt3 ?? 4.4]].filter(([s]) => s);
  const head = (text, x, at) => text ? (
    <Paste at={at} time={time} style={{ position: "absolute", left: x + 44, top: 488 }}>
      <span style={{ fontFamily: cnFont(p), fontSize: 40, color: C.INK, opacity: 0.8 }}>{text}</span>
    </Paste>
  ) : null;
  // 人物在色带一侧时，两张对比卡只用另一侧的列
  const col = bandColumn(p) ?? { x: 65, w: 950 };
  const cw = (col.w - 30) / 2, lx = col.x, rx = col.x + cw + 30;
  return (
    <CollageShell p={p} time={time}>
      <TornCard x={lx} y={455} w={cw} h={660} rot={-0.8} seed="cmpL" amp={8} />
      <TornCard x={rx} y={455} w={cw} h={660} rot={0.7} seed="cmpR" amp={8} />
      {head(p.lHead, lx, L[0]?.[1])}
      {head(p.rHead, rx, R[0]?.[1])}
      <Rows rows={L} x={lx} w={cw} color={p.lColor ?? C.MARK} time={time} p={p} />
      <Rows rows={R} x={rx} w={cw} color={p.rColor ?? C.INK} time={time} p={p} />
      <AccentLine text={p.accent} at={p.accentAt ?? 5.0} time={time} p={p} top={1155} />
    </CollageShell>
  );
}
