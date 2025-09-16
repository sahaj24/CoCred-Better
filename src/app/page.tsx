
"use client";

import { useContext } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookUser, Users, LogIn, UserPlus, Code } from 'lucide-react';
import { LanguageContext } from '@/lib/language-context';
import { AuthRedirectWrapper } from '@/components/auth/auth-redirect-wrapper';
import { DEV_MODE } from '@/lib/dev-config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


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


export default function Home() {
  const { translations } = useContext(LanguageContext);

  return (
    <AuthRedirectWrapper>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4 sm:p-6 md:p-8">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        
        {/* Dev Mode Banner */}
        {DEV_MODE.BYPASS_AUTH && (
          <div className="fixed top-4 left-4 z-50">
            <Button asChild variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200">
              <Link href="/dev-nav">
                <Code className="mr-2 h-4 w-4" />
                Dev Navigation
              </Link>
            </Button>
          </div>
        )}
        
        <div className="text-center mb-10">
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
            {translations.home.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {translations.home.subtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
          <Card className="border border-gray-200 hover:border-blue-300 transition-colors duration-300">
            <CardHeader className="items-center text-center pb-4">
              <div className="p-2 bg-blue-50 rounded-lg mb-2">
                <BookUser className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="font-headline text-xl">{translations.home.forAuthorities}</CardTitle>
              <CardDescription className="text-sm">{translations.home.authoritiesDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3 justify-center pt-0">
              <Button asChild className="w-full sm:w-auto h-9 text-sm">
                <Link href="/login/authority">
                  <LogIn className="mr-2 h-4 w-4" /> {translations.home.login}
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto h-9 text-sm">
                <Link href="/register/authority">
                  <UserPlus className="mr-2 h-4 w-4" /> {translations.home.createAccount}
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 hover:border-blue-300 transition-colors duration-300">
            <CardHeader className="items-center text-center pb-4">
              <div className="p-2 bg-indigo-50 rounded-lg mb-2">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="font-headline text-xl">Faculty Portal</CardTitle>
              <CardDescription className="text-sm">Access faculty dashboard and manage academic activities</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3 justify-center pt-0">
              <Button asChild className="w-full sm:w-auto h-9 text-sm">
                <Link href="/login/authority?role=faculty">
                  <LogIn className="mr-2 h-4 w-4" /> {translations.home.login}
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto h-9 text-sm">
                <Link href="/register/authority?role=faculty">
                  <UserPlus className="mr-2 h-4 w-4" /> {translations.home.createAccount}
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 hover:border-blue-300 transition-colors duration-300">
            <CardHeader className="items-center text-center pb-4">
              <div className="p-2 bg-blue-50 rounded-lg mb-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="font-headline text-xl">{translations.home.forStudents}</CardTitle>
              <CardDescription className="text-sm">{translations.home.studentsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3 justify-center pt-0">
              <Button asChild className="w-full sm:w-auto h-9 text-sm">
                <Link href="/login/student">
                  <LogIn className="mr-2 h-4 w-4" /> {translations.home.login}
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto h-9 text-sm">
                <Link href="/register/student">
                  <UserPlus className="mr-2 h-4 w-4" /> {translations.home.createAccount}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </AuthRedirectWrapper>
  );
}
