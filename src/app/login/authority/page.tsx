
"use client";

import { useContext } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthorityLoginForm } from "@/components/auth/authority-login-form";
import { AuthRedirectWrapper } from "@/components/auth/auth-redirect-wrapper";
import { BookUser } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageContext } from "@/lib/language-context";

export default function AuthorityLoginPage() {
  const { translations } = useContext(LanguageContext);
  return (
    <AuthRedirectWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <div className="absolute top-6 left-6">
          <Button variant="outline" asChild className="border-white/20 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {translations.loginPage.backToHome}
            </Link>
          </Button>
        </div>
        
        <div className="w-full max-w-md">
          {/* Floating decoration */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-200/20 rounded-full blur-xl"></div>
          
          <Card className="relative w-full border border-gray-200 bg-white">
            <CardHeader className="text-center pb-6 pt-6">
               <div className="mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl mb-4">
                <BookUser className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="font-bold text-2xl text-gray-800 mb-2">{translations.loginPage.authorityLoginTitle}</CardTitle>
              <CardDescription className="text-gray-600 text-sm">{translations.loginPage.authorityLoginDescription}</CardDescription>
            </CardHeader>
            <AuthorityLoginForm />
          </Card>
        </div>
      </main>
    </AuthRedirectWrapper>
  );
}
