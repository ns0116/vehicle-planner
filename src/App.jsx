import { useState, useEffect } from 'react';
import { Settings, Sparkles, Car, Key, ChevronRight, Loader2, History, Save, Trash2 } from 'lucide-react';
import { generateConcept } from './aiService';
import ConceptViewer from './components/ConceptViewer';
import './App.css';

const LAYERS = [
  "Layer 1: 市場の推移・トレンド分析中...",
  "Layer 2: 最新の法規制・政策調査中...",
  "Layer 3: ペルソナとライフスタイル設定中...",
  "Layer 4: 競合車種のベンチマーク分析中...",
  "Layer 5: VoC・ユーザーペインの抽出中...",
  "Layer 6: インサイト（本質的課題）の抽出中...",
  "Layer 7: 解決手段となる最新技術の探索中...",
  "Layer 8: 飛躍的コンセプトの立案中...",
  "Layer 9: 最終コンセプトの詳細具体化中..."
];

const POWERTRAIN_OPTIONS = ["ICE", "MHEV", "HEV", "PHEV", "BEV", "ERRV", "FCEV"];

function App() {
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [showSettings, setShowSettings] = useState(false);
  const [segment, setSegment] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [powertrains, setPowertrains] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  const [generatedResult, setGeneratedResult] = useState('');
  const [error, setError] = useState('');
  const [savedConcepts, setSavedConcepts] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load API key from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    const savedModel = localStorage.getItem('gemini_model_name');
    const savedHistory = localStorage.getItem('concept_history');
    
    if (savedHistory) {
      try { setSavedConcepts(JSON.parse(savedHistory)); } catch (e) {}
    }
    
    if (savedModel) {
      setModelName(savedModel);
    }
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowSettings(true);
    }
  }, []);

  // Reset progress when starting generation
  useEffect(() => {
    if (!isGenerating) {
      setCurrentLayerIndex(0);
    }
  }, [isGenerating]);

  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('gemini_model_name', modelName);
    setShowSettings(false);
  };

  const handleSaveConcept = () => {
    if (!generatedResult) return;
    const newConcept = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      segment,
      bodyType,
      powertrains,
      content: generatedResult
    };
    const updated = [newConcept, ...savedConcepts];
    setSavedConcepts(updated);
    localStorage.setItem('concept_history', JSON.stringify(updated));
    alert('コンセプトを履歴に保存しました！');
  };

  const handleDeleteConcept = (id) => {
    const updated = savedConcepts.filter(c => c.id !== id);
    setSavedConcepts(updated);
    localStorage.setItem('concept_history', JSON.stringify(updated));
  };

  const loadConcept = (concept) => {
    setSegment(concept.segment);
    setBodyType(concept.bodyType);
    setPowertrains(concept.powertrains || []);
    setGeneratedResult(concept.content);
    setShowHistory(false);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    if (!segment || !bodyType) return;

    setIsGenerating(true);
    setError('');
    setGeneratedResult('');

    try {
      const result = await generateConcept(
        apiKey, 
        modelName, 
        segment, 
        bodyType, 
        powertrains,
        (index) => setCurrentLayerIndex(index)
      );
      setGeneratedResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="glass-panel app-header">
        <div className="logo">
          <Car className="logo-icon" />
          <h1 className="text-gradient">Vehicle Concept Generator</h1>
        </div>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button className="settings-btn" onClick={() => setShowHistory(true)}>
            <History size={20} />
            <span>履歴</span>
          </button>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            <Settings size={20} />
            <span>設定</span>
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Input Section */}
        {!generatedResult && !isGenerating && (
          <div className="glass-panel input-section fade-in">
            <h2>次世代車両の条件を入力</h2>
            <p className="subtitle">OSINTとAIを活用し、既存の枠組みを打ち破るコンセプトを自律生成します。</p>
            
            <form onSubmit={handleGenerate} className="input-form">
              <div className="form-group">
                <label>セグメント (例: Eセグ, コンパクト等)</label>
                <input 
                  type="text" 
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  placeholder="例: Eセグメント"
                  required
                />
              </div>
              <div className="form-group">
                <label>ボディ形状 (例: セダン, SUV等)</label>
                <input 
                  type="text" 
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  placeholder="例: セダン"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>パワートレイン (複数選択可)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.2rem' }}>
                  {POWERTRAIN_OPTIONS.map(pt => (
                    <label key={pt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', background: powertrains.includes(pt) ? 'rgba(37, 99, 235, 0.1)' : 'rgba(255,255,255,0.6)', padding: '0.5rem 0.8rem', borderRadius: '8px', border: powertrains.includes(pt) ? '1px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)', transition: 'all 0.2s ease' }}>
                      <input 
                        type="checkbox" 
                        checked={powertrains.includes(pt)}
                        onChange={(e) => {
                          if (e.target.checked) setPowertrains([...powertrains, pt]);
                          else setPowertrains(powertrains.filter(p => p !== pt));
                        }}
                        style={{ margin: 0, cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: powertrains.includes(pt) ? '600' : '400', color: powertrains.includes(pt) ? 'var(--primary)' : 'inherit' }}>{pt}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button type="submit" className="generate-btn" disabled={!segment || !bodyType}>
                <Sparkles size={20} />
                <span>コンセプトを生成</span>
              </button>
            </form>
          </div>
        )}

        {/* Loading / Progress Section */}
        {isGenerating && (
          <div className="glass-panel loading-section fade-in">
            <div className="spinner-container">
              <Loader2 className="spinner" size={48} />
            </div>
            <h2 className="text-gradient">AIが自律思考中...</h2>
            
            <div className="layers-progress">
              {LAYERS.map((layer, index) => (
                <div 
                  key={index} 
                  className={`layer-item ${index === currentLayerIndex ? 'active' : ''} ${index < currentLayerIndex ? 'completed' : ''}`}
                >
                  <div className="layer-icon">
                    {index < currentLayerIndex ? <ChevronRight size={16} /> : <div className="dot"></div>}
                  </div>
                  <span className="layer-text">{layer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result Section */}
        {generatedResult && !isGenerating && (
          <div className="fade-in">
            <div className="actions-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="back-btn" onClick={() => { setGeneratedResult(''); setSegment(''); setBodyType(''); setPowertrains([]); }}>
                新しいコンセプトを生成
              </button>
              <button className="save-btn" onClick={handleSaveConcept} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={18} /> 保存する
              </button>
            </div>
            <ConceptViewer markdownContent={generatedResult} />
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <h2><Key size={24} /> API設定</h2>
            <p>コンセプト生成には Google Gemini API キーが必要です。キーはブラウザのローカルストレージにのみ保存されます。</p>
            <form onSubmit={handleSaveKey}>
              <div className="form-group">
                <label>Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  required
                />
              </div>
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label>使用モデル</label>
                <select 
                  value={modelName} 
                  onChange={(e) => setModelName(e.target.value)}
                  style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                  <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (推奨・高速・無償枠大)</option>
                  <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (高精度・制限強)</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowSettings(false)}>キャンセル</button>
                <button type="submit" className="save-btn">保存して閉じる</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2><History size={24} /> 保存されたコンセプト</h2>
              <button className="cancel-btn" onClick={() => setShowHistory(false)}>閉じる</button>
            </div>
            
            {savedConcepts.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>保存された履歴はありません。</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {savedConcepts.map(c => (
                  <div key={c.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease' }} className="history-card">
                    <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => loadConcept(c)}>
                      <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1.1rem' }}>{c.segment} × {c.bodyType}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {c.powertrains && c.powertrains.length > 0 ? `PT: ${c.powertrains.join(', ')} | ` : ''} {c.date}
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteConcept(c.id); }} style={{ background: 'transparent', color: '#ef4444', padding: '0.5rem', borderRadius: '8px' }} className="delete-btn">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
