
"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherLoginForm } from "@/components/auth/teacher-login-form";
import { BookUser } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TeacherLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Button variant="outline" asChild>
          <Link href="/">
            &larr; Back to Home
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/20 p-3 rounded-full mb-4">
            <BookUser className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl">Teacher Login</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <TeacherLoginForm />
      </Card>
    </main>
  );
}
