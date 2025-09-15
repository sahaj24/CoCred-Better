"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, FileText, Award, Briefcase, GitBranch } from "lucide-react";
import { useContext } from "react";
import { LanguageContext } from "@/lib/language-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/auth-context";

export default function StudentDashboard() {
  return (
    <ProtectedRoute requiredUserType="student">
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}

function StudentDashboardContent() {
  const { user, signOut } = useAuth();
  const { translations } = useContext(LanguageContext);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl blur-lg opacity-75"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-500 text-lg">Student Dashboard</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut} 
            className="flex items-center space-x-2 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-md"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-10 shadow-xl bg-white/80 backdrop-blur-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              Your Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-800">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Account Created:</span>
                  <span className="font-medium text-gray-800">
                    {user?.created_at && new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-mono text-sm text-gray-800">{user?.id?.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${user?.email_confirmed_at ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-gray-600">Email Verified:</span>
                  <span className={`font-medium ${user?.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user?.email_confirmed_at ? 'Yes' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                Document Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="group flex flex-col items-center p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 hover:border-yellow-200 cursor-pointer transition-all duration-200">
                  <Award className="h-10 w-10 text-yellow-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-semibold text-gray-700">Certificates</span>
                </div>
                <div className="group flex flex-col items-center p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-200 cursor-pointer transition-all duration-200">
                  <Briefcase className="h-10 w-10 text-green-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-semibold text-gray-700">Internship</span>
                </div>
                <div className="group flex flex-col items-center p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200 cursor-pointer transition-all duration-200">
                  <FileText className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-semibold text-gray-700">Gradesheets</span>
                </div>
                <div className="group flex flex-col items-center p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 hover:border-purple-200 cursor-pointer transition-all duration-200">
                  <GitBranch className="h-10 w-10 text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-semibold text-gray-700">Projects</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">Successfully authenticated with Supabase</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-800">Google OAuth integration ready</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-purple-800">Session management active</span>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <p className="text-sm font-medium text-blue-900">
                      Firebase has been successfully removed and replaced with Supabase authentication!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}