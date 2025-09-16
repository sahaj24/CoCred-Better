'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { SessionManager } from '@/lib/session-manager'
import { supabase } from '@/lib/supabase'

export default function TestEnv() {
  const [envInfo, setEnvInfo] = useState<any>({})
  const [sessionInfo, setSessionInfo] = useState<any>({})
  const { user, session, loading } = useAuth()

  useEffect(() => {
    // Get client-side environment info
    const clientEnv = {
      windowOrigin: window.location.origin,
      windowHref: window.location.href,
      nodeEnv: process.env.NODE_ENV,
      nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      nextPublicVercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
    }
    
    setEnvInfo(clientEnv)
    console.log('Environment Info:', clientEnv)
  }, [])

  useEffect(() => {
    // Get session debugging info
    const getSessionInfo = async () => {
      const savedState = SessionManager.loadSessionState()
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      const info = {
        authContextUser: user ? 'Present' : 'None',
        authContextSession: session ? 'Present' : 'None',
        authContextLoading: loading,
        currentSupabaseSession: currentSession ? 'Present' : 'None',
        savedSessionState: savedState ? 'Present' : 'None',
        localStorage: {
          supabaseToken: localStorage.getItem('supabase.auth.token') ? 'Present' : 'None',
          cocredSession: localStorage.getItem('cocred_session_state') ? 'Present' : 'None',
        }
      }
      
      setSessionInfo(info)
      console.log('Session Info:', info)
    }
    
    getSessionInfo()
  }, [user, session, loading])

  const testSessionRefresh = async () => {
    console.log('Testing session refresh...')
    const result = await SessionManager.ensureValidSession()
    console.log('Session refresh result:', result ? 'Success' : 'Failed')
    
    // Refresh the session info display
    const savedState = SessionManager.loadSessionState()
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    
    setSessionInfo((prev: any) => ({
      ...prev,
      testRefreshResult: result ? 'Success' : 'Failed',
      afterRefreshSession: currentSession ? 'Present' : 'None',
      afterRefreshSaved: savedState ? 'Present' : 'None',
    }))
  }

  const testUserTypeDetection = () => {
    const currentUserType = SessionManager.getSavedUserType();
    const pendingType = localStorage.getItem('cocred_pending_user_type');
    
    setSessionInfo((prev: any) => ({
      ...prev,
      currentUserType,
      pendingUserType: pendingType || 'None',
      detectionTest: 'Completed'
    }));
    
    console.log('User type detection test:', {
      currentUserType,
      pendingUserType: pendingType,
      fromUrl: window.location.pathname
    });
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Environment & Auth Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environment Info */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Environment Info</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(envInfo, null, 2)}</pre>
        </div>

        {/* Session Info */}
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Authentication State</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(sessionInfo, null, 2)}</pre>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Expected Redirect URL:</h2>
          <p className="bg-blue-100 p-2 rounded">
            {envInfo.windowOrigin}/dashboard/student
          </p>
        </div>

        <div className="space-x-2">
          <button 
            onClick={testSessionRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Session Refresh
          </button>
          
          <button 
            onClick={testUserTypeDetection}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Test User Type Detection
          </button>
          
          <button 
            onClick={() => SessionManager.clearSessionState()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear Session State
          </button>
        </div>

        {user && (
          <div className="bg-green-100 p-4 rounded">
            <h3 className="font-semibold text-green-800">User Authenticated ✓</h3>
            <p className="text-green-700">Email: {user.email}</p>
            <p className="text-green-700">ID: {user.id}</p>
          </div>
        )}
      </div>
    </div>
  )
}