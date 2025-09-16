"use client";

import { AuthorityLoginForm } from "@/components/auth/authority-login-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FacultyLoginPage() {
  // ensure the role=faculty query param is present so the login form treats it correctly
  const router = useRouter();
  useEffect(() => {
    // If current path lacks ?role=faculty, append it to URL (in-place)
    if (typeof window !== "undefined" && !window.location.search.includes("role=faculty")) {
      router.replace(`${window.location.pathname}?role=faculty`);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Faculty Login</h1>
        <AuthorityLoginForm />
      </div>
    </div>
  );
}
