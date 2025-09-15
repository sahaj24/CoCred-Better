"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import the same logic from supabase.ts for testing
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  return 'https://co-cred-better.vercel.app';
};

export default function TestRedirect() {
  const [result, setResult] = useState<any>(null);

  const testRedirectLogic = () => {
    const baseUrl = getBaseUrl();
    const redirectUrl = `${baseUrl}/auth/callback`;
    
    const testResult = {
      baseUrl,
      redirectUrl,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
        SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'server-side'
      }
    };
    
    setResult(testResult);
    console.log('Redirect Test Result:', testResult);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Redirect URL Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testRedirectLogic}>
              Test Redirect Logic
            </Button>
            
            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Test Results:</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Base URL:</strong> {result.baseUrl}</p>
                  <p><strong>Redirect URL:</strong> {result.redirectUrl}</p>
                  <p><strong>Environment:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>NODE_ENV: {result.environment.NODE_ENV}</li>
                    <li>VERCEL_URL: {result.environment.VERCEL_URL || 'undefined'}</li>
                    <li>SITE_URL: {result.environment.SITE_URL || 'undefined'}</li>
                    <li>Window Origin: {result.environment.windowOrigin}</li>
                  </ul>
                </div>
              </div>
            )}
            
            <div className="text-sm text-gray-600">
              <p>This page tests the redirect URL logic used for OAuth authentication.</p>
              <p>The redirect URL should match your current environment (localhost or deployed URL).</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}