import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorDetails: string | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: Readonly<ErrorBoundaryProps>;
  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
    errorDetails: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let parsedMessage = error.message || 'An unexpected application error occurred.';
    let details: string | null = null;

    try {
      const parsed = JSON.parse(error.message);
      if (parsed && typeof parsed.error === 'string') {
        parsedMessage = parsed.error;
        details = `${parsed.operationType?.toUpperCase() || 'OPERATION'} on ${parsed.path || 'database'}`;
      }
    } catch {
      // Plain error message
    }

    return {
      hasError: true,
      errorMessage: parsedMessage,
      errorDetails: details,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#070b14] text-slate-100 p-4 font-['Outfit',sans-serif]">
          <div className="max-w-md w-full rounded-2xl bg-[#080d1a] border border-rose-500/40 p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">Something went wrong</h1>
              <p className="text-xs text-slate-300 leading-relaxed break-words">
                {this.state.errorMessage}
              </p>
              {this.state.errorDetails && (
                <p className="text-[11px] font-mono text-rose-300/80 bg-rose-950/30 px-3 py-1.5 rounded-lg border border-rose-900/40">
                  {this.state.errorDetails}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Portfolio</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
