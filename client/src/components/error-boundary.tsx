import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo: errorInfo.componentStack
    });

    // Check for Pi SDK related errors
    const isPiError = error.message.includes('Pi') || 
                     error.message.includes('SDK') ||
                     error.stack?.includes('Pi');
    
    if (isPiError) {
      console.error('Pi SDK related error detected:', error);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isPiError = this.state.error?.message.includes('Pi') || 
                        this.state.error?.message.includes('SDK');
      
      const isNotInPiBrowser = typeof window !== 'undefined' && 
                               !navigator.userAgent.includes('PiBrowser') && 
                               !navigator.userAgent.includes('Pi Network');

      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-xl">
                {isPiError ? 'Pi SDK Error' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPiError && isNotInPiBrowser && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800 font-medium mb-2">
                    ⚠️ Pi Browser Required
                  </p>
                  <p className="text-xs text-orange-700">
                    This app is designed to work within the Pi Browser. 
                    Please open it from the Pi Network app for full functionality.
                  </p>
                </div>
              )}
              
              {isPiError && !isNotInPiBrowser && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    🔄 Pi SDK Loading Issue
                  </p>
                  <p className="text-xs text-blue-700">
                    The Pi SDK is not available or failed to load. 
                    Please try refreshing the page.
                  </p>
                </div>
              )}

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  Error Details:
                </p>
                <p className="text-xs text-red-700 font-mono break-all">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>

              <Button 
                onClick={this.handleReload} 
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                If this problem persists, please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;