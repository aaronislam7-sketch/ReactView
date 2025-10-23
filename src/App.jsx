import { useState } from 'react';
import { VideoWizard } from './components/VideoWizard';
import { Player } from '@remotion/player';
import { TwoColumnCompare } from '../legacy/templates/TwoColumnCompare';
import { TimelineSteps } from '../legacy/templates/TimelineSteps';
import { WhiteboardTEDv2 } from '../legacy/templates/WhiteboardTEDv2';
import { WhiteboardTEDEnhanced } from '../legacy/templates/WhiteboardTEDEnhanced';
import { HookTemplate } from './templates/HookTemplate';
import { HookStoryTemplate } from './templates/HookStoryTemplate';
import { ExplainTemplate } from './templates/ExplainTemplate';
import { ExplainTimelineTemplate } from './templates/ExplainTimelineTemplate';
import { ApplyTemplate } from './templates/ApplyTemplate';
import { ApplyCompareTemplate } from './templates/ApplyCompareTemplate';
import { ReflectTemplate } from './templates/ReflectTemplate';
import { ReflectMindMapTemplate } from './templates/ReflectMindMapTemplate';
import { ExplainSequentialTemplate } from './templates/ExplainSequentialTemplate';
import { ApplyQuizTemplate } from './templates/ApplyQuizTemplate';
import {StyleTokensProvider} from './sdk/StyleTokensProvider';

// Import sample scenes (legacy mode)
import economyScene from '../legacy/scenes/economy_currency.json';
import lawsScene from '../legacy/scenes/laws_compare.json';
import cultureScene from '../legacy/scenes/culture_ritual.json';
import ideasSpreadScene from '../legacy/scenes/ideas_spread.json';

// Import new pillar scenes
import hookSleepScienceScene from './scenes/hook_sleep_science.json';
import hookStoryResilienceScene from './scenes/hook_story_resilience.json';
import explainGrowthMindsetScene from './scenes/explain_growth_mindset.json';
import explainTimelinePhotosynthesisScene from './scenes/explain_timeline_photosynthesis.json';
import applyGrowthMindsetScene from './scenes/apply_growth_mindset.json';
import applyCompareStudyScene from './scenes/apply_compare_study.json';
import reflectGrowthMindsetScene from './scenes/reflect_growth_mindset.json';
import reflectMindMapLearningScene from './scenes/reflect_mindmap_learning.json';

// Knodovia video scenes
import hookKnodoviaMapScene from './scenes/hook_knodovia_map.json';
import explainFourRegionsScene from './scenes/explain_four_regions.json';
import applyRegionQuizScene from './scenes/apply_region_quiz.json';
import reflectKnodoviaJourneyScene from './scenes/reflect_knodovia_journey.json';

const templateMap = {
  // Legacy templates
  'whiteboard_ted_v2': WhiteboardTEDv2,
  'whiteboard_ted_enhanced': WhiteboardTEDEnhanced,
  'two_column_v1': TwoColumnCompare,
  'timeline_v1': TimelineSteps,
  
  // New pillar templates
  'hook': HookTemplate,
  'hook_story': HookStoryTemplate,
  'explain': ExplainTemplate,
  'explain_sequential': ExplainSequentialTemplate,
  'explain_timeline': ExplainTimelineTemplate,
  'apply': ApplyTemplate,
  'apply_quiz': ApplyQuizTemplate,
  'apply_compare': ApplyCompareTemplate,
  'reflect': ReflectTemplate,
  'reflect_mindmap': ReflectMindMapTemplate
};

