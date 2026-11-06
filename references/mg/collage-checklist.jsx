import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CollageShell, Paste, StripRow, AccentLine, bandColumn } from "./collage-kit.jsx";

// 版式：清单 / 要点（3–4 条横条逐条贴入，左侧红色手绘勾）
export default function CollageChecklist({ item }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const p = item.props || {};
  const items = [[p.i1, p.t1 ?? 0.4], [p.i2, p.t2 ?? 1.4], [p.i3, p.t3 ?? 2.4], [p.i4, p.t4 ?? 3.4]].filter(([s]) => s);
  const gap = items.length > 3 ? 172 : 205;
  // 人物在色带一侧时，清单只用另一侧的列
  const col = bandColumn(p);
  return (
    <CollageShell p={p} time={time}>
      {items.map(([s, t], i) => (
        <Paste key={i} at={t} time={time} style={{ position: "absolute", inset: 0 }}>
          <StripRow x={col ? col.x + (i % 2 ? 20 : 0) : i % 2 ? 125 : 95} y={455 + i * gap} w={col ? col.w - 20 : 860} h={140} rot={i % 2 ? 0.8 : -0.8} seed={`ck${i}`} icon="check" text={s} size={58} p={p} />
        </Paste>
      ))}
      <AccentLine text={p.accent} at={p.accentAt ?? 4.4} time={time} p={p} top={1165} />
    </CollageShell>
  );
}
