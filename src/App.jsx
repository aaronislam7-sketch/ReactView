import { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { WhiteboardTED } from './templates/WhiteboardTED';
import { TwoColumnCompare } from './templates/TwoColumnCompare';
import { TimelineSteps } from './templates/TimelineSteps';

// Import sample scenes
import economyScene from './scenes/economy_currency.json';
import lawsScene from './scenes/laws_compare.json';
import cultureScene from './scenes/culture_ritual.json';

const templateMap = {
  'whiteboard_ted_v1': WhiteboardTED,
  'two_column_v1': TwoColumnCompare,
  'timeline_v1': TimelineSteps
};

const sampleScenes = {
  'whiteboard_ted_v1': economyScene,
  'two_column_v1': lawsScene,
  'timeline_v1': cultureScene
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
      
      scene.timeline.forEach((action, index) => {
        if (action.target && !action.target.includes('->')) {
          // Skip connector targets like "s1->s2"
          if (!allTargets.includes(action.target) && action.target !== 'character_anchor') {
            errors.push(`Timeline action ${index} references missing target: "${action.target}"`);
          }
        }
        
        if (action.from && !allTargets.includes(action.from) && action.from !== 'character_anchor') {
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
  const [selectedTemplate, setSelectedTemplate] = useState('whiteboard_ted_v1');
  const [sceneJSON, setSceneJSON] = useState(JSON.stringify(economyScene, null, 2));
  const [currentScene, setCurrentScene] = useState(economyScene);
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
  
  const Component = templateMap[currentScene.template_id] || WhiteboardTED;
  
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
          Remotion Scene Previewer
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
          <option value="whiteboard_ted_v1">Whiteboard TED (Economy)</option>
          <option value="two_column_v1">Two-Column Compare (Laws)</option>
          <option value="timeline_v1">Timeline / Process Steps (Culture)</option>
        </select>
        
        <div style={{ flex: 1 }} />
        
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
            <Player
              component={Component}
              inputProps={{ scene: currentScene }}
              durationInFrames={currentScene.duration_s * currentScene.fps}
              fps={currentScene.fps}
              compositionWidth={1920}
              compositionHeight={1080}
              controls
              style={{
                width: '100%',
                maxWidth: 960,
                aspectRatio: '16/9'
              }}
            />
          </div>
          
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
