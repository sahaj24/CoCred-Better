
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

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
import { Mail } from "lucide-react";
import { findUserByEmail } from "@/lib/file-store";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

export function StudentForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const userExists = findUserByEmail(values.email);
    
    if (userExists) {
      toast({
        title: "Verification Sent",
        description: "A verification code has been sent to your email (simulated).",
      });
      // Pass email to the reset page via query params
      router.push(`/reset-password/student?email=${encodeURIComponent(values.email)}`);
    } else {
      toast({
        variant: "destructive",
        title: "User Not Found",
        description: "No student account found with that email address.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Enter your email" {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full">
            Send Verification Code
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
