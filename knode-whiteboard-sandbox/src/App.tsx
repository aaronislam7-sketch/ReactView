
import React from 'react';
import { Player } from '@remotion/player';
import sceneSpec from './scene-spec.json';
import { WhiteboardTedTalk } from './WhiteboardTedTalk';

export default function App() {
  const [jsonText, setJsonText] = React.useState(JSON.stringify(sceneSpec, null, 2));
  const [scene, setScene] = React.useState(sceneSpec);

  const apply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setScene(parsed);
    } catch (e) {
      alert('Invalid JSON');
    }
  };

  return (
    <div style={{display:'grid', gridTemplateColumns:'minmax(360px, 520px) 1fr', height:'100%'}}>
      <div style={{padding:16, borderRight:'1px solid #eee', overflow:'auto', background:'#fcfcfc'}}>
        <h3 style={{marginTop:0}}>Scene JSON</h3>
        <textarea
          value={jsonText}
          onChange={(e)=>setJsonText(e.target.value)}
          style={{width:'100%', height:'70vh', fontFamily:'monospace', fontSize:12}}
        />
        <button onClick={apply} style={{marginTop:12, padding:'8px 12px'}}>Apply JSON</button>
        <p style={{color:'#666', fontSize:12}}>
          Edit title, bullets, image URLs, or timeline times, then click Apply.
        </p>
      </div>

      <div style={{display:'grid', placeItems:'center', background:'#f5f5f5'}}>
        <div style={{width:'90%', maxWidth:1000, aspectRatio:'16/9', background:'#fff', boxShadow:'0 12px 30px rgba(0,0,0,0.08)'}}>
          <Player
            component={WhiteboardTedTalk}
            inputProps={{scene}}
            durationInFrames={scene.duration_s * scene.fps}
            fps={scene.fps}
            compositionWidth={scene.layout.canvas.w}
            compositionHeight={scene.layout.canvas.h}
            controls
            style={{width:'100%', height:'100%'}}
          />
        </div>
      </div>
    </div>
  );
}
