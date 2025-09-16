
"use client";

import { useContext } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthorityRegisterForm } from "@/components/auth/authority-register-form";
import { AuthRedirectWrapper } from "@/components/auth/auth-redirect-wrapper";
import { BookUser } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageContext } from "@/lib/language-context";

export default function AuthorityRegisterPage() {
  const { translations } = useContext(LanguageContext);

  return (
    <AuthRedirectWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Button variant="outline" asChild>
          <Link href="/">
            &larr; {translations.registerPage.backToHome}
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-xl my-8">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/20 p-3 rounded-full mb-4">
            <BookUser className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl">{translations.registerPage.authorityRegisterTitle}</CardTitle>
          <CardDescription>{translations.registerPage.authorityRegisterDescription}</CardDescription>
        </CardHeader>
        <AuthorityRegisterForm />
      </Card>
    </main>
    </AuthRedirectWrapper>
  );
}
