
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { CardContent, CardFooter } from "../ui/card";
import { User, Mail, Hash, Lock, CalendarIcon } from "lucide-react";
import { registerUser } from "@/lib/file-store";
import { LanguageContext } from "@/lib/language-context";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Helper to convert file to data URL
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  dob: z.date({ required_error: "A date of birth is required." }),
  aaparId: z.string().regex(/^\d{4}-\d{4}-\d{4}$/, { message: "AAPAR ID must be in the format XXXX-XXXX-XXXX." }),
  image: z.any()
    .refine((file) => file, "Image is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), ".jpg, .jpeg, .png and .webp files are accepted."),
  signature: z.any()
    .refine((file) => file, "Signature is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), ".jpg, .jpeg, .png and .webp files are accepted."),
  identityProof: z.any()
    .refine((file) => file, "Identity proof is required."),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function StudentRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { translations } = useContext(LanguageContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      aaparId: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const imageUrl = await fileToDataURL(values.image);
      const signatureUrl = await fileToDataURL(values.signature);
      
      const userProfile = {
        name: values.name,
        email: values.email,
        dob: values.dob.toISOString(),
        aaparId: values.aaparId,
        imageUrl: imageUrl,
        signatureUrl: signatureUrl,
        password: values.password, // In a real app, this would be hashed
      };

      registerUser(userProfile);

      toast({
        title: translations.registerForm.regSuccessTitle,
        description: translations.registerForm.regSuccessDescription,
      });
      router.push("/login/student");

    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        variant: "destructive",
        title: translations.registerForm.regFailedTitle,
        description: translations.registerForm.regFailedDescription,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>{translations.registerForm.fullName}</FormLabel><FormControl><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Jane Doe" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>{translations.registerForm.email}</FormLabel><FormControl><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="jane.doe@example.com" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="dob" render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabel>{translations.registerForm.dob}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span>{translations.registerForm.pickDate}</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                </PopoverContent>
              </Popover><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="aaparId" render={({ field }) => (
            <FormItem><FormLabel>{translations.registerForm.aaparId}</FormLabel><FormControl><div className="relative"><Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="1234-5678-9012" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="image" render={({ field }) => (
            <FormItem><FormLabel>{translations.registerForm.uploadImage}</FormLabel><FormControl><Input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="signature" render={({ field }) => (
            <FormItem><FormLabel>{translations.registerForm.uploadSignature}</FormLabel><FormControl><Input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="identityProof" render={({ field }) => (
            <FormItem><FormLabel>{translations.registerForm.uploadId}</FormLabel><FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>{translations.registerForm.password}</FormLabel><FormControl><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="••••••••" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem><FormLabel>{translations.registerForm.confirmPassword}</FormLabel><FormControl><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="••••••••" {...field} className="pl-10" /></div></FormControl><FormMessage /></FormItem>
          )} />
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full">{translations.registerForm.createAccount}</Button>
          <p className="text-sm text-muted-foreground">
            {translations.registerForm.haveAccount}{" "}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/login/student">{translations.registerForm.loginHere}</Link>
            </Button>
          </p>
        </CardFooter>
      </form>
    </Form>
  );
}
