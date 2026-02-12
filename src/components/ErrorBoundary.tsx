import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Canvas error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', background: '#1a1a2e',
            color: '#e0e0e0', gap: 16, padding: 32,
          }}>
            <h2>3D 뷰에 문제가 발생했습니다</h2>
            <p style={{ color: '#888', fontSize: 14, maxWidth: 400, textAlign: 'center' }}>
              {this.state.error?.message ?? '알 수 없는 오류'}
            </p>
            <button className="preset-btn" onClick={this.handleReload}
              style={{ padding: '8px 24px', fontSize: 14 }}>
              다시 시도
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
