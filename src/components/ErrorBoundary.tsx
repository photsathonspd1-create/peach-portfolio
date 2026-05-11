"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Scene3D error:", error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full border border-white/10 bg-white/[0.04]" />
              <p className="text-xs text-zinc-500">3D scene unavailable</p>
              <button
                type="button"
                onClick={this.handleRetry}
                className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-white/[0.12] hover:text-white"
              >
                Retry
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
