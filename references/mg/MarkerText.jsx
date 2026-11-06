import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// 马克笔高亮：白色粗斜体字，黄色高亮条从左往右扫入压在字的下半部
export default function MarkerText({ item }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = item.props || {};
  const text = p.text ?? "";
  const accent = p.accentColor ?? "#F8DF54";
  const fontFamily = p.fontFamily ?? "Noto Sans SC";
  const size = p.fontSize ?? 100;
  const time = frame / fps;
  const total = durationInFrames / fps;
  const pop = spring({ frame, fps, from: 0.7, to: 1, config: { damping: 10, stiffness: 220, mass: 0.6 } });
  const appear = interpolate(time, [0, 0.08], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const swipe = interpolate(time, [0.1, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = interpolate(time, [total - 0.15, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: appear * exit }}>
      <div style={{ position: "relative", padding: "0 20px", transform: `rotate(-3deg) scale(${pop})` }}>
        <div style={{ position: "absolute", left: 0, bottom: size * 0.05, height: size * 0.42, width: `${swipe * 100}%`, background: accent, borderRadius: size * 0.1, transform: "skewX(-12deg)", boxShadow: "3px 5px 6px rgba(20,20,20,0.35)" }} />
        <div style={{ position: "relative", fontFamily, fontWeight: 900, fontSize: size, color: "#FFFFFF", whiteSpace: "nowrap", lineHeight: 1.15, transform: "skewX(-8deg)", textShadow: "4px 5px 3px rgba(20,20,20,0.45), 7px 9px 12px rgba(20,20,20,0.4)" }}>{text}</div>
      </div>
    </div>
  );
}
