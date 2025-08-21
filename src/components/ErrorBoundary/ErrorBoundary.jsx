import { Component } from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and error reporting service

    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      // Custom fallback UI
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            resetError={() => this.setState({ hasError: false })}
          />
        );
      }

      // Default fallback UI
      return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <Alert variant="danger" className="mb-4">
              <Alert.Heading>
                <i className="fas fa-exclamation-triangle me-2"></i>
                Oops! Something went wrong
              </Alert.Heading>
              <p className="mb-3">
                We&apos;re sorry, but something unexpected happened. Please try refreshing the page
                or go back to continue.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-3">
                  <summary className="text-start mb-2">
                    <strong>Error Details (Development Only)</strong>
                  </summary>
                  <pre className="text-start small">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </Alert>

            <div className="d-flex gap-2 justify-content-center">
              <Button variant="primary" onClick={this.handleReload}>
                <i className="fas fa-refresh me-2"></i>
                Refresh Page
              </Button>
              <Button variant="outline-secondary" onClick={this.handleGoBack}>
                <i className="fas fa-arrow-left me-2"></i>
                Go Back
              </Button>
            </div>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

// HOC for functional components
export const withErrorBoundary = (Component, fallback) => {
  const WrappedComponent = props => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default ErrorBoundary;
