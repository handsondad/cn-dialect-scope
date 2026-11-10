import { Component, type ReactNode } from "react";

// Falls back to the flat illustration when a 3D chunk or WebGL context fails at runtime.
export class WebGLBoundary extends Component<{ fallback: ReactNode; children: ReactNode; name: string }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`${this.props.name}加载失败，已改用平面示意图`, error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
