
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentResetPasswordForm } from "@/components/auth/student-reset-password-form";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary/20 p-3 rounded-full mb-4">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Reset Password</CardTitle>
          <CardDescription>Enter the code and your new password.</CardDescription>
        </CardHeader>
        <StudentResetPasswordForm />
      </Card>
    </main>
  );
}
