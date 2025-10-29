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
import { Hook1AQuestionBurst } from './templates/Hook1AQuestionBurst';
import { Hook1EAmbientMystery } from './templates/Hook1EAmbientMystery';
import { Explain2AConceptBreakdown } from './templates/Explain2AConceptBreakdown';
import { Explain2BAnalogy } from './templates/Explain2BAnalogy';
import { Apply3AMicroQuiz } from './templates/Apply3AMicroQuiz';
import { Apply3BScenarioChoice } from './templates/Apply3BScenarioChoice';
import { Reflect4AKeyTakeaways } from './templates/Reflect4AKeyTakeaways';
import { Reflect4DForwardLink } from './templates/Reflect4DForwardLink';
import {StyleTokensProvider} from './sdk/StyleTokensProvider';
import { DebugOverlay } from './components/DebugOverlay';

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
import hook1AKnodoviaScene from './scenes/hook_1a_knodovia_map_v2.json';
import hook1EMysteryScene from './scenes/hook_1e_mystery.json';
import explainFourRegionsScene from './scenes/explain_four_regions.json';
import explain2ABreakdownScene from './scenes/explain_2a_breakdown.json';
import explain2BAnalogyScene from './scenes/explain_2b_analogy.json';
import applyRegionQuizScene from './scenes/apply_region_quiz.json';
import apply3AQuizScene from './scenes/apply_3a_quiz.json';
import apply3BScenarioScene from './scenes/apply_3b_scenario.json';
import reflectKnodoviaJourneyScene from './scenes/reflect_knodovia_journey.json';
import reflect4ATakeawaysScene from './scenes/reflect_4a_takeaways.json';
import reflect4DForwardScene from './scenes/reflect_4d_forward.json';

// Blueprint v5.0 scenes
import hook1AV5Scene from './scenes/hook_1a_knodovia_map_v5.json';
import reflect4AV5Scene from './scenes/reflect_4a_takeaways_v5.json';
import apply3AV5Scene from './scenes/apply_3a_quiz_v5.json';
import explain2BV5Scene from './scenes/explain_2b_analogy_v5.json';

// Import Blueprint v5.0 templates
import { Hook1AQuestionBurst as Hook1AV5 } from './templates/Hook1AQuestionBurst_V5';
import { Reflect4AKeyTakeaways as Reflect4AV5 } from './templates/Reflect4AKeyTakeaways_V5';
import { Apply3AMicroQuiz as Apply3AV5 } from './templates/Apply3AMicroQuiz_V5';
import { Explain2BAnalogy as Explain2BV5 } from './templates/Explain2BAnalogy_V5';
import { TemplateRouter } from './templates/TemplateRouter';

const templateMap = {
  // Legacy templates
  'whiteboard_ted_v2': WhiteboardTEDv2,
  'whiteboard_ted_enhanced': WhiteboardTEDEnhanced,
  'two_column_v1': TwoColumnCompare,
  'timeline_v1': TimelineSteps,
  
  // New pillar templates
  'hook': HookTemplate,
  'hook_1a': Hook1AQuestionBurst,
  'hook_1e': Hook1EAmbientMystery,
  'hook_story': HookStoryTemplate,
  'explain': ExplainTemplate,
  'explain_sequential': ExplainSequentialTemplate,
  'explain_timeline': ExplainTimelineTemplate,
  'explain_2a': Explain2AConceptBreakdown,
  'explain_2b': Explain2BAnalogy,
  'apply': ApplyTemplate,
  'apply_quiz': ApplyQuizTemplate,
  'apply_compare': ApplyCompareTemplate,
  'apply_3a': Apply3AMicroQuiz,
  'apply_3b': Apply3BScenarioChoice,
  'reflect': ReflectTemplate,
  'reflect_mindmap': ReflectMindMapTemplate,
  'reflect_4a': Reflect4AKeyTakeaways,
  'reflect_4d': Reflect4DForwardLink,
  
  // Blueprint v5.0 templates (use TemplateRouter for context wrapping)
  'hook_1a_v5': TemplateRouter,
  'reflect_4a_v5': TemplateRouter,
  'apply_3a_v5': TemplateRouter,
  'explain_2b_v5': TemplateRouter,
  
  // Map v5.0 template_id values from JSON to TemplateRouter
  'Hook1AQuestionBurst': TemplateRouter,
  'Reflect4AKeyTakeaways': TemplateRouter,
  'Apply3AMicroQuiz': TemplateRouter,
  'Explain2BAnalogy': TemplateRouter
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
  'hook_1a_knodovia': hook1AKnodoviaScene,
  'hook_1e_mystery': hook1EMysteryScene,
  'explain_knodovia': explainFourRegionsScene,
  'explain_2a_breakdown': explain2ABreakdownScene,
  'explain_2b_analogy': explain2BAnalogyScene,
  'apply_knodovia': applyRegionQuizScene,
  'apply_3a_quiz': apply3AQuizScene,
  'apply_3b_scenario': apply3BScenarioScene,
  'reflect_knodovia': reflectKnodoviaJourneyScene,
  'reflect_4a_takeaways': reflect4ATakeawaysScene,
  'reflect_4d_forward': reflect4DForwardScene,
  
  // Blueprint v5.0 scenes
  'hook_1a_v5': hook1AV5Scene,
  'reflect_4a_v5': reflect4AV5Scene,
  'apply_3a_v5': apply3AV5Scene,
  'explain_2b_v5': explain2BV5Scene
};

