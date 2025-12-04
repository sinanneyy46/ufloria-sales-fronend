import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console (or send to your logging)
    console.error("ErrorBoundary caught:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 24,
            maxWidth: 900,
            margin: "40px auto",
            background: "var(--card-bg)",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid var(--border)",
          }}
        >
          <h2 style={{ color: "var(--primary)" }}>Something failed</h2>
          <p style={{ color: "var(--text-soft)" }}>
            A runtime error occurred while rendering this page.
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#fff",
              padding: 12,
              borderRadius: 8,
              overflowX: "auto",
            }}
          >
            {String(
              this.state.error && (this.state.error.stack || this.state.error)
            )}
          </pre>
          <button
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
