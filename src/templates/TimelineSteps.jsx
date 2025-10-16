import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const TimelineSteps = ({ scene }) => {
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
  
  // Step animations
  const steps = ['s1', 's2', 's3', 's4', 's5'];
  const stepProgresses = steps.map(step => {
    const action = getAction('stepIn', step);
    return action ? getActionProgress(action) : 0;
  });
  
  // Connector animations
  const connectorProgresses = [
    { action: getAction('connectorReveal', 's1->s2'), progress: 0 },
    { action: getAction('connectorReveal', 's2->s3'), progress: 0 },
    { action: getAction('connectorReveal', 's3->s4'), progress: 0 },
    { action: getAction('connectorReveal', 's4->s5'), progress: 0 }
  ].map(({ action }) => action ? getActionProgress(action) : 0);
  
  // Badge animation
  const badgeAction = getAction('badge', 's5');
  const badgeProgress = badgeAction ? getActionProgress(badgeAction) : 0;
  
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
            marginBottom: 80,
            opacity: titleProgress
          }}>
            {scene.fill.texts.title}
          </div>
        )}
        
        {/* Timeline container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          paddingLeft: 40,
          paddingRight: 40
        }}>
          
          {/* Steps */}
          {steps.map((stepKey, index) => {
            const progress = stepProgresses[index];
            const imageKey = `i${index + 1}`;
            
            return (
              <div key={stepKey} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2
              }}>
                
                {/* Step circle with image */}
                <div style={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  backgroundColor: colors.board,
                  border: `4px solid ${colors.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  opacity: progress,
                  transform: `scale(${progress})`,
                  boxShadow: progress > 0 ? '0 4px 12px rgba(115, 34, 130, 0.3)' : 'none',
                  position: 'relative'
                }}>
                  {scene.fill.images[imageKey] && (
                    <img
                      src={scene.fill.images[imageKey]}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'contain'
                      }}
                      alt={`Step ${index + 1}`}
                    />
                  )}
                  
                  {/* Badge overlay on last step */}
                  {index === 4 && badgeProgress > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: colors.support,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 40,
                      opacity: badgeProgress,
                      transform: `scale(${badgeProgress}) rotate(${badgeProgress * 360}deg)`,
                      border: `3px solid ${colors.board}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                      ⭐
                    </div>
                  )}
                </div>
                
                {/* Step label */}
                <div style={{
                  fontFamily: fonts.body.family,
                  fontSize: fonts.body.size - 10,
                  color: colors.ink,
                  textAlign: 'center',
                  maxWidth: 200,
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`
                }}>
                  {scene.fill.texts[stepKey]}
                </div>
                
                {/* Connector line to next step */}
                {index < 4 && (
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: 75,
                    width: 280,
                    height: 4,
                    backgroundColor: colors.accent,
                    transformOrigin: 'left center',
                    transform: `scaleX(${connectorProgresses[index]})`,
                    zIndex: 1
                  }}>
                    {/* Arrow head */}
                    <div style={{
                      position: 'absolute',
                      right: -8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: `12px solid ${colors.accent}`,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      opacity: connectorProgresses[index]
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Progress indicator at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          opacity: titleProgress
        }}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: stepProgresses[index] > 0.5 ? colors.support : colors.boardStroke,
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
