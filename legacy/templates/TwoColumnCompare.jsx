import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const TwoColumnCompare = ({ scene }) => {
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
  
  // Title
  const titleAction = getAction('drawText', 'title');
  const titleProgress = titleAction ? getActionProgress(titleAction) : 0;
  
  // Left column
  const leftH1Action = getAction('drawTextL', 'left_h1');
  const leftH1Progress = leftH1Action ? getActionProgress(leftH1Action) : 0;
  
  const leftH2Action = getAction('drawTextL', 'left_h2');
  const leftH2Progress = leftH2Action ? getActionProgress(leftH2Action) : 0;
  
  const leftImageAction = getAction('drawImageL', 'image_left');
  const leftImageProgress = leftImageAction ? getActionProgress(leftImageAction) : 0;
  
  // Right column
  const rightH1Action = getAction('drawTextR', 'right_h1');
  const rightH1Progress = rightH1Action ? getActionProgress(rightH1Action) : 0;
  
  const rightH2Action = getAction('drawTextR', 'right_h2');
  const rightH2Progress = rightH2Action ? getActionProgress(rightH2Action) : 0;
  
  const rightImageAction = getAction('drawImageR', 'image_right');
  const rightImageProgress = rightImageAction ? getActionProgress(rightImageAction) : 0;
  
  // Arrow swap (focus indicator)
  const arrowSwapActions = scene.timeline.filter(a => a.action === 'arrowSwap');
  const activeArrowSwap = arrowSwapActions.find(a => {
    const start = a.t * fps;
    const end = start + (a.duration || 1) * fps;
    return frame >= start && frame <= end;
  });
  
  // Tick/Cross indicators
  const tickAction = getAction('tick', 'left_h2');
  const tickProgress = tickAction ? getActionProgress(tickAction) : 0;
  
  const crossAction = getAction('cross', 'right_h2');
  const crossProgress = crossAction ? getActionProgress(crossAction) : 0;
  
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
      {/* Main container */}
      <div style={{
        width: 1800,
        height: 950,
        backgroundColor: colors.board,
        border: `4px solid ${colors.boardStroke}`,
        borderRadius: 12,
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: 60
      }}>
        
        {/* Title */}
        {titleProgress > 0 && (
          <div style={{
            fontFamily: fonts.title.family,
            fontSize: fonts.title.size,
            fontWeight: fonts.title.weight,
            color: colors.accent,
            textAlign: 'center',
            marginBottom: 60,
            opacity: titleProgress
          }}>
            {scene.fill.texts.title}
          </div>
        )}
        
        {/* Two columns */}
        <div style={{
          display: 'flex',
          flex: 1,
          gap: 80
        }}>
          
          {/* Left Column */}
          <div style={{
            flex: 1,
            backgroundColor: activeArrowSwap?.target === 'left_h1' ? 'rgba(115, 34, 130, 0.1)' : 'transparent',
            borderRadius: 8,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: `3px solid ${activeArrowSwap?.target === 'left_h1' ? colors.accent : 'transparent'}`,
            transition: 'all 0.3s ease'
          }}>
            
            {leftH1Progress > 0 && (
              <div style={{
                fontFamily: fonts.subtitle.family,
                fontSize: fonts.subtitle.size + 8,
                fontWeight: fonts.subtitle.weight,
                color: colors.accent,
                marginBottom: 20,
                opacity: leftH1Progress
              }}>
                {scene.fill.texts.left_h1}
              </div>
            )}
            
            {leftImageProgress > 0 && scene.fill.images.image_left && (
              <img
                src={scene.fill.images.image_left}
                style={{
                  width: 200,
                  height: 200,
                  objectFit: 'contain',
                  marginBottom: 30,
                  opacity: leftImageProgress,
                  transform: `scale(${leftImageProgress})`
                }}
                alt="Left visual"
              />
            )}
            
            {leftH2Progress > 0 && (
              <div style={{
                fontFamily: fonts.body.family,
                fontSize: fonts.body.size - 4,
                color: colors.ink,
                textAlign: 'center',
                opacity: leftH2Progress,
                position: 'relative'
              }}>
                {scene.fill.texts.left_h2}
                
                {/* Tick indicator */}
                {tickProgress > 0 && (
                  <div style={{
                    position: 'absolute',
                    right: -50,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 48,
                    color: colors.support,
                    opacity: tickProgress
                  }}>
                    ✓
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Divider */}
          <div style={{
            width: 4,
            backgroundColor: colors.boardStroke,
            borderRadius: 2
          }} />
          
          {/* Right Column */}
          <div style={{
            flex: 1,
            backgroundColor: activeArrowSwap?.target === 'right_h1' ? 'rgba(115, 34, 130, 0.1)' : 'transparent',
            borderRadius: 8,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: `3px solid ${activeArrowSwap?.target === 'right_h1' ? colors.accent : 'transparent'}`,
            transition: 'all 0.3s ease'
          }}>
            
            {rightH1Progress > 0 && (
              <div style={{
                fontFamily: fonts.subtitle.family,
                fontSize: fonts.subtitle.size + 8,
                fontWeight: fonts.subtitle.weight,
                color: colors.accent,
                marginBottom: 20,
                opacity: rightH1Progress
              }}>
                {scene.fill.texts.right_h1}
              </div>
            )}
            
            {rightImageProgress > 0 && scene.fill.images.image_right && (
              <img
                src={scene.fill.images.image_right}
                style={{
                  width: 200,
                  height: 200,
                  objectFit: 'contain',
                  marginBottom: 30,
                  opacity: rightImageProgress,
                  transform: `scale(${rightImageProgress})`
                }}
                alt="Right visual"
              />
            )}
            
            {rightH2Progress > 0 && (
              <div style={{
                fontFamily: fonts.body.family,
                fontSize: fonts.body.size - 4,
                color: colors.ink,
                textAlign: 'center',
                opacity: rightH2Progress,
                position: 'relative'
              }}>
                {scene.fill.texts.right_h2}
                
                {/* Cross indicator */}
                {crossProgress > 0 && (
                  <div style={{
                    position: 'absolute',
                    right: -50,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 48,
                    color: '#e74c3c',
                    opacity: crossProgress
                  }}>
                    ✗
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
