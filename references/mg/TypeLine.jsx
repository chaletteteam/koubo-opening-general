import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// 黑底圆框段落用的打字机字幕：按讲话时间逐句、逐字打出，带浅灰光标
// lines：每句用 | 分隔；times：每句开始时间（秒，相对本 MG 开始），用 , 分隔
export default function TypeLine({ item }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const time = frame / fps;
  const p = item.props || {};
  const lines = (p.lines ?? "").split("|").filter(Boolean);
  const times = (p.times ?? "").split(",").map(Number);
  const end = durationInFrames / fps;
  let i = -1;
  for (let k = 0; k < lines.length; k++) if (time >= (times[k] ?? 0)) i = k;
  if (i < 0) return null;
  const text = lines[i];
  const t0 = times[i] ?? 0;
  const t1 = times[i + 1] ?? end;
  // 用这句讲话时长的 75% 打完，剩下时间停住
  const typeDur = Math.max(0.2, (t1 - t0) * 0.75);
  const chars = Array.from(text);
  const shown = Math.min(chars.length, Math.floor(((time - t0) / typeDur) * chars.length) + 1);
  const cursorOn = Math.floor(time / 0.5) % 2 === 0 || shown < chars.length;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: `"${p.fontFamily ?? "Noto Sans SC"}", "Noto Sans SC"`, fontWeight: 900, fontSize: p.fontSize ?? 70, color: "#FFFFFF", whiteSpace: "nowrap", lineHeight: 1.3, textShadow: "3px 4px 2px rgba(20,20,20,0.42), 5px 7px 9px rgba(20,20,20,0.4)" }}>
          {chars.slice(0, shown).join("")}
        </span>
        <span style={{ width: 10, height: (p.fontSize ?? 70) * 0.9, background: "#BDBDBD", opacity: cursorOn ? 1 : 0 }} />
      </div>
    </div>
  );
}