// Validation function
const validateScene = (scene) => {
  const errors = [];
  
  try {
    // Check schema version
    const schemaVersion = scene.schema_version || '4.0';
    const isV5 = schemaVersion.startsWith('5.');
    
    // Check required fields
    if (!scene.template_id) {
      errors.push('Missing required field: template_id');
    }
    
    // v5.0 uses beats, v4 uses duration_s/fps/timeline
    if (isV5) {
      if (!scene.beats) {
        errors.push('Missing required field: beats (v5.0 schema)');
      }
      if (!scene.content) {
        errors.push('Missing required field: content (v5.0 schema)');
      }
    } else {
      if (!scene.duration_s) {
        errors.push('Missing required field: duration_s (v4.0 schema)');
      }
      if (!scene.fps) {
        errors.push('Missing required field: fps (v4.0 schema)');
      }
      if (!scene.fill) {
        errors.push('Missing required field: fill (v4.0 schema)');
      }
      if (!scene.timeline || !Array.isArray(scene.timeline)) {
        errors.push('Missing or invalid timeline array (v4.0 schema)');
      }
    }
    
    // Check if template exists
    if (scene.template_id && !templateMap[scene.template_id]) {
      errors.push(`Unknown template_id: ${scene.template_id}. Valid options: ${Object.keys(templateMap).join(', ')}`);
    }
    
    // Validate timeline actions reference existing targets (v4 only)
    if (!isV5 && scene.timeline && scene.fill) {
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
    
    // v5.0 content validation
    if (isV5 && scene.content) {
      if (scene.content.question && scene.content.question.length > 120) {
        errors.push(`Question may be too long (${scene.content.question.length} chars). Consider shortening.`);
      }
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
      
      // Check if v5.0 schema
      const isV5 = parsed.schema_version?.startsWith('5.');
      
      // Add default values for v4 template format if missing
      if (!isV5) {
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
      } else {
        // v5.0 defaults
        if (!parsed.layout) {
          parsed.layout = {
            canvas: { w: 1920, h: 1080 }
          };
        }
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

  // Calculate duration and FPS for v5.0 scenes
  const isV5 = currentScene.schema_version?.startsWith('5.');
  const fps = isV5 ? 30 : (currentScene.fps || 30);
  
  // For v5, calculate duration from beats or use template defaults
  let durationInFrames;
  if (isV5) {
    if (currentScene.beats && currentScene.beats.exit !== undefined) {
      const totalSeconds = currentScene.beats.exit + 0.5; // Add tail padding
      durationInFrames = Math.round(totalSeconds * fps);
    } else {
      durationInFrames = 15 * fps; // Default 15s for v5
    }
  } else {
    durationInFrames = Math.round((currentScene.duration_s || 30) * fps);
  }

  // Debug helpers
  console.log('Remotion debug — currentScene:', currentScene);
  console.log('Remotion debug — Component:', Component);
  console.log('Remotion debug — isV5:', isV5, 'fps:', fps, 'duration:', durationInFrames);
  
  const [debugRender, setDebugRender] = useState(false);
  const [playerKey, setPlayerKey] = useState(0); // For forcing player re-render
  
  // Reload player (fixes GSAP scrubbing issues)
  const handleReloadPlayer = () => {
    setPlayerKey(prev => prev + 1);
  };

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
          <optgroup label="🌟 Blueprint v5.0 Templates (NEW!)">
            <option value="hook_1a_v5">🚀 Hook 1A: Question Burst v5 (15s)</option>
            <option value="reflect_4a_v5">🚀 Reflect 4A: Key Takeaways v5 (8s)</option>
            <option value="apply_3a_v5">🚀 Apply 3A: Micro Quiz v5 (12s)</option>
            <option value="explain_2b_v5">🚀 Explain 2B: Analogy v5 (12s)</option>
          </optgroup>
          <optgroup label="🎨 Rough.js Templates (v4)">
            <option value="hook_1a_knodovia">🔥 Hook 1A: Question Burst (20s)</option>
            <option value="hook_1e_mystery">🌫️ Hook 1E: Ambient Mystery (15s)</option>
            <option value="explain_2a_breakdown">📊 Explain 2A: Concept Breakdown (30s)</option>
            <option value="explain_2b_analogy">🔄 Explain 2B: Analogy (25s)</option>
            <option value="apply_3a_quiz">✅ Apply 3A: Micro Quiz (18s)</option>
            <option value="apply_3b_scenario">🛤️ Apply 3B: Scenario Choice (28s)</option>
            <option value="reflect_4a_takeaways">💡 Reflect 4A: Key Takeaways (22s)</option>
            <option value="reflect_4d_forward">➡️ Reflect 4D: Forward Link (20s)</option>
          </optgroup>
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
          {isV5 ? `${(durationInFrames / fps).toFixed(1)}s (v5)` : `${currentScene.duration_s}s`} • {fps} fps • {currentScene.layout?.canvas?.w || 1920}×{currentScene.layout?.canvas?.h || 1080}
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
          {/* Reload Button - for GSAP scrubbing issues */}
          <button
            onClick={handleReloadPlayer}
            style={{
              marginBottom: 16,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: '#E74C3C',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#C0392B';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#E74C3C';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(231, 76, 60, 0.3)';
            }}
            title="Reload player to reset GSAP animations after scrubbing"
          >
            🔄 Reload Player
          </button>
          
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>
            {/* Main Player */}
            <Player
              key={playerKey}
              component={Component}
              inputProps={{ scene: currentScene }}
              durationInFrames={durationInFrames}
              fps={fps}
              compositionWidth={currentScene.layout?.canvas?.w || 1920}
              compositionHeight={currentScene.layout?.canvas?.h || 1080}
              controls
              style={{
                width: '100%',
                maxWidth: 960,
                aspectRatio: '16/9'
              }}
            />

            {/* Debug Overlay */}
            <DebugOverlay 
              scene={currentScene}
              templateId={currentScene.template_id}
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
