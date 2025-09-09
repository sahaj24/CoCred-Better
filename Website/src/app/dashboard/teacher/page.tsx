
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ChevronRight, LogOut } from "lucide-react";
import { getAllUserProfiles } from "@/lib/file-store";
import type { UserProfile } from "@/lib/types";

export default function TeacherDashboard() {
  const [students, setStudents] = useState<UserProfile[]>([]);

  useEffect(() => {
    setStudents(getAllUserProfiles());
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <User className="h-8 w-8" />
                Teacher Dashboard
            </h1>
            <Button asChild variant="outline">
                <Link href="/">
                    <LogOut className="mr-2" />
                    Log Out
                </Link>
            </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>Select a student to view their documents.</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length > 0 ? (
              <ul className="space-y-3">
                {students.map((student) => (
                  <li key={student.aaparId}>
                    <Link href={`/dashboard/teacher/student/${student.aaparId}`} className="flex items-center justify-between p-4 bg-secondary rounded-md hover:bg-secondary/80 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={student.imageUrl} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.aaparId}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center">No students have registered yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
