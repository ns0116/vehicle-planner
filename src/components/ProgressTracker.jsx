import { ChevronRight } from 'lucide-react';

const LAYERS = [
  "Layer 1: 市場の推移・トレンド分析中...",
  "Layer 2: 最新の法規制・政策調査中...",
  "Layer 3: マクロな技術トレンド調査中...",
  "Layer 4: ペルソナとライフスタイル設定中...",
  "Layer 5: 競合車種のベンチマーク分析中...",
  "Layer 6: VoC・ユーザーペインの抽出中...",
  "Layer 7: 自社アセット・ブランドの強み分析中...",
  "Layer 8: インサイト（本質的課題）の抽出中...",
  "Layer 9: 飛躍的コンセプトの立案中...",
  "Layer 10: 最終コンセプトの詳細具体化中..."
];

export default function ProgressTracker({ currentLayerIndex }) {
  return (
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
  );
}
