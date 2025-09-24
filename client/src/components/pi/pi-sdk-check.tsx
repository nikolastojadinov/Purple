import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PiSdkCheckProps {
  children: React.ReactNode;
}

export default function PiSdkCheck({ children }: PiSdkCheckProps) {
  const [piSdkStatus, setPiSdkStatus] = useState<'loading' | 'available' | 'unavailable'>('loading');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 10; // Try for 5 seconds (500ms * 10)

    const checkPiSdk = () => {
      attempts++;
      console.log(`🔍 Checking Pi SDK availability (attempt ${attempts}/${maxAttempts})`);
      
      if (typeof window !== 'undefined' && window.Pi) {
        console.log('✅ Pi SDK is available');
        setPiSdkStatus('available');
        return;
      }
      
      if (attempts >= maxAttempts) {
        console.log('❌ Pi SDK not found after maximum attempts');
        setPiSdkStatus('unavailable');
        return;
      }
      
      timeoutId = setTimeout(checkPiSdk, 500);
    };

    // Start checking immediately
    checkPiSdk();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [retryCount]);

  const handleRetry = () => {
    setPiSdkStatus('loading');
    setRetryCount(prev => prev + 1);
  };

  const isPiBrowser = typeof navigator !== 'undefined' && 
    (navigator.userAgent.includes('PiBrowser') || navigator.userAgent.includes('Pi Network'));

  if (piSdkStatus === 'loading') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin flex-shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Loading PurpleBeats</h1>
                <p className="text-sm text-gray-600">
                  Initializing Pi SDK...
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                This should only take a moment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (piSdkStatus === 'unavailable') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pi Browser Required</h1>
                <p className="text-sm text-gray-600">
                  PurpleBeats works best with the Pi Browser
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 mb-2">
                <strong>To use PurpleBeats:</strong>
              </p>
              <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                <li>Download the Pi Network app</li>
                <li>Open the Pi Browser within the app</li>
                <li>Navigate to PurpleBeats</li>
              </ol>
            </div>

            {!isPiBrowser && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600">
                  <strong>Current browser:</strong> {navigator.userAgent.split(' ')[0]}
                  <br />
                  <strong>Pi Browser detected:</strong> No
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleRetry}
                className="w-full"
                variant="outline"
              >
                Try Again
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Some features may not work properly outside Pi Browser
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pi SDK is available, render children
  return <>{children}</>;
}