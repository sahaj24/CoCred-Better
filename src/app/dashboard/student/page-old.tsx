
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Award, Briefcase, GitBranch, Share2, LogOut, User, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState, useContext } from "react";
import type { Notification } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { LanguageContext } from "@/lib/language-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function UploadItem({ icon: Icon, label, labelKey }: { icon: React.ElementType, label: string, labelKey: string }) {
  const id = `upload-${label.toLowerCase()}`;
  const { toast } = useToast();
  const router = useRouter();
  const { translations } = useContext(LanguageContext);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          variant: "destructive",
          title: translations.studentDashboard.invalidFileTypeTitle,
          description: translations.studentDashboard.invalidFileTypeDescription,
        });
        event.target.value = '';
        return;
      }

      const fileType = label.toLowerCase();
      addFile(fileType, file);
      
      toast({
        title: translations.studentDashboard.uploadSuccessfulTitle,
        description: `${file.name} ${translations.studentDashboard.uploadSuccessfulDescription}`,
      });
      
      router.push(`/dashboard/student/${fileType}`);
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={id} className="cursor-pointer">
        <div className="p-4 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </label>
      <Input id={id} type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
      <span className="text-sm font-medium">{translations.documentTypes[labelKey as keyof typeof translations.documentTypes]}</span>
    </div>
  );
}

function ViewItem({ icon: Icon, label, href }: { icon: React.ElementType, label: string, href: string }) {
  const { translations } = useContext(LanguageContext);
  return (
    <Link href={href} className="flex flex-col items-center gap-2 text-center">
      <div className="p-4 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
        <Icon className="h-8 w-8 text-secondary-foreground" />
      </div>
      <span className="text-sm font-medium">{translations.documentTypes[label as keyof typeof translations.documentTypes]}</span>
    </Link>
  );
}

function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const aaparId = getCurrentUserAaparId();
    const { translations } = useContext(LanguageContext);

    useEffect(() => {
        if (aaparId) {
            setNotifications(getNotifications(aaparId));
        }
    }, [aaparId]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleOpenChange = (open: boolean) => {
        if (!open && aaparId && unreadCount > 0) {
            markNotificationsAsRead(aaparId);
            setNotifications(getNotifications(aaparId));
        }
    };

    return (
        <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <Card>
                    <CardHeader>
                        <CardTitle>{translations.studentDashboard.notifications}</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            <ul className="space-y-3">
                                {notifications.map(n => (
                                    <li key={n.id} className="text-sm">
                                        <p className="font-medium">{n.message}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(n.date), { addSuffix: true })}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center">{translations.studentDashboard.noNewNotifications}</p>
                        )}
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>
    );
}

function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi' | 'ta')}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="hi">हिन्दी</SelectItem>
        <SelectItem value="ta">தமிழ்</SelectItem>
      </SelectContent>
    </Select>
  );
}


export default function StudentDashboard() {
  const router = useRouter();
  const { translations } = useContext(LanguageContext);

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 md:p-8">
       <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">{translations.studentDashboard.title}</h1>
        <div className="flex gap-2 items-center">
            <LanguageSwitcher />
            <NotificationBell />
           <Button asChild variant="outline">
              <Link href="/dashboard/student/profile">
                <User className="mr-2" />
                {translations.studentDashboard.viewProfile}
              </Link>
            </Button>
          <Button onClick={handleLogout}>
            <LogOut className="mr-2" />
            {translations.studentDashboard.logout}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-6 w-6" />
              {translations.studentDashboard.uploadDocuments}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <UploadItem icon={Award} label="Certificates" labelKey="certificates" />
            <UploadItem icon={Briefcase} label="Internship" labelKey="internship" />
            <UploadItem icon={FileText} label="Gradesheets" labelKey="gradesheets" />
            <UploadItem icon={GitBranch} label="Projects" labelKey="projects" />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              {translations.studentDashboard.viewDocuments}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ViewItem icon={Award} label="certificates" href="/dashboard/student/certificates" />
            <ViewItem icon={Briefcase} label="internship" href="/dashboard/student/internship" />
            <ViewItem icon={FileText} label="gradesheets" href="/dashboard/student/gradesheets" />
            <ViewItem icon={GitBranch} label="projects" href="/dashboard/student/projects" />
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-4xl mt-8 flex justify-center">
        <Button size="lg">
          <Share2 className="mr-2" />
          {translations.studentDashboard.sharePortfolio}
        </Button>
      </div>
    </div>
  );
}
