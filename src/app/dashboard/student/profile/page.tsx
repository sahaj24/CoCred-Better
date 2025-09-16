
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
            <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-9 w-16" />
                    </div>
                    <Card className="bg-white shadow-sm border border-gray-100">
                        <CardHeader className="pb-4">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="flex-1">
                                    <Skeleton className="h-6 w-48 mb-2" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Minimal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/student">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.imageUrl} alt={student.name} data-ai-hint="person" />
                <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
                  {student.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
                <p className="text-gray-600 text-sm">{translations.profilePage.student}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-700">{translations.profilePage.email}</p>
                  </div>
                  <p className="text-gray-900 font-medium">{student.email}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-700">{translations.profilePage.dob}</p>
                  </div>
                  <p className="text-gray-900 font-medium">{format(new Date(student.dob), "PPP")}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-700">{translations.profilePage.aaparId}</p>
                  </div>
                  <p className="text-gray-900 font-medium">{student.aaparId}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">{translations.profilePage.signature}</p>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-center">
                    <Image 
                      src={student.signatureUrl} 
                      alt="Signature" 
                      width={200} 
                      height={50} 
                      data-ai-hint="signature"
                      className="max-h-12 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