const sampleScenes = {
  // Legacy scenes
  'whiteboard_ted_v2': economyScene,
  'whiteboard_ted_enhanced': ideasSpreadScene,
  'two_column_v1': lawsScene,
  'timeline_v1': cultureScene,
  
  // New pillar scenes
  'hook': hookSleepScienceScene,
  'hook_story': hookStoryResilienceScene,
  'explain': explainGrowthMindsetScene,
  'explain_sequential': explainFourRegionsScene,
  'explain_timeline': explainTimelinePhotosynthesisScene,
  'apply': applyGrowthMindsetScene,
  'apply_quiz': applyRegionQuizScene,
  'apply_compare': applyCompareStudyScene,
  'reflect': reflectGrowthMindsetScene,
  'reflect_mindmap': reflectMindMapLearningScene,
  
  // Knodovia video scenes
  'hook_knodovia': hookKnodoviaMapScene,
  'explain_knodovia': explainFourRegionsScene,
  'apply_knodovia': applyRegionQuizScene,
  'reflect_knodovia': reflectKnodoviaJourneyScene
};

// Validation function
const validateScene = (scene) => {
  const errors = [];
  
  try {
    // Check required fields
    if (!scene.template_id) {
      errors.push('Missing required field: template_id');
    }
    
    if (!scene.duration_s) {
      errors.push('Missing required field: duration_s');
    }
    
    if (!scene.fps) {
      errors.push('Missing required field: fps');
    }
    
    if (!scene.fill) {
      errors.push('Missing required field: fill');
    }
    
    if (!scene.timeline || !Array.isArray(scene.timeline)) {
      errors.push('Missing or invalid timeline array');
    }
    
    // Check if template exists
    if (scene.template_id && !templateMap[scene.template_id]) {
      errors.push(`Unknown template_id: ${scene.template_id}. Valid options: ${Object.keys(templateMap).join(', ')}`);
    }
    
    // Validate timeline actions reference existing targets
    if (scene.timeline && scene.fill) {
      const allTexts = Object.keys(scene.fill.texts || {});
      const allImages = Object.keys(scene.fill.images || {});
      const allTargets = [...allTexts, ...allImages];
      
      // Special targets that don't need to be in fill
      const specialTargets = ['character_anchor', 'mainIcon', 'connector1', 'connector2', 'connector3', 'connector4'];
      
      scene.timeline.forEach((action, index) => {
        if (action.target && !action.target.includes('->')) {
          // Skip connector targets like "s1->s2" and special targets
          if (!allTargets.includes(action.target) && !specialTargets.includes(action.target)) {
            errors.push(`Timeline action ${index} references missing target: "${action.target}"`);
          }
        }
        
        if (action.from && !allTargets.includes(action.from) && !specialTargets.includes(action.from)) {
          errors.push(`Timeline action ${index} references missing 'from' target: "${action.from}"`);
        }
        
        if (!action.action) {
          errors.push(`Timeline action ${index} is missing 'action' field`);
        }
        
        if (action.t === undefined) {
          errors.push(`Timeline action ${index} is missing 't' (time) field`);
        }
      });
    }
    
    // Check for text overflow (basic check)
    if (scene.fill?.texts) {
      Object.entries(scene.fill.texts).forEach(([key, value]) => {
        if (value && value.length > 100) {
          errors.push(`Text field "${key}" may be too long (${value.length} chars). Consider shortening.`);
        }
      });
    }
    
  } catch (e) {
    errors.push(`Validation error: ${e.message}`);
  }
  
  return errors;
};

