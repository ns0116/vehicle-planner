import { useState, useEffect } from 'react';
import { Settings, Car, Key, Loader2, History, Save, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { generateConcept } from './aiService';
import ConceptViewer from './components/ConceptViewer';
import ErrorBoundary from './components/ErrorBoundary';
import InputForm from './components/InputForm';
import ProgressTracker from './components/ProgressTracker';
import './App.css';

function loadSavedConcepts() {
  const savedHistory = localStorage.getItem('concept_history');
  if (!savedHistory) return [];
  try {
    return JSON.parse(savedHistory);
  } catch {
    return [];
  }
}

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [modelName, setModelName] = useState(() => localStorage.getItem('gemini_model_name') || 'gemini-2.5-flash');
  const [showSettings, setShowSettings] = useState(() => !localStorage.getItem('gemini_api_key'));
  const [brand, setBrand] = useState('');
  const [segment, setSegment] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [powertrains, setPowertrains] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  const [generatedResult, setGeneratedResult] = useState('');
  const [error, setError] = useState('');
  const [savedConcepts, setSavedConcepts] = useState(loadSavedConcepts);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

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
      brand,
      segment,
      bodyType,
      powertrains,
      content: generatedResult
    };
    const updated = [newConcept, ...savedConcepts];
    try {
      localStorage.setItem('concept_history', JSON.stringify(updated));
      setSavedConcepts(updated);
      setToast({ type: 'success', message: 'コンセプトを履歴に保存しました！' });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        setToast({ type: 'error', message: '保存領域が満杯です。古いコンセプトを削除してください。' });
      } else {
        setToast({ type: 'error', message: '保存中にエラーが発生しました。' });
      }
    }
  };

  const handleDeleteConcept = (id) => {
    const updated = savedConcepts.filter(c => c.id !== id);
    setSavedConcepts(updated);
    try {
      localStorage.setItem('concept_history', JSON.stringify(updated));
    } catch {
      // deletion reduces storage size, so quota errors are unlikely here
    }
  };

  const loadConcept = (concept) => {
    setBrand(concept.brand || '');
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
    setCurrentLayerIndex(0);

    try {
      const result = await generateConcept(
        apiKey, 
        modelName, 
        brand,
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
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}
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
            
            <InputForm 
              brand={brand} setBrand={setBrand}
              segment={segment} setSegment={setSegment}
              bodyType={bodyType} setBodyType={setBodyType}
              powertrains={powertrains} setPowertrains={setPowertrains}
              error={error} handleGenerate={handleGenerate}
            />
          </div>
        )}

        {/* Loading / Progress Section */}
        {isGenerating && (
          <div className="glass-panel loading-section fade-in">
            <div className="spinner-container">
              <Loader2 className="spinner" size={48} />
            </div>
            <h2 className="text-gradient">AIが自律思考中...</h2>
            
            <ProgressTracker currentLayerIndex={currentLayerIndex} />
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
            <ErrorBoundary>
              <ConceptViewer markdownContent={generatedResult} />
            </ErrorBoundary>
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
                      <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1.1rem' }}>
                        {c.brand ? `${c.brand} / ` : ''}{c.segment} × {c.bodyType}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {c.powertrains && c.powertrains.length > 0 ? `PT: ${c.powertrains.join(', ')} | ` : ''}{c.date}
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
