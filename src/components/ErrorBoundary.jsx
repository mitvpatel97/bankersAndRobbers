'use client';

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
        this.state = {
            hasError: true,
            error,
            errorInfo
        };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    maxWidth: '600px',
                    margin: '2rem auto',
                    backgroundColor: '#1a1a1a',
                    border: '2px solid #d4af37',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace'
                }}>
                    <h2 style={{ color: '#d4af37', marginBottom: '1rem' }}>
                        Something went wrong
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        The game encountered an unexpected error. Please refresh the page to continue.
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: '#2a2a2a',
                            borderRadius: '4px'
                        }}>
                            <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                                Error Details (Dev Only)
                            </summary>
                            <pre style={{
                                fontSize: '0.875rem',
                                overflow: 'auto',
                                color: '#ff6b6b'
                            }}>
                                {this.state.error.toString()}
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#d4af37',
                            color: '#1a1a1a',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
