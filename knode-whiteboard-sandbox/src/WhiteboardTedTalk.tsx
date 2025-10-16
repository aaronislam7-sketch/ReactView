
import React from 'react';
type Scene = typeof import('./scene-spec.json');
type TextBox = Scene['layout']['placeholders']['text_boxes'][number];
type ImageSlot = Scene['layout']['placeholders']['image_slots'][number];

export const WhiteboardTedTalk: React.FC<{scene: Scene}> = ({scene}) => {
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    let start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      setSeconds((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const {style_tokens: S, layout: L, fill: F, timeline} = scene;

  const tb = (id: string): TextBox =>
    L.placeholders.text_boxes.find((t) => t.id === id)!;
  const img = (id: string): ImageSlot =>
    L.placeholders.image_slots.find((i) => i.id === id)!;
  const anchor = L.placeholders.character_anchor;

  const isLive = (t:number, d=0.6) => seconds >= t && seconds <= (t+d+0.1);

  const targetPoint = (targetId: string) => {
    const t = L.placeholders.text_boxes.find(x => x.id === targetId);
    if (t) return {x: t.x - 16, y: t.y - 16};
    const s = L.placeholders.image_slots.find(x => x.id === targetId);
    if (s) return {x: s.x + 10, y: s.y + 10};
    return {x: anchor.x, y: anchor.y};
  };

  const arrowCues = timeline.filter(a => a.action === 'arrowTo');

  return (
    <svg viewBox={`0 0 ${L.canvas.w} ${L.canvas.h}`} width="100%" height="100%" style={{background: S.colors.bg}}>
      {/* Board */}
      <rect x={40} y={40} width={L.canvas.w-80} height={L.canvas.h-80}
            fill={S.colors.board} stroke={S.colors.boardStroke} strokeWidth={3} rx={14} />

      {/* Title */}
      {isLive(0.4) && (
        <text x={tb('title').x} y={tb('title').y}
          style={{fontFamily: S.fonts.title.family, fontWeight: S.fonts.title.weight,
                  fontSize: S.fonts.title.size, fill: S.colors.ink}}>
          {F.texts.title}
        </text>
      )}

      {/* Subtitle */}
      {isLive(0.8) && (
        <text x={tb('subtitle').x} y={tb('subtitle').y}
          style={{fontFamily: S.fonts.subtitle.family, fontWeight: S.fonts.subtitle.weight,
                  fontSize: S.fonts.subtitle.size, fill: S.colors.accent}}>
          {F.texts.subtitle}
        </text>
      )}

      {/* Character stub */}
      {isLive(1.0, 0.8) && (
        <g transform={`translate(${anchor.x}, ${anchor.y})`}>
          <circle cx={0} cy={0} r={40} fill={S.colors.ink} />
          <rect x={-20} y={-110} width={40} height={80} fill={S.colors.ink} />
          <text x={-40} y={60} style={{fontFamily: S.fonts.subtitle.family, fontSize: 14, fill: S.colors.support}}>
            {F.character.pose}
          </text>
        </g>
      )}

      {/* Bullets */}
      {['b1','b2','b3'].map((id) => {
        const a = timeline.find(x => x.action==='drawText' && x.target===id);
        if (!a || !isLive(a.t, a.duration || 0.8)) return null;
        const box = tb(id);
        return (
          <g key={id}>
            <circle cx={box.x-16} cy={box.y-18} r={5} fill={S.colors.accent}/>
            <foreignObject x={box.x} y={box.y-40} width={box.w} height={96}>
              <div style={{fontFamily: S.fonts.body.family, fontSize: S.fonts.body.size, color: S.colors.ink, lineHeight: 1.15}}>
                {(F.texts as any)[id]}
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Images */}
      {['image_right_large','image_right_small'].map((iid) => {
        const a = timeline.find(x => x.action==='drawImage' && x.target===iid);
        if (!a || !isLive(a.t, a.duration || 0.6)) return null;
        const slot = img(iid);
        const url = (F.images as any)[iid] as string;
        return (
          <g key={iid}>
            <image href={url} x={slot.x} y={slot.y} width={slot.w} height={slot.h} preserveAspectRatio="xMidYMid meet" />
            <rect x={slot.x} y={slot.y} width={slot.w} height={slot.h} fill="none" stroke="#d9d9d9" strokeDasharray="6 6" rx={8}/>
          </g>
        );
      })}

      {/* Arrows */}
      {arrowCues.map((cue, i) => {
        const start = cue.t;
        const dur = cue.duration || 1.0;
        if (!isLive(start, dur)) return null;

        const p = Math.min(1, Math.max(0, (seconds - start) / dur));
        const from = {x: anchor.x + 100, y: anchor.y - 160};
        const to = targetPoint(cue.target as string);
        const endX = from.x + (to.x - from.x) * p;
        const endY = from.y + (to.y - from.y) * p;

        return (
          <g key={i} opacity={p < 0.05 ? 0 : 1}>
            <line x1={from.x} y1={from.y} x2={endX} y2={endY} stroke={S.colors.ink} strokeWidth={5} strokeLinecap="round" />
            <polygon points={`${endX},${endY} ${endX-14},${endY-6} ${endX-14},${endY+6}`} fill={S.colors.ink} />
          </g>
        );
      })}

      {/* Footer */}
      <text x={L.canvas.w - 220} y={L.canvas.h - 40} style={{fontFamily: S.fonts.subtitle.family, fontSize: 16, fill: '#8a8a8a'}}>
        Knode · Demo Scene
      </text>
    </svg>
  );
};
