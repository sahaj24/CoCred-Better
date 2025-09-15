
"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, Hash, ArrowLeft } from "lucide-react";
import { getCurrentUserProfile, subscribe, logoutUser } from "@/lib/file-store";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/lib/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { LanguageContext } from "@/lib/language-context";

export default function ProfilePage() {
    const router = useRouter();
    const [student, setStudent] = useState<UserProfile | null>(null);
    const { translations } = useContext(LanguageContext);

    useEffect(() => {
        const updateProfile = () => {
            const profile = getCurrentUserProfile();
            if (profile) {
                setStudent(profile);
            } else {
                // If no profile, maybe redirect to login
                router.push("/login/student");
            }
        };

        updateProfile();
        const unsubscribe = subscribe(updateProfile);
        return () => unsubscribe();
    }, [router]);

    if (!student) {
        return (
            <div className="flex min-h-screen flex-col items-center bg-background p-4 md:p-8">
                <div className="w-full max-w-4xl">
                    <div className="mb-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                            <User className="h-8 w-8" />
                            {translations.profilePage.title}
                        </h1>
                        <Button asChild>
                            <Link href="/dashboard/student">
                                <ArrowLeft className="mr-2" />
                                {translations.profilePage.backToDashboard}
                            </Link>
                        </Button>
                    </div>
                    <Card className="shadow-lg w-full">
                        <CardHeader>
                            <div className="flex items-center gap-6">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <div>
                                    <Skeleton className="h-8 w-48 mb-2" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="space-y-6">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <User className="h-8 w-8" />
                {translations.profilePage.title}
            </h1>
            <Button asChild>
                <Link href="/dashboard/student">
                    <ArrowLeft className="mr-2" />
                    {translations.profilePage.backToDashboard}
                </Link>
            </Button>
        </div>

        <Card className="shadow-lg w-full">
            <CardHeader>
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={student.imageUrl} alt={student.name} data-ai-hint="person" />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl">{student.name}</CardTitle>
                        <p className="text-muted-foreground">{translations.profilePage.student}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{translations.profilePage.email}</p>
                            <p className="text-primary">{student.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{translations.profilePage.dob}</p>
                            <p className="text-primary">{format(new Date(student.dob), "PPP")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Hash className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{translations.profilePage.aaparId}</p>
                            <p className="text-primary">{student.aaparId}</p>
                        </div>
                    </div>
                </div>
                 <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium mb-2">{translations.profilePage.signature}</p>
                        <div className="p-2 border rounded-md bg-secondary flex justify-center">
                            <Image src={student.signatureUrl} alt="Signature" width={200} height={50} data-ai-hint="signature" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