export default function App() {
  const [mode, setMode] = useState('wizard'); // 'wizard' or 'legacy'
  const [selectedTemplate, setSelectedTemplate] = useState('whiteboard_ted_enhanced');
  const [sceneJSON, setSceneJSON] = useState(JSON.stringify(ideasSpreadScene, null, 2));
  const [currentScene, setCurrentScene] = useState(ideasSpreadScene);
  const [validationErrors, setValidationErrors] = useState([]);
  const [jsonError, setJsonError] = useState(null);
  
  // Handle template change
  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    const newScene = sampleScenes[templateId];
    setSceneJSON(JSON.stringify(newScene, null, 2));
    setCurrentScene(newScene);
    setValidationErrors([]);
    setJsonError(null);
  };
  
  // Handle JSON edit and apply
  const handleApplyJSON = () => {
    try {
      const parsed = JSON.parse(sceneJSON);
      
      // Add default values for new template format if missing
      if (!parsed.duration_s) parsed.duration_s = parsed.duration || 30;
      if (!parsed.fps) parsed.fps = 30;
      if (!parsed.layout) {
        parsed.layout = {
          canvas: { w: 1920, h: 1080 }
        };
      }
      if (!parsed.meta) {
        parsed.meta = {
          title: parsed.fill?.texts?.title || 'Untitled Scene',
          tags: []
        };
      }
      if (!parsed.timeline) {
        parsed.timeline = [];
      }
      
      const errors = validateScene(parsed);
      
      setValidationErrors(errors);
      setJsonError(null);
      
      if (errors.length === 0) {
        setCurrentScene(parsed);
        setSelectedTemplate(parsed.template_id);
      }
    } catch (e) {
      setJsonError(`Invalid JSON: ${e.message}`);
    }
  };
  
  const Component = templateMap[currentScene.template_id] || WhiteboardTEDEnhanced;

  // Debug helpers
  console.log('Remotion debug — currentScene:', currentScene);
  console.log('Remotion debug — Component:', Component);
  
  const [debugRender, setDebugRender] = useState(false);

  // Render wizard mode by default
  if (mode === 'wizard') {
    return (
      <div style={{ position: 'relative' }}>
        <VideoWizard />
        {/* Mode toggle button */}
        <button
          onClick={() => setMode('legacy')}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '10px 20px',
            fontSize: 13,
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 9999
          }}
        >
          Switch to Legacy Mode
        </button>
      </div>
    );
  }
  
  // Legacy single-scene mode
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '20px 40px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 700,
          color: '#732282'
        }}>
          Remotion Scene Previewer (Legacy Mode)
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: 14,
          color: '#666'
        }}>
          JSON-driven content factory for Knodovia
        </p>
      </header>
      
      {/* Template Selector */}
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
        <label style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#333'
        }}>
          Template:
        </label>
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            borderRadius: 6,
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <optgroup label="🗺️ Knodovia Video - Mapping the Land">
            <option value="hook_knodovia">Hook: A Map Unlike Any Other (25s)</option>
            <option value="explain_knodovia">Explain: Four Regions Sequential (70s)</option>
            <option value="apply_knodovia">Apply: Region Quiz (30s)</option>
            <option value="reflect_knodovia">Reflect: Your Journey (35s)</option>
          </optgroup>
          <optgroup label="🎯 Hook Templates">
            <option value="hook">Cinematic Write-On Hook (Sleep Science)</option>
            <option value="hook_story">Story-Driven Hook (Resilience)</option>
          </optgroup>
          <optgroup label="📚 Explain Templates">
            <option value="explain">4-Step Breakdown (Growth Mindset)</option>
            <option value="explain_sequential">Sequential Regions (Knodovia)</option>
            <option value="explain_timeline">Timeline Process (Photosynthesis)</option>
          </optgroup>
          <optgroup label="🛠️ Apply Templates">
            <option value="apply">Scenario-Based (Growth Mindset)</option>
            <option value="apply_quiz">Multiple Choice Quiz (Knodovia)</option>
            <option value="apply_compare">Before/After Compare (Study Habits)</option>
          </optgroup>
          <optgroup label="🤔 Reflect Templates">
            <option value="reflect">Question-Driven Reflection (Growth Mindset)</option>
            <option value="reflect_mindmap">Mind Map Synthesis (Learning Styles)</option>
          </optgroup>
          <optgroup label="🔖 Legacy Templates">
            <option value="whiteboard_ted_enhanced">✨ Whiteboard TED Enhanced (How Ideas Spread)</option>
            <option value="whiteboard_ted_v2">Whiteboard TED v2 (Economy)</option>
            <option value="two_column_v1">Two-Column Compare (Laws)</option>
            <option value="timeline_v1">Timeline / Process Steps (Culture)</option>
          </optgroup>
        </select>
        
        <div style={{ flex: 1 }} />

        <button
          onClick={() => setMode('wizard')}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: '#732282',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Switch to Wizard Mode
        </button>
        
        <div style={{
          fontSize: 12,
          color: '#666'
        }}>
          {currentScene.duration_s}s • {currentScene.fps} fps • {currentScene.layout.canvas.w}×{currentScene.layout.canvas.h}
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        
        {/* Left Panel - JSON Editor */}
        <div style={{
          width: '45%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          borderRight: '1px solid #e0e0e0'
        }}>
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: '#333'
            }}>
              Scene JSON
            </h2>
            <button
              onClick={handleApplyJSON}
              style={{
                padding: '8px 20px',
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: '#732282',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a1b66'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#732282'}
            >
              Apply Changes
            </button>
          </div>
          
          <textarea
            value={sceneJSON}
            onChange={(e) => setSceneJSON(e.target.value)}
            style={{
              flex: 1,
              padding: 20,
              fontSize: 13,
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              border: 'none',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.6
            }}
            spellCheck={false}
          />
          
          {/* Validation Messages */}
          {(jsonError || validationErrors.length > 0) && (
            <div style={{
              borderTop: '1px solid #e0e0e0',
              padding: 20,
              backgroundColor: '#fff3cd',
              maxHeight: 200,
              overflowY: 'auto'
            }}>
              {jsonError && (
                <div style={{
                  color: '#721c24',
                  backgroundColor: '#f8d7da',
                  padding: '8px 12px',
                  borderRadius: 4,
                  fontSize: 13,
                  marginBottom: 8
                }}>
                  <strong>JSON Error:</strong> {jsonError}
                </div>
              )}
              
              {validationErrors.map((error, index) => (
                <div
                  key={index}
                  style={{
                    color: '#856404',
                    fontSize: 13,
                    marginBottom: 6,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8
                  }}
                >
                  <span style={{ color: '#f39c12' }}>⚠</span>
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}
          
          {validationErrors.length === 0 && !jsonError && (
            <div style={{
              borderTop: '1px solid #e0e0e0',
              padding: '12px 20px',
              backgroundColor: '#d4edda',
              color: '#155724',
              fontSize: 13
            }}>
              <span style={{ color: '#28a745', marginRight: 8 }}>✓</span>
              Scene validated successfully
            </div>
          )}
        </div>
        
        {/* Right Panel - Preview */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8f8f8',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>
            {/* Main Player */}
            <Player
              component={Component}
              inputProps={{ scene: currentScene }}
              durationInFrames={currentScene.duration_s * currentScene.fps}
              fps={currentScene.fps}
              compositionWidth={currentScene.layout.canvas.w}
              compositionHeight={currentScene.layout.canvas.h}
              controls
              style={{
                width: '100%',
                maxWidth: 960,
                aspectRatio: '16/9'
              }}
            />

            {/* Debug Toggle */}
            <div style={{ margin: '12px 20px' }}>
              <label style={{ fontSize: 13, marginRight: 8 }}>
                <input 
                  type="checkbox" 
                  checked={debugRender} 
                  onChange={(e) => setDebugRender(e.target.checked)} 
                />
                {' '}Debug render (no Player iframe)
              </label>
            </div>

            {/* Debug View */}
            {debugRender && (
              <div style={{ 
                border: '2px dashed #e74c3c', 
                margin: '0 20px 20px',
                padding: 12, 
                background: '#fff' 
              }}>
                <Component 
                  scene={currentScene}
                />
              </div>
            )}
          </div>

          {/* Meta Info */}
          <div style={{
            marginTop: 24,
            padding: '12px 24px',
            backgroundColor: '#fff',
            borderRadius: 6,
            fontSize: 13,
            color: '#666',
            textAlign: 'center'
          }}>
            <strong>{currentScene.meta.title}</strong>
            <div style={{ marginTop: 4, fontSize: 12 }}>
              {currentScene.meta.tags.slice(0, 3).join(' • ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
