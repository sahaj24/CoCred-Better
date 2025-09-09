
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherForgotPasswordForm } from "@/components/auth/teacher-forgot-password-form";
import { BookUser } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TeacherForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Button variant="outline" asChild>
          <Link href="/login/teacher">
            &larr; Back to Login
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/20 p-3 rounded-full mb-4">
            <BookUser className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a verification code.</CardDescription>
        </CardHeader>
        <TeacherForgotPasswordForm />
      </Card>
    </main>
  );
}
