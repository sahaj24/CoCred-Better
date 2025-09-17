
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CardContent, CardFooter } from "../ui/card";
import { Mail, Lock } from "lucide-react";
import { supabase, signInWithGoogle } from "@/lib/supabase";
import { createOrGetFacultyClassCode } from "@/lib/classroom";
import { LanguageContext } from "@/lib/language-context";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function AuthorityLoginForm({ isFaculty: propIsFaculty }: { isFaculty?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { translations } = useContext(LanguageContext);
  
  // Check if we're in faculty mode from props, URL params, or current path
  const isFaculty = propIsFaculty !== undefined ? propIsFaculty : (
    searchParams.get('role') === 'faculty' || 
    (typeof window !== "undefined" && window.location.pathname.includes('/faculty'))
  );

  // Auto-set faculty role in URL if coming from faculty route
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.includes('/faculty') && !searchParams.get('role')) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('role', 'faculty');
      router.replace(newUrl.toString());
    }
  }, [router, searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: translations.loginForm.loginFailedTitle,
          description: error.message,
        });
        return;
      }

      if (data.user) {
        try {
          await createOrGetFacultyClassCode(data.user.id);
        } catch (err) {
          console.error('Failed to setup class code', err);
        }
        toast({
          title: translations.loginForm.loginSuccessTitle,
          description: translations.loginForm.loginSuccessDescription,
        });
        // Redirect based on role parameter
        if (isFaculty) {
          router.push("/dashboard/faculty");
        } else {
          router.push("/dashboard/authority");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: translations.loginForm.loginFailedTitle,
        description: translations.loginForm.loginFailedDescription,
      });
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle('authority');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Unable to sign in with Google. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">{translations.loginForm.email}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="authority@example.com" 
                    type="email" 
                    {...field} 
                    className="pl-10 h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg transition-all duration-200 bg-gray-50/50 focus:bg-white" 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">{translations.loginForm.password}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="pl-10 h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg transition-all duration-200 bg-gray-50/50 focus:bg-white" 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="flex justify-end">
            <Button variant="link" asChild className="p-0 h-auto text-sm text-blue-600 hover:text-blue-700 font-medium">
              <Link href={`/forgot-password/authority${isFaculty ? '?role=faculty' : ''}`}>{translations.loginForm.forgotPassword}</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 pb-6">
          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {translations.loginForm.login}
          </Button>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg font-medium transition-all duration-200 shadow-sm" 
            onClick={handleGoogleSignIn}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </Button>
          <p className="text-sm text-gray-600 text-center">
            {translations.loginForm.noAccount}{" "}
            <Button variant="link" asChild className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium">
              <Link href={`/register/authority${isFaculty ? '?role=faculty' : ''}`}>{translations.loginForm.registerHere}</Link>
            </Button>
          </p>
        </CardFooter>
      </form>
    </Form>
  );
}
