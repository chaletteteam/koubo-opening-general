import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fitText } from "@remotion/layout-utils";

// 口播花字：白/黄粗黑体，轻微倾斜；黄字带同色系 3D 厚度，统一柔和投影
function textShadowFor(color, size, extrudeColor) {
  const isWhite = (color || "").toUpperCase() === "#FFFFFF";
  const ext = extrudeColor || (isWhite ? "" : "#A68F2A");
  const depth = Math.max(5, Math.round(size * 0.07));
  const layers = [];
  if (ext) for (let i = 1; i <= depth; i++) layers.push(`${i}px ${i}px 0 ${ext}`);
  const d = Math.round(size * 0.06);
  if (ext) {
    // 黄字：更厚的 3D 厚度 + 更深的投影
    const t = Math.max(5, Math.round(size * 0.07));
    layers.push(`${t + 2}px ${t + 3}px 3px rgba(15,15,15,0.6)`);
    layers.push(`${Math.round(d * 1.5)}px ${Math.round(d * 1.5) + 4}px ${Math.round(size * 0.14)}px rgba(15,15,15,0.6)`);
  } else {
    layers.push(`${Math.round(d * 0.6)}px ${Math.round(d * 0.75)}px 2px rgba(20,20,20,0.42)`);
    layers.push(`${d}px ${d + 3}px ${Math.round(size * 0.1)}px rgba(20,20,20,0.45)`);
  }
  return layers.join(", ");
}

// effect: trail（拖影滑入，默认）| slam（砸入+冲击线）| shake（抖动+生气符号，负面情绪）| coin（金币飞散，钱/变现）
//         flip（3D 翻牌，前后对比/反转）| bounce（逐字弹跳，并列名词）| marker（黄色马克笔下划线扫入，强调）
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

