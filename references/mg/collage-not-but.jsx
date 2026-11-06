import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, cnFont, fit, CollageShell, TornCard, Paste, AccentLine, ramp, bandColumn } from "./collage-kit.jsx";

// 版式：「不是 X，而是 Y」/ 方法对比（旧做法纸条被红线划掉 → 新做法大号红字纸卡）
export default function CollageNotBut({ item }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const p = item.props || {};
  const notText = p.notText ?? "【notText】";
  const butText = p.butText ?? "【butText】";
  const strikeAt = p.strikeAt ?? 1.4;
  const sw = ramp(time, strikeAt, strikeAt + 0.3);
  const col = bandColumn(p) ?? { x: 90, w: 900 };
  const tw = col.w - 100;
  const ns = fit(notText, tw - 40, 66);
  const notH = p.notSub ? 240 : 180;
  const butY = 470 + notH + 50;
  const lead = p.butLead;
  const butH = 230 + (lead ? 70 : 0) + (p.butSub ? 70 : 0);
  const butShow = Math.min(p.butAt ?? 2.2, lead ? p.butLeadAt ?? 2.2 : Infinity);
  const butIn = ramp(time, p.butAt ?? 2.2, (p.butAt ?? 2.2) + 0.14);
  return (
    <CollageShell p={p} time={time}>
      <Paste at={p.notAt ?? 0.4} time={time} style={{ position: "absolute", inset: 0 }}>
        <TornCard x={col.x} y={470} w={col.w} h={notH} rot={-1} seed="not">
          <div style={{ position: "absolute", inset: 0, padding: "0 50px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
            <div style={{ position: "relative", alignSelf: "flex-start" }}>
              <span style={{ fontFamily: cnFont(p), fontSize: ns, color: C.INK, whiteSpace: "nowrap" }}>{notText}</span>
              <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", left: -10, top: "40%", width: "calc(100% + 20px)", height: 22, overflow: "visible" }}>
                <path d="M0 13 C 25 5, 55 15, 100 6" fill="none" stroke={C.MARK} strokeWidth="9" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - sw} />
              </svg>
            </div>
            {/* 被划掉做法的解说，写在它下面 */}
            {p.notSub ? <span style={{ fontFamily: cnFont(p), fontSize: fit(p.notSub, tw, 44), color: C.MARK, whiteSpace: "nowrap", opacity: ramp(time, p.notSubAt ?? strikeAt, (p.notSubAt ?? strikeAt) + 0.14) }}>{p.notSub}</span> : null}
          </div>
        </TornCard>
      </Paste>
      <Paste at={butShow} time={time} style={{ position: "absolute", inset: 0 }}>
        <TornCard x={col.x} y={butY} w={col.w} h={butH} rot={0.8} seed="but" amp={8}>
          <div style={{ position: "absolute", inset: 0, padding: "0 50px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
            {lead ? <span style={{ fontFamily: cnFont(p), fontSize: fit(lead, tw, 50), color: C.INK, whiteSpace: "nowrap" }}>{lead}</span> : null}
            <span style={{ fontFamily: cnFont(p), fontSize: fit(butText, tw, 100), color: C.MARK, whiteSpace: "nowrap", lineHeight: 1.1, opacity: butIn }}>{butText}</span>
            {p.butSub ? <span style={{ fontFamily: cnFont(p), fontSize: fit(p.butSub, tw, 46), color: C.INK, whiteSpace: "nowrap", opacity: butIn }}>{p.butSub}</span> : null}
          </div>
        </TornCard>
      </Paste>
      <AccentLine text={p.accent} at={p.accentAt ?? 3.4} time={time} p={p} top={1160} />
    </CollageShell>
  );
}
