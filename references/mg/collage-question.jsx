import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CollageShell, Paste, StripRow, LineIcon, AccentLine, bandColumn } from "./collage-kit.jsx";

// 版式：问题 / 痛点 / 用户会问什么（错落的问句纸条逐条贴入 + 放大镜）
export default function CollageQuestion({ item }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const p = item.props || {};
  const qs = [[p.q1, p.t1 ?? 0.4], [p.q2, p.t2 ?? 1.6], [p.q3, p.t3 ?? 2.8]].filter(([s]) => s);
  // 人物在色带一侧时，问句纸条只用另一侧的列
  const col = bandColumn(p);
  const slots = col
    ? [{ x: col.x, y: 470, r: -2 }, { x: col.x + 30, y: 680, r: 1.5 }, { x: col.x + 10, y: 890, r: -1 }]
    : [{ x: 85, y: 470, r: -2 }, { x: 175, y: 680, r: 1.5 }, { x: 95, y: 890, r: -1 }];
  const qw = col ? col.w - 30 : 820;
  return (
    <CollageShell p={p} time={time}>
      {qs.map(([q, t], i) => (
        <Paste key={i} at={t} time={time} style={{ position: "absolute", inset: 0 }}>
          <StripRow x={slots[i].x} y={slots[i].y} w={qw} h={140} rot={slots[i].r} seed={`q${i}`} text={q} size={56} p={p} />
        </Paste>
      ))}
      <Paste at={qs[0]?.[1] ?? 0.4} time={time} style={{ position: "absolute", left: col ? col.x + col.w - 120 : 900, top: 1050, transform: "rotate(-10deg)" }}>
        <LineIcon name="search" size={110} />
      </Paste>
      <AccentLine text={p.accent} at={p.accentAt ?? 3.8} time={time} p={p} top={1165} />
    </CollageShell>
  );
}
