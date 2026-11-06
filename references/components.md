# 组件说明（MG 动画 + 像素特效）

所有 MG 都是 Remotion 组件：作为 Motion Graphic 资产导入（给出宽、高、时长、属性表），再在时间线上放实例并用属性覆盖文字和时间。
动画时间一律用秒（`frame / fps`），不写死帧率。代码里的 `【xxx】` 是占位文字，必须用原话替换。
**同一套文件要放在同一个目录**（版式文件 `import ... from "./collage-kit.jsx"`）。导入后属性表里要写全用到的键，否则实例覆盖不生效。

## A. 文字类

### HuaZi.jsx — 花字重点词
- 资产 1000×240，时长 6 秒（实例按需截短）。放置：**left 40、top 1075**、width 1000、height 240（紧贴字幕上方）。
- 属性：`text`；`color` #F8DF54 或 #FFFFFF；`extrudeColor` 留空（黄字自动 #A68F2A）；`rotate` -3；`sparkle`（布尔）；`fontSize` 最大 112；`fontFamily` Noto Sans SC；`effect` trail / slam / shake / coin / flip / bounce / marker。
- 特效：trail 拖影滑入；slam 2.4 倍砸下 + 冲击线；shake 抖动 + 生气符号；coin 金币飞散；flip 3D 翻牌；bounce 逐字掉落弹跳；marker 黄色马克笔下划线（配白字）。出现 0.08 秒淡入，最后 0.15 秒淡出。
- 字太长贴到画面边缘时，缩短成原话里的关键部分。

### StrikeText.jsx — 删除线花字（"不要…"）
- 资产 1000×360，放 left 40、top 860。属性：`text`、`accentColor` #F8DF54、`fontSize` 96、`fontFamily`。
- 禁止图标弹出 → 白字出现 → 黄色横条划掉。同时人物视频缩成画中画黑底（left 151、top 269、width 778、height 1383）。

### TypeLine.jsx — 黑底圆框段的打字字幕
- 资产 1080×200，放 left 0、top 1250（文字中心约 y 1350，和字幕同位置）。时长 = 该段时长。
- 属性：`lines`（该段字幕句子，用 `|` 分隔）、`times`（每句开始时间，秒，相对本段开始，用 `,` 分隔）、`fontSize` 70、`fontFamily` Noto Sans SC。
- 每句用该句讲话时长的 75% 逐字打完，带浅灰光标；字体、阴影和字幕一致。该段原字幕隐藏。
- 配合：背景轨这段留空（纯黑）；人物视频裁成圆框（SKILL.md 7.1 的数值，borderRadius = 圆框半径）；Keyboard Typing Loop -14 dB。

### MarkerText.jsx — 马克笔高亮字（备用）
- 资产 1000×240。白色粗斜体字 + 黄色高亮条扫入。

## B. 全屏 MG（2nd Collage 复古撕纸，1080×1920）

公共：`collage-kit.jsx`（四色、纸底和牛皮纸色带、撕边纸卡、横条 StripRow（可带解说小字）、胶带、标题条、贴入动效、红星、手绘箭头、细线图标、自动缩字号、人物照片位置、内容列让位）。

放置：
- 背景实例 `layer:"bg"` 放主视频**下方**背景轨，全屏 0,0,1080,1920。
- 前景实例 `layer:"fg"`（只有照片顶部胶带）放主视频**上方**，时间与背景实例完全相同。
- 人物视频在两者之间：在 MG 起点、第一个要点那一帧、MG 终点切开，按 SKILL.md 8.3 设位置和裁切（硬切，不加关键帧）。
- 实例覆盖属性时，同一实例原有的覆盖（如 title、sub、layer）要一起带上再写。

### 公共属性（所有版式）

