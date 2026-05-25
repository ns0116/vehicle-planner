import { Sparkles } from 'lucide-react';

const POWERTRAIN_OPTIONS = ["ICE", "MHEV", "HEV", "PHEV", "BEV", "ERRV", "FCEV"];

export default function InputForm({
  brand, setBrand,
  segment, setSegment,
  bodyType, setBodyType,
  powertrains, setPowertrains,
  error, handleGenerate
}) {
  return (
    <form onSubmit={handleGenerate} className="input-form">
      <div className="form-group">
        <label>自社ブランド (OEM)</label>
        <input 
          type="text" 
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="例: トヨタ、テスラ、ポルシェ"
          maxLength="50"
        />
      </div>
      <div className="form-group">
        <label>セグメント (例: Eセグ, コンパクト等)</label>
        <input 
          type="text" 
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          placeholder="例: Eセグメント"
          maxLength="50"
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
          maxLength="50"
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
  );
}
