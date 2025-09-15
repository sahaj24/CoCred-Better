'use client'

import { useEffect, useState } from 'react'

export default function TestEnv() {
  const [envInfo, setEnvInfo] = useState<any>({})

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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Test</h1>
      <div className="bg-gray-100 p-4 rounded">
        <pre>{JSON.stringify(envInfo, null, 2)}</pre>
      </div>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Expected Redirect URL:</h2>
        <p className="bg-blue-100 p-2 rounded">
          {envInfo.windowOrigin}/dashboard/student
        </p>
      </div>
    </div>
  )
}