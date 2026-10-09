import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

/** A crash in one page shows a message instead of blanking the whole app. */
export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Back-office page error', error, info.componentStack);
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="page">
        <div className="notice notice--error" role="alert">
          <strong>Cette page a rencontré une erreur.</strong> Rechargez la page ; si le problème persiste, transmettez ce message :{' '}
          <code>{this.state.error.message}</code>
        </div>
      </div>
    );
  }
}