export default function HuaZi({ item }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const p = item.props || {};
  const text = p.text ?? "";
  const color = p.color ?? "#F8DF54";
  const fontFamily = p.fontFamily ?? "Noto Sans SC";
  const maxSize = p.fontSize ?? 112;
  const rotate = p.rotate ?? -3;
  const effect = p.effect ?? "trail";

  const time = frame / fps;
  const total = durationInFrames / fps;
  const fit = fitText({ text, withinWidth: width * 0.84, fontFamily, fontWeight: "900" }).fontSize;
  const size = Math.min(maxSize, fit);

  const pop = spring({ frame, fps, from: 0.55, to: 1, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  const appear = interpolate(time, [0, 0.08], [0, 1], clamp);
  const exit = interpolate(time, [total - 0.15, total], [1, 0], clamp);
  const slide = effect === "trail" ? interpolate(time, [0, 0.22], [1, 0], clamp) : 0;
  const trailAlpha = interpolate(time, [0, 0.25], [1, 0], clamp);
  const sparkle = p.sparkle === true;
  const shadow = textShadowFor(color, size, p.extrudeColor);
  const base = { fontFamily, fontWeight: 900, fontSize: size, lineHeight: 1.1, color, whiteSpace: "nowrap", letterSpacing: 1 };

  // 各效果的整体变换
  let scale = pop * (0.96 + 0.04 * exit), tx = -slide * 120, ty = 0, extraRot = 0, blur = 0, rotX = 0;
  if (effect === "slam") {
    const s = spring({ frame, fps, from: 2.4, to: 1, config: { damping: 13, stiffness: 320, mass: 0.7 } });
    scale = s * (0.96 + 0.04 * exit);
    blur = Math.max(0, (s - 1) * 5);
    const k = interpolate(time, [0.12, 0.4], [1, 0], clamp) * (time > 0.12 ? 1 : 0);
    tx = Math.sin(time * 95) * 9 * k; ty = Math.cos(time * 80) * 7 * k;
  } else if (effect === "shake") {
    tx = Math.sin(time * 55) * 5; ty = Math.cos(time * 47) * 3; extraRot = Math.sin(time * 31) * 1.6;
  } else if (effect === "flip") {
    const f = spring({ frame, fps, from: 0, to: 1, config: { damping: 11, stiffness: 170, mass: 0.7 } });
    rotX = (1 - f) * -100; scale = (0.9 + 0.1 * f) * (0.96 + 0.04 * exit);
  } else if (effect === "bounce" || effect === "marker") {
    scale = 0.96 + 0.04 * exit;
  }

  const chars = Array.from(text);
  const mainText = effect === "bounce"
    ? chars.map((ch, i) => {
        const b = spring({ frame: frame - Math.round(i * 0.05 * fps), fps, from: 0, to: 1, config: { damping: 8, stiffness: 260, mass: 0.5 } });
        return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - b) * -90}px) scale(${0.4 + 0.6 * b})`, opacity: Math.min(1, b * 2) }}>{ch === " " ? " " : ch}</span>;
      })
    : text;

  const markerW = interpolate(time, [0.12, 0.42], [0, 100], clamp);
  const stars = [[-0.08, 0.1, 1], [1.04, 0.05, 0.8], [0.9, 0.95, 0.6], [0.05, 0.9, 0.55]];
  const lines = Array.from({ length: 10 }, (_, i) => i);
  const lineP = interpolate(time, [0.1, 0.45], [0, 1], clamp);
  const coins = [[-1.05, -0.55], [-0.6, -1.05], [-0.1, -1.25], [0.45, -1.1], [1.0, -0.6], [-1.15, 0.35], [1.15, 0.3]];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", perspective: 900 }}>
      {effect === "slam" && lineP > 0 && lineP < 1 && (
        <svg width="1000" height="240" viewBox="-500 -120 1000 240" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -500, marginTop: -120, overflow: "visible" }}>
          {lines.map((i) => {
            const a = (i / 10) * Math.PI * 2 + 0.3;
            const r0 = 230 + lineP * 120, r1 = r0 + 70 * (1 - lineP);
            return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0 * 0.45} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1 * 0.45} stroke={i % 2 ? "#FFFFFF" : "#F8DF54"} strokeWidth={10} strokeLinecap="round" opacity={1 - lineP} />;
          })}
        </svg>
      )}
      <div style={{ position: "relative", transform: `translate(${tx}px, ${ty}px) rotate(${rotate + extraRot}deg) skewX(-8deg) translateX(${-slide * 120}px) rotateX(${rotX}deg) scale(${scale})`, opacity: appear * exit, filter: blur ? `blur(${blur}px)` : undefined }}>
        {effect === "trail" && [2, 1].map((k) => (
          <div key={k} style={{ ...base, position: "absolute", left: -k * 45 * slide, top: 0, opacity: 0.28 * trailAlpha / k, filter: "blur(3px)" }}>{text}</div>
        ))}
        {effect === "marker" && (
          <div style={{ position: "absolute", left: "-3%", bottom: "2%", height: "30%", width: `${markerW * 1.06}%`, background: "#F8DF54", borderRadius: "10px 14px 8px 16px", transform: "rotate(-1.5deg)", boxShadow: "3px 5px 8px rgba(20,20,20,0.35)" }} />
        )}
        {effect === "coin" && coins.map(([x, y], i) => {
          const t0 = 0.06 + i * 0.04;
          const c = interpolate(time, [t0, t0 + 0.6], [0, 1], clamp);
          if (c <= 0) return null;
          const st = size * 0.62;
          const halfW = chars.length * size * 0.5 + st * 0.6;
          const e = 1 - Math.pow(1 - c, 3);
          const ox = x * halfW * e, oy = y * size * 1.1 * e + 120 * c * c * 0.35;
          const spin = Math.cos(time * 12 + i);
          return (
            <svg key={i} width={st} height={st} viewBox="0 0 100 100" style={{ position: "absolute", left: `calc(50% - ${st / 2}px + ${ox}px)`, top: `calc(50% - ${st / 2}px + ${oy}px)`, transform: `scaleX(${0.25 + 0.75 * Math.abs(spin)})`, opacity: Math.min(1, (1.15 - c) * 3), filter: "drop-shadow(2px 4px 3px rgba(20,20,20,0.5))" }}>
              <circle cx="50" cy="50" r="46" fill="#F8DF54" stroke="#A68F2A" strokeWidth="7" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#A68F2A" strokeWidth="5" />
              <text x="50" y="62" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="34" fill="#A68F2A">$</text>
            </svg>
          );
        })}
        <div style={{ ...base, position: "relative", textShadow: shadow }}>{mainText}</div>
        {effect === "shake" && [[1.02, -0.1, 1], [-0.1, -0.05, 0.75]].map(([x, y, s], i) => {
          const pulse = 0.85 + 0.25 * Math.abs(Math.sin(time * 9 + i));
          const st = size * 0.55 * s * pulse;
          return (
            <svg key={i} width={st} height={st} viewBox="0 0 100 100" style={{ position: "absolute", left: `calc(${x * 100}% - ${st / 2}px)`, top: `calc(${y * 100}% - ${st / 2}px)`, filter: "drop-shadow(2px 3px 2px rgba(20,20,20,0.45))" }}>
              <g fill="none" stroke={i ? "#FFFFFF" : "#F8DF54"} strokeWidth="12" strokeLinecap="round">
                <path d="M 38 8 Q 42 30 18 36" /><path d="M 62 8 Q 58 30 82 36" /><path d="M 38 92 Q 42 70 18 64" /><path d="M 62 92 Q 58 70 82 64" />
              </g>
            </svg>
          );
        })}
        {sparkle
          ? stars.map(([x, y, s], i) => {
              const tw = 0.6 + 0.4 * Math.abs(Math.sin(time * 5 + i * 1.7));
              const st = size * 0.42 * s * tw;
              return (
                <svg key={i} width={st} height={st} viewBox="0 0 100 100" style={{ position: "absolute", left: `calc(${x * 100}% - ${st / 2}px)`, top: `calc(${y * 100}% - ${st / 2}px)`, filter: "drop-shadow(0 0 6px rgba(255,236,140,0.9))" }}>
                  <path d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z" fill="#FFF6C8" />
                </svg>
              );
            })
          : null}
      </div>
    </div>
  );
}
