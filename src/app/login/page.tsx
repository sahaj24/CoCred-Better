"use client";

import { useContext, useState, Suspense, useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthRedirectWrapper } from "@/components/auth/auth-redirect-wrapper";
import { GraduationCap, BookUser, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageContext } from "@/lib/language-context";
import { StudentLoginForm } from "@/components/auth/student-login-form";
import { AuthorityLoginForm } from "@/components/auth/authority-login-form";
import { useSearchParams } from "next/navigation";

type UserRole = 'student' | 'faculty' | 'authority';

function LoginPageContent() {
  const { translations } = useContext(LanguageContext);
  const searchParams = useSearchParams();
  
  // Get the default role from URL params or default to student
  const defaultRole = (searchParams?.get('role') as UserRole) || 'student';
  const [activeRole, setActiveRole] = useState<UserRole>(defaultRole);

  // Update active role when URL params change
  useEffect(() => {
    const roleParam = searchParams?.get('role') as UserRole;
    if (roleParam && ['student', 'faculty', 'authority'].includes(roleParam)) {
      setActiveRole(roleParam);
    }
  }, [searchParams]);

  const roles = [
    {
      id: 'student' as const,
      title: 'Student',
      description: 'Access your academic credentials',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      id: 'faculty' as const,
      title: 'Faculty',
      description: 'Manage classes and students',
      icon: BookUser,
      color: 'emerald'
    },
    {
      id: 'authority' as const,
      title: 'Authority',
      description: 'Administrative access',
      icon: Users,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: {
        tab: isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-600 hover:bg-blue-50',
        gradient: 'from-blue-50 to-indigo-50',
        icon: 'text-blue-600',
        button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
      },
      emerald: {
        tab: isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-600 hover:bg-emerald-50',
        gradient: 'from-emerald-50 to-teal-50',
        icon: 'text-emerald-600',
        button: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
      },
      purple: {
        tab: isActive ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-600 hover:bg-purple-50',
        gradient: 'from-purple-50 to-violet-50',
        icon: 'text-purple-600',
        button: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
      }
    };
    return colors[color as keyof typeof colors];
  };

  const activeRoleData = roles.find(role => role.id === activeRole)!;
  const activeColors = getColorClasses(activeRoleData.color, true);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
      <div className="absolute top-6 left-6">
        <Button variant="outline" asChild className="border-gray-200 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="relative w-full border-0 bg-white shadow-xl shadow-gray-100/50">
          {/* Role Tabs */}
          <div className="flex rounded-t-lg bg-gray-50 p-1">
            {roles.map((role) => {
              const isActive = activeRole === role.id;
              const colors = getColorClasses(role.color, isActive);
              const IconComponent = role.icon;
              
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-md transition-all duration-200 ${colors.tab}`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-sm font-medium">{role.title}</span>
                </button>
              );
            })}
          </div>

          <CardHeader className="text-center pb-6 pt-8">
            <div className={`mx-auto bg-gradient-to-br ${activeColors.gradient} p-4 rounded-2xl mb-4 shadow-sm`}>
              <activeRoleData.icon className={`h-8 w-8 ${activeColors.icon}`} />
            </div>
            <CardTitle className="font-semibold text-2xl text-gray-800 mb-2">
              {activeRoleData.title} Login
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {activeRoleData.description}
            </CardDescription>
          </CardHeader>

          <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading...</div>}>
            {activeRole === 'student' && (
              <div key="student">
                <StudentLoginForm />
              </div>
            )}
            {activeRole === 'faculty' && (
              <div key="faculty">
                <AuthorityLoginForm isFaculty={true} />
              </div>
            )}
            {activeRole === 'authority' && (
              <div key="authority">
                <AuthorityLoginForm isFaculty={false} />
              </div>
            )}
          </Suspense>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto text-blue-600 hover:text-blue-800 font-medium">
              <Link href="/register/student">Register here</Link>
            </Button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function UnifiedLoginPage() {
  return (
    <AuthRedirectWrapper>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
        <LoginPageContent />
      </Suspense>
    </AuthRedirectWrapper>
  );
}