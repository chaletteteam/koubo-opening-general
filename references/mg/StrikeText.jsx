import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// "不要"类花字：禁止图标 + 白字，黄色横条从左往右划掉
function shadow(size) {
  const d = Math.round(size * 0.06);
  return `${Math.round(d * 0.6)}px ${Math.round(d * 0.75)}px 2px rgba(20,20,20,0.42), ${d}px ${d + 3}px ${Math.round(size * 0.1)}px rgba(20,20,20,0.45)`;
}
export default function StrikeText({ item }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = item.props || {};
  const text = p.text ?? "";
  const accent = p.accentColor ?? "#F8DF54";
  const fontFamily = p.fontFamily ?? "Noto Sans SC";
  const size = p.fontSize ?? 96;
  const time = frame / fps;
  const total = durationInFrames / fps;
  const appear = interpolate(time, [0, 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const iconPop = interpolate(time, [0, 0.1, 0.2], [0.4, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const strike = interpolate(time, [0.35, 0.65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = interpolate(time, [total - 0.15, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const icon = size * 1.05;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, opacity: appear * exit, transform: "rotate(-3deg)" }}>
      <svg width={icon} height={icon} viewBox="0 0 100 100" style={{ transform: `scale(${iconPop})`, filter: "drop-shadow(4px 6px 6px rgba(20,20,20,0.45))" }}>
        <circle cx="50" cy="50" r="40" fill="none" stroke={accent} strokeWidth="12" />
        <line x1="22" y1="22" x2="78" y2="78" stroke={accent} strokeWidth="12" strokeLinecap="round" />
      </svg>
      <div style={{ position: "relative", padding: "0 16px" }}>
        <div style={{ fontFamily, fontWeight: 900, fontSize: size, color: "#FFFFFF", whiteSpace: "nowrap", lineHeight: 1.15, textShadow: shadow(size), transform: "skewX(-8deg)" }}>{text}</div>
        <div style={{ position: "absolute", left: 0, top: "52%", height: size * 0.16, width: `${strike * 100}%`, background: accent, borderRadius: size * 0.08, boxShadow: "3px 5px 6px rgba(20,20,20,0.4)" }} />
      </div>
    </div>
  );
}
