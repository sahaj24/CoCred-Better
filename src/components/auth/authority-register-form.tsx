
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContext } from "react";

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
import { User, Mail, Building, Lock } from "lucide-react";
import { LanguageContext } from "@/lib/language-context";
import { supabase } from "@/lib/supabase";
import { createOrGetFacultyClassCode } from "@/lib/classroom";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  college: z.string().min(3, { message: "College name is required." }),
  image: z.any().optional(),
  signature: z.any().optional(),
  identityProof: z.any().optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function AuthorityRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { translations } = useContext(LanguageContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      college: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
            college: values.college,
            user_type: 'authority',
            authority_type: 'faculty'
          }
        }
      });
      if (error) {
        throw error;
      }
      if (!data.user) {
        throw new Error('No user returned');
      }
      /* Faculty row will be created automatically on first login */
      toast({
        title: translations.registerForm.regSuccessTitle,
        description: translations.registerForm.regSuccessDescription,
      });
      router.push("/login/authority?role=faculty");
    } catch (err) {
      console.error('Registration failed', err);
      toast({
        variant: "destructive",
        title: translations.registerForm.regFailedTitle,
        description: (err as Error)?.message || translations.registerForm.regFailedDescription,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.registerForm.fullName}</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="John Doe" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.registerForm.email}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="john.doe@university.edu" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="college" render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.registerForm.college}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="University of Knowledge" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="image" render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.registerForm.uploadImage}</FormLabel>
              <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="signature" render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.registerForm.uploadSignature}</FormLabel>
              <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="identityProof" render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.registerForm.uploadId}</FormLabel>
              <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.registerForm.password}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.registerForm.confirmPassword}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full">{translations.registerForm.createAccount}</Button>
          <p className="text-sm text-muted-foreground">
            {translations.registerForm.haveAccount}{" "}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/login/authority">{translations.registerForm.loginHere}</Link>
            </Button>
          </p>
        </CardFooter>
      </form>
    </Form>
  );
}
