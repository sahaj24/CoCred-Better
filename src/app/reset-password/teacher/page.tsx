
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherResetPasswordForm } from "@/components/auth/teacher-reset-password-form";
import { BookUser } from "lucide-react";

export default function TeacherResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/20 p-3 rounded-full mb-4">
            <BookUser className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl">Reset Password</CardTitle>
          <CardDescription>Enter the code and your new password.</CardDescription>
        </CardHeader>
        <TeacherResetPasswordForm />
      </Card>
    </main>
  );
}
