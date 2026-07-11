import { describe, it, expect, beforeEach } from 'vitest';

// --- loadSavedConcepts logic (mirrors App.jsx) ---
function loadSavedConcepts() {
  const savedHistory = localStorage.getItem('concept_history');
  if (!savedHistory) return [];
  try {
    return JSON.parse(savedHistory);
  } catch {
    return [];
  }
}

describe('loadSavedConcepts', () => {
  beforeEach(() => localStorage.clear());

  it('returns [] when localStorage is empty', () => {
    expect(loadSavedConcepts()).toEqual([]);
  });

  it('returns parsed array when valid JSON is stored', () => {
    const data = [{ id: 1, segment: 'Eセグ', bodyType: 'セダン', brand: 'Toyota', powertrains: ['BEV'] }];
    localStorage.setItem('concept_history', JSON.stringify(data));
    expect(loadSavedConcepts()).toEqual(data);
  });

  it('returns [] on malformed JSON', () => {
    localStorage.setItem('concept_history', '{not valid json}');
    expect(loadSavedConcepts()).toEqual([]);
  });

  it('preserves brand field', () => {
    const data = [{ id: 1, brand: 'Honda', segment: 'Cセグ', bodyType: 'SUV', powertrains: [], content: '...' }];
    localStorage.setItem('concept_history', JSON.stringify(data));
    expect(loadSavedConcepts()[0].brand).toBe('Honda');
  });
});

// --- Layer markdown parsing logic (mirrors ConceptViewer.jsx useMemo) ---
function parseMarkdownLayers(markdownContent) {
  if (!markdownContent) return [];
  const parts = markdownContent.split(/## Layer/);
  const validParts = parts.filter(p => p.trim() !== '');
  return validParts.map(part => {
    const firstLineBreak = part.indexOf('\n');
    const titleLine = part.substring(0, firstLineBreak).trim();
    const body = part.substring(firstLineBreak).trim();
    const match = titleLine.match(/^(\d+)[:：]?\s*(.*)$/);
    let num = '', title = titleLine;
    if (match) { num = match[1]; title = match[2]; }
    return { number: num, title, body, raw: `## Layer${part}` };
  });
}

describe('parseMarkdownLayers', () => {
  it('returns [] for empty string', () => {
    expect(parseMarkdownLayers('')).toEqual([]);
  });

  it('returns [] for null', () => {
    expect(parseMarkdownLayers(null)).toEqual([]);
  });

  it('parses a single layer correctly', () => {
    const md = '## Layer 1: 市場調査\nBody text here.';
    const layers = parseMarkdownLayers(md);
    expect(layers).toHaveLength(1);
    expect(layers[0].number).toBe('1');
    expect(layers[0].title).toBe('市場調査');
    expect(layers[0].body).toBe('Body text here.');
  });

  it('parses multiple layers correctly', () => {
    const md = '## Layer 1: First\nBody 1\n## Layer 2: Second\nBody 2';
    const layers = parseMarkdownLayers(md);
    expect(layers).toHaveLength(2);
    expect(layers[0].number).toBe('1');
    expect(layers[1].number).toBe('2');
    expect(layers[1].title).toBe('Second');
  });

  it('preserves raw markdown for each layer', () => {
    const md = '## Layer 3: Test\nContent';
    const layers = parseMarkdownLayers(md);
    expect(layers[0].raw).toContain('## Layer 3');
  });
});

// --- isRateLimit detection logic (mirrors aiService.js) ---
function isRateLimitError(error) {
  return (
    error.status === 429 ||
    error.status === 'RESOURCE_EXHAUSTED' ||
    (Boolean(error.message) && error.message.includes('429'))
  );
}

describe('isRateLimitError', () => {
  it('detects numeric 429 status', () => {
    expect(isRateLimitError({ status: 429 })).toBe(true);
  });

  it('detects RESOURCE_EXHAUSTED string status', () => {
    expect(isRateLimitError({ status: 'RESOURCE_EXHAUSTED' })).toBe(true);
  });

  it('detects 429 in error message', () => {
    expect(isRateLimitError({ message: 'HTTP 429: quota exceeded' })).toBe(true);
  });

  it('returns false for non-rate-limit errors', () => {
    expect(isRateLimitError({ status: 500, message: 'Internal Server Error' })).toBe(false);
  });

  it('returns false for empty error', () => {
    expect(isRateLimitError({})).toBe(false);
  });
});

// --- json:radar block parsing (mirrors ConceptViewer.jsx try/catch) ---
describe('radar JSON parsing', () => {
  it('successfully parses valid radar data', () => {
    const raw = '[{"subject":"Performance","A":120,"B":110,"fullMark":150}]';
    const data = JSON.parse(raw.replace(/\n$/, ''));
    expect(data[0].subject).toBe('Performance');
    expect(data[0].A).toBe(120);
  });

  it('throws on invalid JSON (triggering error fallback)', () => {
    expect(() => JSON.parse('{invalid json}')).toThrow();
  });
});
