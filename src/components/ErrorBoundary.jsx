import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444', background: 'rgba(255,0,0,0.05)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p>コンテンツの表示中にエラーが発生しました。</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer' }}
          >
            再試行
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
