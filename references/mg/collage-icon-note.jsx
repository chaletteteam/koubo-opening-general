import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, cnFont, fit, CollageShell, TornCard, Paste, LineIcon, StripRow, ramp, bandColumn } from "./collage-kit.jsx";

// 版式：单一工具 / 概念 / 口号（大号线条图标纸卡 + 一句话横条 + 红色划掉的"不需要"）
export default function CollageIconNote({ item }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const p = item.props || {};
  const strikeAt = p.strikeAt ?? 2.6;
  const sw = ramp(time, strikeAt + 0.15, strikeAt + 0.45);
  const strike = p.strikeText;
  const col = bandColumn(p) ?? { x: 110, w: 860 };
  const ss = fit(strike, col.w - 100, 68);
  return (
    <CollageShell p={p} time={time}>
      <Paste at={p.iconAt ?? 0.3} time={time} style={{ position: "absolute", inset: 0 }}>
        <TornCard x={col.x + (col.w - 340) / 2} y={460} w={340} h={300} rot={-1.5} seed="icon" amp={8}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LineIcon name={p.icon ?? "phone"} size={200} />
          </div>
        </TornCard>
      </Paste>
      <Paste at={p.textAt ?? 1.2} time={time} style={{ position: "absolute", inset: 0 }}>
        <StripRow x={col.x} y={815} w={col.w} h={p.textSub ? 210 : 150} rot={-2} seed="iconText" text={p.text ?? "【text】"} size={70} p={p} sub={p.textSub} subAt={p.textSubAt ?? 0} time={time} />
      </Paste>
      {strike ? (
        <Paste at={strikeAt} time={time} style={{ position: "absolute", left: col.x, width: col.w, top: p.textSub ? 1075 : 1020, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontFamily: cnFont(p), fontSize: ss, color: C.MARK, whiteSpace: "nowrap" }}>{strike}</span>
            <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", left: -8, top: "44%", width: "calc(100% + 16px)", overflow: "visible" }}>
              <path d="M0 12 C 30 6, 60 14, 100 7" fill="none" stroke={C.INK} strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - sw} />
            </svg>
          </div>
        </Paste>
      ) : null}
    </CollageShell>
  );
}
