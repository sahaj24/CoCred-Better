
"use client";

import { useContext } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookUser, LogIn, UserPlus } from 'lucide-react';
import { LanguageContext } from '@/lib/language-context';
import { AuthRedirectWrapper } from '@/components/auth/auth-redirect-wrapper';
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
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background to-blue-50 p-4 sm:p-6 md:p-8">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary">
            {translations.home.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-base sm:text-lg">
            {translations.home.subtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <div className="p-3 bg-accent/20 rounded-full mb-2">
                <BookUser className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="font-headline text-2xl">{translations.home.forAuthorities}</CardTitle>
              <CardDescription>{translations.home.authoritiesDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/login/authority">
                  <LogIn className="mr-2" /> {translations.home.login}
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/register/authority">
                  <UserPlus className="mr-2" /> {translations.home.createAccount}
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <div className="p-3 bg-primary/20 rounded-full mb-2">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">{translations.home.forStudents}</CardTitle>
              <CardDescription>{translations.home.studentsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/login/student">
                  <LogIn className="mr-2" /> {translations.home.login}
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/register/student">
                  <UserPlus className="mr-2" /> {translations.home.createAccount}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </AuthRedirectWrapper>
  );
}
