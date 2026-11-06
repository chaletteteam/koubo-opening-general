import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, cnFont, fit, CollageShell, TornCard, Paste, LineIcon, HandArrow, StripRow, AccentLine, ramp, bandColumn, isBandPhoto } from "./collage-kit.jsx";

// 版式：结构示意 / 要素拆解（一张大纸卡，标题行 + 要点逐行写上 + 红色标签）
// 要点格式 "前缀|内容" 显示为 "前缀：内容"；没有 | 就整行显示
export default function CollageInfoCard({ item }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const p = item.props || {};
  const lines = [[p.l1, p.lt1 ?? 1.0], [p.l2, p.lt2 ?? 1.8], [p.l3, p.lt3 ?? 2.6]].filter(([s]) => s);
  const noteAt = p.noteAt ?? 3.6;
  const col = bandColumn(p) ?? { x: 70, w: 940 };
  const tw = col.w - 110;
  // 卡片高度随行数变化，下方纸条跟在卡片下面
  const cardH = 175 + 84 * (lines.length + (p.tag ? 1 : 0));
  const noteY = 450 + cardH + 115;
  return (
    <CollageShell p={p} time={time}>
      {/* 人物放大展示期间不露出空纸卡：band 模式下纸卡在人物缩小那一刻贴上 */}
      {isBandPhoto(p) ? <Paste at={p.photoMoveAt ?? 0} time={time} style={{ position: "absolute", inset: 0 }}>
      <TornCard x={col.x} y={450} w={col.w} h={cardH} rot={-0.6} seed="info" amp={8}>
        <div style={{ position: "absolute", left: 54, right: 54, top: 50, display: "flex", flexDirection: "column", gap: 26 }}>
          <Paste at={p.headAt ?? 0.4} time={time} style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <LineIcon name={p.headIcon ?? "house"} size={86} />
            <span style={{ fontFamily: cnFont(p), fontSize: fit(p.head ?? "【head】", tw - 110, 78), color: C.INK, whiteSpace: "nowrap" }}>{p.head ?? "【head】"}</span>
          </Paste>
          {lines.map(([s, t], i) => {
            const [a, b] = s.includes("|") ? s.split("|") : [null, s];
            const txt = a ? `${a}：${b}` : b;
            return (
              <Paste key={i} at={t} time={time}>
                <span style={{ fontFamily: cnFont(p), fontSize: fit(txt, tw, 56), color: C.INK, whiteSpace: "nowrap" }}>{txt}</span>
              </Paste>
            );
          })}
          {p.tag ? (
            <Paste at={p.tagAt ?? 3.0} time={time}>
              <span style={{ fontFamily: cnFont(p), fontSize: fit(p.tag, tw, 52), color: C.MARK, whiteSpace: "nowrap" }}>{p.tag}</span>
            </Paste>
          ) : null}
        </div>
      </TornCard>
      </Paste> : <>
      <TornCard x={col.x} y={450} w={col.w} h={cardH} rot={-0.6} seed="info" amp={8}>
        <div style={{ position: "absolute", left: 54, right: 54, top: 50, display: "flex", flexDirection: "column", gap: 26 }}>
          <Paste at={p.headAt ?? 0.4} time={time} style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <LineIcon name={p.headIcon ?? "house"} size={86} />
            <span style={{ fontFamily: cnFont(p), fontSize: fit(p.head ?? "【head】", tw - 110, 78), color: C.INK, whiteSpace: "nowrap" }}>{p.head ?? "【head】"}</span>
          </Paste>
          {lines.map(([s, t], i) => {
            const [a, b] = s.includes("|") ? s.split("|") : [null, s];
            const txt = a ? `${a}：${b}` : b;
            return (
              <Paste key={i} at={t} time={time}>
                <span style={{ fontFamily: cnFont(p), fontSize: fit(txt, tw, 56), color: C.INK, whiteSpace: "nowrap" }}>{txt}</span>
              </Paste>
            );
          })}
          {p.tag ? (
            <Paste at={p.tagAt ?? 3.0} time={time}>
              <span style={{ fontFamily: cnFont(p), fontSize: fit(p.tag, tw, 52), color: C.MARK, whiteSpace: "nowrap" }}>{p.tag}</span>
            </Paste>
          ) : null}
        </div>
      </TornCard>
      </>}
      {p.note ? <>
        <HandArrow x={col.x + col.w / 2} y={noteY - 100} h={80} progress={ramp(time, noteAt - 0.28, noteAt - 0.04)} />
        <Paste at={noteAt} time={time} style={{ position: "absolute", inset: 0 }}>
          <StripRow x={col.x + 40} y={noteY} w={col.w - 80} h={130} rot={1.2} seed="infoNote" text={p.note} size={56} p={p} />
        </Paste>
      </> : null}
      {/* note 与 accent 二选一（同时给只显示 note），避免压到字幕区 */}
      {!p.note && <AccentLine text={p.accent} at={p.accentAt ?? 4.4} time={time} p={p} top={1160} />}
    </CollageShell>
  );
}
