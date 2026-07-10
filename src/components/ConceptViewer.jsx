import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './ConceptViewer.css';

// Allow <details>/<summary> that the AI system prompt explicitly generates for source citations
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'details', 'summary'],
  attributes: {
    ...defaultSchema.attributes,
    details: ['open'],
  },
};

// Defined outside component to avoid recreation on every render
const customRenderers = {
  code({ node, className, children, ...props }) {
    const match = /language-json:radar/.exec(className || '');
    // Inline code never has a language class, so matching className is sufficient
    if (match) {
      try {
        const data = JSON.parse(String(children).replace(/\n$/, ''));
        return (
          <div className="radar-chart-container" style={{ width: '100%', height: 350, marginTop: '20px', marginBottom: '20px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px', padding: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#00f2fe', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="自社コンセプト" dataKey="A" stroke="#00f2fe" fill="#00f2fe" fillOpacity={0.6} />
                <Radar name="最強の競合" dataKey="B" stroke="#ff007a" fill="#ff007a" fillOpacity={0.4} />
                <Tooltip wrapperStyle={{ backgroundColor: 'rgba(10, 14, 23, 0.9)', border: '1px solid #00f2fe', color: '#fff' }} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        );
      } catch {
        return <div style={{ color: '#ff4d4f', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>⚠️ グラフデータの解析に失敗しました。</div>;
      }
    }
    return <code className={className} {...props}>{children}</code>;
  }
};

const rehypePlugins = [rehypeRaw, [rehypeSanitize, sanitizeSchema]];

export default function ConceptViewer({ markdownContent }) {
  const layers = useMemo(() => {
    if (!markdownContent) return [];
    
    // Split the content by "## Layer"
    const parts = markdownContent.split(/## Layer/);
    
    // Filter out empty parts (like before the first Layer)
    const validParts = parts.filter(p => p.trim() !== '');
    
    return validParts.map(part => {
      // Reconstruct the heading if needed or parse it out
      // Usually " X: Title\nBody..."
      const firstLineBreak = part.indexOf('\n');
      const titleLine = part.substring(0, firstLineBreak).trim();
      const body = part.substring(firstLineBreak).trim();
      
      // titleLine might be like "1: 市場・法規制調査"
      const match = titleLine.match(/^(\d+)[:：]?\s*(.*)$/);
      let num = '';
      let title = titleLine;
      if (match) {
        num = match[1];
        title = match[2];
      }
      
      return {
        number: num,
        title: title,
        body: body,
        raw: `## Layer${part}` // original raw markdown
      };
    });
  }, [markdownContent]);

  if (layers.length === 0) {
    return (
      <div className="glass-panel concept-viewer">
        <ReactMarkdown rehypePlugins={rehypePlugins} components={customRenderers}>{markdownContent}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="concept-viewer-container">
      <div className="concept-header glass-panel">
        <h2 className="text-gradient">Generated Concept Analysis</h2>
        <p>AIが思考したコンセプト立案の全プロセス（監査と再構築ループを含む）</p>
      </div>

      <div className="layers-stack">
        {layers.map((layer, index) => (
          <div key={index} className="layer-card glass-panel fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="layer-card-header">
              <span className={`layer-badge ${layer.number === '11' ? 'badge-red' : layer.number === '12' ? 'badge-gold' : ''}`}>Layer {layer.number}</span>
              <h3>{layer.title}</h3>
            </div>
            <div className="layer-card-body markdown-body">
              <ReactMarkdown rehypePlugins={rehypePlugins} components={customRenderers}>{layer.body}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
