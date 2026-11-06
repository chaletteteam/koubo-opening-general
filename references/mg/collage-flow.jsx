import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, CollageShell, Paste, StripRow, HandArrow, AccentLine, ramp, bandColumn } from "./collage-kit.jsx";

// 版式：步骤 / 流程（A → B → C）
// 三张撕边横条按讲话逐张贴入，之间红色手绘箭头；最后一步红字+红勾
export default function CollageFlow({ item }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const p = item.props || {};
  const steps = [
    [p.s1, p.icon1 ?? "search", p.t1 ?? 0.4, p.sub1, p.st1],
    [p.s2, p.icon2 ?? "user", p.t2 ?? 1.6, p.sub2, p.st2],
    [p.s3, p.icon3 ?? "check", p.t3 ?? 2.8, p.sub3, p.st3],
  ].filter(([s]) => s);
  // 人物在色带里时，纸条变窄并让到另一侧，和照片不重叠
  const col = bandColumn(p) ?? { x: 115, w: 850 };
  const sx = col.x, sw = col.w, ax = sx + sw / 2;
  // 有解说的要点纸条更高；纸条之间留 80px 放箭头
  const hs = steps.map(([, , , sub]) => (sub ? 200 : 150));
  const ys = [];
  hs.forEach((h, i) => ys.push(i === 0 ? 430 : ys[i - 1] + hs[i - 1] + 80));
  return (
    <CollageShell p={p} time={time}>
      {steps.map(([s, icon, t, sub, st], i) => {
        const last = i === steps.length - 1 && (p.lastRed ?? true);
        return (
          <React.Fragment key={i}>
            {i > 0 && <HandArrow x={ax} y={ys[i] - 74} h={62} progress={ramp(time, t - 0.28, t - 0.04)} />}
            <Paste at={t} time={time} style={{ position: "absolute", inset: 0 }}>
              <StripRow x={sx} y={ys[i]} w={sw} h={hs[i]} rot={i % 2 ? 0.6 : -0.5} seed={`flow${i}`} icon={icon} text={s} color={last ? C.MARK : C.INK} size={64} p={p} sub={sub} subAt={st ?? t} time={time} />
            </Paste>
          </React.Fragment>
        );
      })}
      <AccentLine text={p.accent} at={p.accentAt ?? 3.6} time={time} p={p} top={1160} />
    </CollageShell>
  );
}
