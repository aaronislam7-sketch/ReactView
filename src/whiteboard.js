// Knode Whiteboard — zero-npm player.
// Draws a TED/whiteboard scene from JSON into a given <svg>.

export function boot(scene, svgEl) {
  const S = scene.style_tokens;
  const L = scene.layout;
  const F = scene.fill;
  const T = scene.timeline;

  // Reset SVG
  svgEl.setAttribute('viewBox', `0 0 ${L.canvas.w} ${L.canvas.h}`);
  svgEl.style.background = S.colors.bg;
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  // Helpers to find placeholders
  const tb = (id) => L.placeholders.text_boxes.find((t) => t.id === id);
  const img = (id) => L.placeholders.image_slots.find((i) => i.id === id);
  const anchor = L.placeholders.character_anchor;

  // Create basic stage (board)
  svgEl.appendChild(rect(40, 40, L.canvas.w - 80, L.canvas.h - 80, {
    fill: S.colors.board, stroke: S.colors.boardStroke, strokeWidth: 3, rx: 14
  }));

  // Keep references so we can show/hide on timeline
  const nodes = {
    title: textNode(tb('title'), F.texts.title, fontStyle(S, 'title'), S.colors.ink),
    subtitle: textNode(tb('subtitle'), F.texts.subtitle, fontStyle(S, 'subtitle'), S.colors.accent),
    b1: richText(tb('b1'), F.texts.b1, fontStyle(S, 'body'), S.colors.ink),
    b2: richText(tb('b2'), F.texts.b2, fontStyle(S, 'body'), S.colors.ink),
    b3: richText(tb('b3'), F.texts.b3, fontStyle(S, 'body'), S.colors.ink),
    image_right_large: imageNode(img('image_right_large'), F.images.image_right_large),
    image_right_small: imageNode(img('image_right_small'), F.images.image_right_small),
    character: characterNode(anchor, S),
  };

  // Add to stage (hidden initially)
  Object.values(nodes).forEach((g) => svgEl.appendChild(g));

  // Arrow group on top
  const arrowsLayer = group();
  svgEl.appendChild(arrowsLayer);

  // Timeline engine
  let raf, start = performance.now();
  const seconds = () => (performance.now() - start) / 1000;

  const tick = () => {
    const t = seconds();

    // Show items whose action window is live
    showIf(t, T, 'drawText', 'title', nodes);
    showIf(t, T, 'drawText', 'subtitle', nodes);
    ['b1','b2','b3'].forEach(id => showIf(t, T, 'drawText', id, nodes));
    ['image_right_large','image_right_small'].forEach(id => showIf(t, T, 'drawImage', id, nodes));
    showIf(t, T, 'characterEnter', 'character', nodes);

    // Draw pointer arrows for current cue
    while (arrowsLayer.firstChild) arrowsLayer.removeChild(arrowsLayer.firstChild);
    T.filter(a => a.action === 'arrowTo').forEach((cue) => {
      const live = isLive(t, cue.t, cue.duration || 1.0);
      if (!live) return;
      const p = progress(t, cue.t, cue.duration || 1.0);
      const from = {x: anchor.x + 100, y: anchor.y - 160};
      const to = targetPoint(cue.target);
      const endX = from.x + (to.x - from.x) * p;
      const endY = from.y + (to.y - from.y) * p;
      arrowsLayer.appendChild(line(from.x, from.y, endX, endY, {stroke: S.colors.ink, strokeWidth: 5, strokeLinecap:'round'}));
      arrowsLayer.appendChild(triangle(endX, endY, 14, S.colors.ink));
    });

    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);

  // Utility functions
  function isLive(now, start, dur=0.6){ return now >= start && now <= (start+dur+0.1); }
  function progress(now, start, dur){ return Math.min(1, Math.max(0, (now - start) / dur)); }

  function targetPoint(id){
    const t = tb(id); if (t) return {x: t.x - 16, y: t.y - 16};
    const s = img(id); if (s) return {x: s.x + 10, y: s.y + 10};
    return {x: anchor.x, y: anchor.y};
  }

  function showIf(now, timeline, action, id, ref){
    const a = timeline.find(x => x.action === action && (x.target === id || (id==='character' && x.anchor === 'kno_anchor')));
    if (!a) return;
    ref[id].setAttribute('opacity', isLive(now, a.t, a.duration || 0.8) ? 1 : 0);
  }

  function fontStyle(S, key){
    const f = S.fonts[key];
    return `font-family:${f.family}; font-weight:${f.weight}; font-size:${f.size}px;`;
  }

  function group(attrs={}){ const g = el('g'); set(g, attrs); return g; }
  function rect(x,y,w,h,attrs={}){ const r = el('rect'); set(r,{x,y,width:w,height:h,...attrs}); return r; }
  function line(x1,y1,x2,y2,attrs={}){ const l = el('line'); set(l,{x1,y1,x2,y2,...attrs}); return l; }
  function triangle(x,y,size,fill){ const p = el('polygon'); p.setAttribute('points', `${x},${y} ${x-size},${y-6} ${x-size},${y+6}`); p.setAttribute('fill', fill); return p; }
  function textNode(box, text, css, fill){
    const t = el('text'); set(t,{x:box.x, y:box.y}); t.setAttribute('style', css); t.setAttribute('fill', fill); t.textContent = text; return t;
  }
  function richText(box, text, css, fill){
    const g = group(); const fo = el('foreignObject'); set(fo,{x:box.x, y:box.y-40, width:box.w, height:96});
    const div = document.createElement('div'); div.setAttribute('style', `${css}; color:${fill}; line-height:1.15`);
    div.textContent = text; fo.appendChild(div); g.appendChild(circle(box.x-16, box.y-18, 5, S.colors.accent)); g.appendChild(fo); return g;
  }
  function imageNode(slot, url){
    const g = group(); const im = el('image'); set(im,{href:url, x:slot.x, y:slot.y, width:slot.w, height:slot.h, preserveAspectRatio:'xMidYMid meet'});
    const frame = rect(slot.x, slot.y, slot.w, slot.h, {fill:'none', stroke:'#d9d9d9', strokeDasharray:'6 6', rx:8});
    g.appendChild(im); g.appendChild(frame); return g;
  }
  function characterNode(anchor, S){
    const g = group(); const head = el('circle'); set(head,{cx:0, cy:0, r:40, fill:S.colors.ink});
    const body = rect(-20, -110, 40, 80, {fill:S.colors.ink});
    const label = el('text'); set(label,{x:-40,y:60}); label.setAttribute('style', `font: 14px system-ui; fill:${S.colors.support}`); label.textContent = 'teacher';
    g.appendChild(head); g.appendChild(body); g.appendChild(label); g.setAttribute('transform', `translate(${anchor.x}, ${anchor.y})`); return g;
  }
  function circle(cx,cy,r,fill){ const c = el('circle'); set(c,{cx,cy,r,fill}); return c; }
  function el(tag){ return document.createElementNS('https://esp01.safelinks.protection.outlook.com/?url=http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg&data=05%7C02%7C%7C8b3eaf31d3024d2d3eb208de0cef7c24%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C638962419880527174%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=8x4kQhCEf909QxGYKXF5trsu7ikPt1JPeN4DjpEPlc4%3D&reserved=0', tag); }
  function set(node, attrs){ Object.entries(attrs).forEach(([k,v]) => node.setAttribute(k, String(v))); }

  // return a stopper
  return () => cancelAnimationFrame(raf);
}
