import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface PiStatusProps {
  children: React.ReactNode;
}

interface PiStatus {
  isLoaded: boolean;
  isPiBrowser: boolean;
  isInitialized: boolean;
  error: string | null;
}

export default function PiStatus({ children }: PiStatusProps) {
  const [piStatus, setPiStatus] = useState<PiStatus>({
    isLoaded: false,
    isPiBrowser: false,
    isInitialized: false,
    error: null
  });

  useEffect(() => {
    const checkPiStatus = () => {
      const userAgent = navigator.userAgent || '';
      const isPiBrowser = userAgent.includes('PiBrowser') || userAgent.includes('Pi Network');
      
      // Check if Pi SDK is loaded
      const isLoaded = typeof window !== 'undefined' && !!window.Pi;
      const isInitialized = isLoaded && !!window.Pi?.initialized;
      
      let error: string | null = null;
      
      if (!isPiBrowser && !isLoaded) {
        error = "This app requires the Pi Browser for full functionality. Please open it from the Pi Network app.";
      } else if (!isLoaded) {
        error = "Pi SDK failed to load. Some features may not work properly.";
      }

      setPiStatus({
        isLoaded,
        isPiBrowser,
        isInitialized,
        error
      });
    };

    // Check immediately
    checkPiStatus();

    // Check again after a delay to allow Pi SDK to load
    const timeoutId = setTimeout(checkPiStatus, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Don't show warning for these paths as they don't require Pi SDK
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const nonPiPaths = ['/landing', '/legal', '/not-found'];
  const shouldShowWarning = !nonPiPaths.some(path => currentPath.includes(path));

  if (piStatus.error && shouldShowWarning) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <Card className="mb-4 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {!piStatus.isPiBrowser ? (
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-orange-900 mb-2">
                    {!piStatus.isPiBrowser ? 'Pi Browser Required' : 'Pi SDK Status'}
                  </p>
                  <p className="text-xs text-orange-800 mb-3">
                    {piStatus.error}
                  </p>
                  
                  {!piStatus.isPiBrowser && (
                    <div className="text-xs text-orange-700">
                      <p className="mb-2">To use PurpleBeats with full functionality:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Open the Pi Network mobile app</li>
                        <li>Navigate to the PurpleBeats app</li>
                        <li>Use the built-in Pi Browser</li>
                      </ol>
                    </div>
                  )}
                  
                  <p className="text-xs text-orange-600 mt-2 font-medium">
                    The app will continue to work with limited functionality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {children}
      </div>
    );
  }

  // Show success status briefly when Pi SDK is properly loaded
  if (piStatus.isLoaded && piStatus.isPiBrowser && shouldShowWarning) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <Card className="mb-4 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Pi SDK Ready
                  </p>
                  <p className="text-xs text-green-800">
                    All PurpleBeats features are available.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}