| 属性 | 说明 |
|---|---|
| `num` | 砖红序号（"01"…，可空） |
| `title` | 标题（同类内容统一，例「学员案例」） |
| `sub` | 标题下小字（例「做 Property 的学员」，可空） |
| `layer` | bg / fg |
| `photoMode` | **band**（人物在色带里，默认用这个）/ corner（旧：底部角落，已不用） |
| `photoMoveAt` | 人物从"放大居中"切到"缩小"的时间（秒）=（第一个要点的帧 − 0.5）÷ 30 |
| `photoSide` | right / left（相邻 MG 交替） |
| `photoSlot` | side（默认：人物在色带一侧，内容排到另一侧 640px 列）/ below（人物在色带下部，内容整宽） |
| `fontFamily` / `numFontFamily` | Xinqingnian Ti / Archivo Black |
| `label` / `labelAt` | 已停用（底部不放解说） |

人物照片 V（相框每边多 16px）：放大 260,445,560,652；侧边右 735,560,300,349；侧边左 45,560,300,349；下部 y 905。

### 各版式专有属性（时间都是秒，相对 MG 开始）

| 文件 | 版式 | 专有属性 |
|---|---|---|
| collage-flow.jsx | 步骤 / 流程 / 因果链 | `s1`–`s3` 要点；`sub1`–`sub3` 要点下解说小字、`st1`–`st3` 解说时间；`icon1`–`icon3`（空字符串 = 不要图标）；`t1`–`t3`；`lastRed`（默认 true）；`accent`/`accentAt`（一般留空，解说写进 sub） |
| collage-compare.jsx | 数字对比 | `l1`–`l3`、`r1`–`r3` 格式 `数字\|单位`，行首 `*` = 砖红；`lt1`–`lt3`、`rt1`–`rt3`；`lHead`/`rHead`；`lColor`/`rColor`；`accent`/`accentAt` |
| collage-infocard.jsx | 结构 / 要素 / 案例结果 | `head`、`headIcon`、`headAt`；`l1`–`l3`（`前缀\|内容`）、`lt1`–`lt3`；`tag` 红色标签、`tagAt`；`note`/`noteAt`；`accent`/`accentAt`（与 note 二选一）。band 模式下纸卡在 `photoMoveAt` 才贴出，人物放大期间不露空纸卡；字多时用 `photoSlot:"below"` |
| collage-icon-note.jsx | 单一工具 / 概念 / 答案 | `icon`、`iconAt`；`text`、`textAt`；`textSub` 解说小字、`textSubAt`；`strikeText` 被划掉的红字、`strikeAt` |
| collage-not-but.jsx | 不是 X 而是 Y / 前后转变 | `notText`、`notAt`、`strikeAt`；`notSub` 划掉原因小字、`notSubAt`；`butLead` 新做法、`butLeadAt`；`butText` 大号红字成果、`butSub` 补充、`butAt`；`accent`/`accentAt` |
| collage-question.jsx | 问题 / 痛点 | `q1`–`q3`、`t1`–`t3`；`accent`/`accentAt` |
| collage-checklist.jsx | 清单 | `i1`–`i4`、`t1`–`t4`；`accent`/`accentAt` |

可用图标：search、user、check、house、phone、chat、money、camera、calendar、star。

注意：
- 所有版式在 `photoMode:"band"` + `photoSlot:"side"` 时都会把内容让到人物另一侧；任何新增素材也要避开人物和文字。
- 字幕区 y≈1300–1400 保持空白；文字过长会自动缩字号，仍要抽帧检查。
- MG 里和字幕完全相同的句子（包括解说小字），最后一步隐藏对应字幕。

## C. 像素特效

### effects/flash-zoom-in.ts — 开场闪白入场
- 以 pixel-effect 导入，属性 duration 0.2、zoom 0.3、blur 0.25、flash 0.55。
- 轨道区间特效，放主视频上方的空轨，第 0–9 帧。画面从放大 + 径向模糊 + 过曝闪白快速收回清晰。

（人物抠像描边特效已永久移除，不再提供。）
