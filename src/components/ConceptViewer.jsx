import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import './ConceptViewer.css';

export default function ConceptViewer({ markdownContent }) {
  // Parse the markdown into layers
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
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{markdownContent}</ReactMarkdown>
      </div>
    );
  }

  // If we couldn't cleanly parse exactly layers (e.g. LLM ignored instructions), fallback
  if (layers.length < 3) {
    return (
       <div className="glass-panel concept-viewer fallback-view">
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{markdownContent}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="concept-viewer-container">
      <div className="concept-header glass-panel">
        <h2 className="text-gradient">Generated Concept Analysis</h2>
        <p>AIが思考したコンセプト立案の全プロセス</p>
      </div>
      
      <div className="layers-stack">
        {layers.map((layer, index) => (
          <div key={index} className="layer-card glass-panel fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
            <div className="layer-card-header">
              <span className="layer-badge">Layer {layer.number}</span>
              <h3>{layer.title}</h3>
            </div>
            <div className="layer-card-body markdown-body">
              <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{layer.body}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
