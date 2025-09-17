
"use client";

import { useContext, useState, Suspense } from "react";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookUser, Users } from 'lucide-react';
import { LanguageContext } from '@/lib/language-context';
import { AuthRedirectWrapper } from '@/components/auth/auth-redirect-wrapper';
import { StudentLoginForm } from '@/components/auth/student-login-form';
import { AuthorityLoginForm } from '@/components/auth/authority-login-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserRole = 'student' | 'faculty' | 'authority';

function LanguageSwitcher() {
  const { language, setLanguage, translations } = useContext(LanguageContext);

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi' | 'ta')}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={translations.language} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="hi">हिन्दी</SelectItem>
        <SelectItem value="ta">தமிழ்</SelectItem>
      </SelectContent>
    </Select>
  );
}

function HomePageContent() {
  const { translations } = useContext(LanguageContext);
  const searchParams = useSearchParams();
  const urlRole = searchParams.get('role') as UserRole | null;
  const [activeRole, setActiveRole] = useState<UserRole>(urlRole || 'student');

  const roles = [
    {
      id: 'authority' as const,
      title: 'For Authorities',
      description: 'Access your dashboard and manage students.',
      icon: BookUser,
      color: 'purple'
    },
    {
      id: 'faculty' as const,
      title: 'Faculty Portal',
      description: 'Access faculty dashboard and manage academic activities',
      icon: Users,
      color: 'emerald'
    },
    {
      id: 'student' as const,
      title: 'For Students',
      description: 'Log in to access your educational resources.',
      icon: GraduationCap,
      color: 'blue'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: {
        tab: isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-600 hover:bg-blue-50',
        gradient: 'from-blue-50 to-indigo-50',
        icon: 'text-blue-600'
      },
      emerald: {
        tab: isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-600 hover:bg-emerald-50',
        gradient: 'from-emerald-50 to-teal-50',
        icon: 'text-emerald-600'
      },
      purple: {
        tab: isActive ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-600 hover:bg-purple-50',
        gradient: 'from-purple-50 to-violet-50',
        icon: 'text-purple-600'
      }
    };
    return colors[color as keyof typeof colors];
  };

  const activeRoleData = roles.find(role => role.id === activeRole)!;
  const activeColors = getColorClasses(activeRoleData.color, true);

  const renderLoginForm = () => {
    switch (activeRole) {
      case 'student':
        return <StudentLoginForm />;
      case 'faculty':
        return <AuthorityLoginForm isFaculty={true} />;
      case 'authority':
        return <AuthorityLoginForm isFaculty={false} />;
      default:
        return <StudentLoginForm />;
    }
  };

  return (
    <AuthRedirectWrapper>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
            CoCred
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {translations.home.subtitle}
          </p>
        </div>

        <div className="w-full max-w-lg">
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
                    <span className="text-xs font-medium text-center leading-tight">
                      {role.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <CardHeader className="items-center text-center pb-4 pt-8">
              <div className={`mx-auto bg-gradient-to-br ${activeColors.gradient} p-4 rounded-2xl mb-4 shadow-sm`}>
                <activeRoleData.icon className={`h-10 w-10 ${activeColors.icon}`} />
              </div>
              <CardTitle className="font-headline text-2xl mb-2">{activeRoleData.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0 pb-8">
              {renderLoginForm()}
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Don't have an account?
                </p>
                {activeRole === 'student' ? (
                  <Link 
                    href="/register/student" 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
                  >
                    Create Student Account
                  </Link>
                ) : (
                  <Link 
                    href={activeRole === 'faculty' ? "/register/authority?role=faculty" : "/register/authority"} 
                    className={`${activeRole === 'faculty' ? 'text-emerald-600 hover:text-emerald-700' : 'text-purple-600 hover:text-purple-700'} font-medium text-sm hover:underline`}
                  >
                    Create {activeRole === 'faculty' ? 'Faculty' : 'Authority'} Account
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AuthRedirectWrapper>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
