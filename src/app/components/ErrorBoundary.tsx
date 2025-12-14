import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                The application encountered an unexpected error.
                            </p>
                        </div>

                        {this.state.error && (
                            <div className="mb-6">
                                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                                        Error Details:
                                    </h2>
                                    <p className="text-sm font-mono text-red-700 dark:text-red-400 break-all">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            </div>
                        )}

                        {this.state.errorInfo && (
                            <details className="mb-6">
                                <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-2">
                                    Show Stack Trace
                                </summary>
                                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-auto max-h-64">
                                    <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
                            >
                                Reload Application
                            </button>
                        </div>

                        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            <p>If this problem persists, try clearing your browser cache or localStorage.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
