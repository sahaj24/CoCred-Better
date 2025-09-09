
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
import { Hash, Lock } from "lucide-react";
import { setCurrentUser } from "@/lib/file-store";
import { LanguageContext } from "@/lib/language-context";

const formSchema = z.object({
  aaparId: z.string().min(1, {
    message: "AAPAR ID is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export function StudentLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { translations } = useContext(LanguageContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aaparId: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const loginSuccess = setCurrentUser(values.aaparId, values.password);
    
    if (loginSuccess) {
      toast({
        title: translations.loginForm.loginSuccessTitle,
        description: translations.loginForm.loginSuccessDescription,
      });
      router.push("/dashboard/student");
    } else {
      toast({
        variant: "destructive",
        title: translations.loginForm.loginFailedTitle,
        description: translations.loginForm.loginFailedDescription,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="aaparId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.loginForm.aaparId}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={translations.loginForm.aaparIdPlaceholder} {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                 <div className="flex justify-between items-center">
                  <FormLabel>{translations.loginForm.password}</FormLabel>
                  <Button variant="link" asChild className="p-0 h-auto text-xs">
                    <Link href="/forgot-password/student">{translations.loginForm.forgotPassword}</Link>
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full">
            {translations.loginForm.login}
          </Button>
          <p className="text-sm text-muted-foreground">
            {translations.loginForm.noAccount}{" "}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/register/student">{translations.loginForm.registerHere}</Link>
            </Button>
          </p>
        </CardFooter>
      </form>
    </Form>
  );
}
