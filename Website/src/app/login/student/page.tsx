
"use client";

import { useContext } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentLoginForm } from "@/components/auth/student-login-form";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageContext } from "@/lib/language-context";

export default function StudentLoginPage() {
  const { translations } = useContext(LanguageContext);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Button variant="outline" asChild>
          <Link href="/">
            &larr; {translations.loginPage.backToHome}
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary/20 p-3 rounded-full mb-4">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">{translations.loginPage.studentLoginTitle}</CardTitle>
          <CardDescription>{translations.loginPage.studentLoginDescription}</CardDescription>
        </CardHeader>
        <StudentLoginForm />
      </Card>
    </main>
  );
}
