import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-neutral-50 via-white to-brand-primary-50 p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-brand-error-600 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-brand-neutral-600 mb-6">
                We're sorry for the inconvenience. The application encountered an error.
              </p>
              
              {this.state.error && (
                <div className="bg-brand-error-50 border border-brand-error-200 rounded-lg p-4 mb-6 text-left">
                  <p className="font-mono text-sm text-brand-error-700 mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-brand-error-600 font-semibold">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 text-xs overflow-auto max-h-64 bg-white p-2 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-brand-primary-700 hover:to-brand-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;