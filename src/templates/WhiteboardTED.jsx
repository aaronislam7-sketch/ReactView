import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const WhiteboardTED = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const colors = scene.style_tokens.colors;
  const fonts = scene.style_tokens.fonts;
  
  // Helper to get animation progress for a timeline action
  const getActionProgress = (action) => {
    const startFrame = action.t * fps;
    const duration = (action.duration || 0.5) * fps;
    
    return interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  };
  
  // Get all actions by type
  const getAction = (actionType, target = null) => {
    return scene.timeline.find(
      a => a.action === actionType && (!target || a.target === target)
    );
  };
  
  const getAllActions = (actionType) => {
    return scene.timeline.filter(a => a.action === actionType);
  };
  
  // Board animation
  const boardAction = getAction('boardIn');
  const boardProgress = boardAction ? getActionProgress(boardAction) : 1;
  const boardScale = spring({
    frame: frame - boardAction?.t * fps || 0,
    fps,
    config: { damping: 12 }
  });
  
  // Text animations
  const titleAction = getAction('drawText', 'title');
  const titleProgress = titleAction ? getActionProgress(titleAction) : 0;
  
  const subtitleAction = getAction('drawText', 'subtitle');
  const subtitleProgress = subtitleAction ? getActionProgress(subtitleAction) : 0;
  
  const b1Action = getAction('drawText', 'b1');
  const b1Progress = b1Action ? getActionProgress(b1Action) : 0;
  
  const b2Action = getAction('drawText', 'b2');
  const b2Progress = b2Action ? getActionProgress(b2Action) : 0;
  
  const b3Action = getAction('drawText', 'b3');
  const b3Progress = b3Action ? getActionProgress(b3Action) : 0;
  
  // Image animations
  const imageLargeAction = getAction('drawImage', 'image_right_large');
  const imageLargeProgress = imageLargeAction ? getActionProgress(imageLargeAction) : 0;
  
  const imageSmallAction = getAction('drawImage', 'image_right_small');
  const imageSmallProgress = imageSmallAction ? getActionProgress(imageSmallAction) : 0;
  
  // Character animation
  const characterAction = getAction('characterEnter');
  const characterProgress = characterAction ? getActionProgress(characterAction) : 0;
  
  // Arrow animations
  const arrowActions = getAllActions('arrowTo');
  const activeArrow = arrowActions.find(a => {
    const start = a.t * fps;
    const end = start + (a.duration || 1) * fps;
    return frame >= start && frame <= end;
  });
  
  const arrowProgress = activeArrow ? getActionProgress(activeArrow) : 0;
  
  // Element positions (layout)
  const positions = {
    title: { x: 960, y: 120 },
    subtitle: { x: 960, y: 200 },
    b1: { x: 200, y: 400 },
    b2: { x: 200, y: 520 },
    b3: { x: 200, y: 640 },
    image_right_large: { x: 1400, y: 350 },
    image_right_small: { x: 1400, y: 700 },
    character_anchor: { x: 100, y: 800 }
  };
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Whiteboard */}
      <div style={{
        width: 1800,
        height: 950,
        backgroundColor: colors.board,
        border: `4px solid ${colors.boardStroke}`,
        borderRadius: 12,
        transform: `scale(${boardScale})`,
        opacity: boardProgress,
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}>
        
        {/* Title */}
        {titleProgress > 0 && (
          <div style={{
            position: 'absolute',
            left: positions.title.x,
            top: positions.title.y,
            transform: 'translateX(-50%)',
            fontFamily: fonts.title.family,
            fontSize: fonts.title.size,
            fontWeight: fonts.title.weight,
            color: colors.accent,
            opacity: titleProgress,
            maxWidth: 1600
          }}>
            {scene.fill.texts.title}
          </div>
        )}
        
        {/* Subtitle */}
        {subtitleProgress > 0 && (
          <div style={{
            position: 'absolute',
            left: positions.subtitle.x,
            top: positions.subtitle.y,
            transform: 'translateX(-50%)',
            fontFamily: fonts.subtitle.family,
            fontSize: fonts.subtitle.size,
            fontWeight: fonts.subtitle.weight,
            color: colors.ink,
            opacity: subtitleProgress
          }}>
            {scene.fill.texts.subtitle}
          </div>
        )}
        
        {/* Bullets */}
        {b1Progress > 0 && (
          <div style={{
            position: 'absolute',
            left: positions.b1.x,
            top: positions.b1.y,
            fontFamily: fonts.body.family,
            fontSize: fonts.body.size,
            color: colors.ink,
            opacity: b1Progress,
            transform: `translateX(${interpolate(b1Progress, [0, 1], [-50, 0])}px)`
          }}>
            • {scene.fill.texts.b1}
          </div>
        )}
        
        {b2Progress > 0 && (
          <div style={{
            position: 'absolute',
            left: positions.b2.x,
            top: positions.b2.y,
            fontFamily: fonts.body.family,
            fontSize: fonts.body.size,
            color: colors.ink,
            opacity: b2Progress,
            transform: `translateX(${interpolate(b2Progress, [0, 1], [-50, 0])}px)`
          }}>
            • {scene.fill.texts.b2}
          </div>
        )}
        
        {b3Progress > 0 && (
          <div style={{
            position: 'absolute',
            left: positions.b3.x,
            top: positions.b3.y,
            fontFamily: fonts.body.family,
            fontSize: fonts.body.size,
            color: colors.ink,
            opacity: b3Progress,
            transform: `translateX(${interpolate(b3Progress, [0, 1], [-50, 0])}px)`
          }}>
            • {scene.fill.texts.b3}
          </div>
        )}
        
        {/* Images */}
        {imageLargeProgress > 0 && scene.fill.images.image_right_large && (
          <img
            src={scene.fill.images.image_right_large}
            style={{
              position: 'absolute',
              left: positions.image_right_large.x,
              top: positions.image_right_large.y,
              width: 350,
              height: 250,
              objectFit: 'contain',
              opacity: imageLargeProgress,
              transform: `scale(${imageLargeProgress})`
            }}
            alt="Large visual"
          />
        )}
        
        {imageSmallProgress > 0 && scene.fill.images.image_right_small && (
          <img
            src={scene.fill.images.image_right_small}
            style={{
              position: 'absolute',
              left: positions.image_right_small.x,
              top: positions.image_right_small.y,
              width: 200,
              height: 150,
              objectFit: 'contain',
              opacity: imageSmallProgress,
              transform: `scale(${imageSmallProgress})`
            }}
            alt="Small visual"
          />
        )}
        
        {/* Character */}
        {characterProgress > 0 && (
          <div style={{
            position: 'absolute',
            left: positions.character_anchor.x,
            top: positions.character_anchor.y,
            width: 80,
            height: 120,
            backgroundColor: colors.support,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            opacity: characterProgress,
            transform: `translateY(${interpolate(characterProgress, [0, 1], [100, 0])}px)`
          }}>
            {/* Simple character representation */}
            <div style={{
              position: 'absolute',
              top: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 40,
              backgroundColor: colors.accent,
              borderRadius: '50%'
            }} />
          </div>
        )}
        
        {/* Active Arrow */}
        {activeArrow && arrowProgress > 0 && (() => {
          const fromPos = positions[activeArrow.from] || positions.character_anchor;
          const toPos = positions[activeArrow.target];
          
          if (!toPos) return null;
          
          const arrowLength = interpolate(arrowProgress, [0, 1], [0, 1]);
          
          return (
            <svg style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill={colors.accent} />
                </marker>
              </defs>
              <line
                x1={fromPos.x + 40}
                y1={fromPos.y}
                x2={fromPos.x + 40 + (toPos.x - fromPos.x - 40) * arrowLength}
                y2={fromPos.y + (toPos.y - fromPos.y) * arrowLength}
                stroke={colors.accent}
                strokeWidth="4"
                markerEnd="url(#arrowhead)"
                opacity={arrowProgress}
              />
            </svg>
          );
        })()}
      </div>
    </div>
  );
};
