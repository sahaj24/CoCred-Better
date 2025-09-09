
"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, File as FileIcon, Check, X, Star, ExternalLink, ShieldCheck, BookMarked } from "lucide-react";
import { getProfileByAaparId, getFiles, subscribe, updateFileStatus, getEvents } from "@/lib/file-store";
import type { UserProfile, StoredFile, AppEvent } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { LanguageContext } from "@/lib/language-context";

const documentTypes = [
    { key: 'certificates', name: 'Certificates' },
    { key: 'internship', name: 'Internship Documents' },
    { key: 'gradesheets', name: 'Gradesheets' },
    { key: 'projects', name: 'Projects' },
];

export default function AuthorityStudentViewPage() {
    const params = useParams();
    const aaparId = params.aaparId as string;
    const { toast } = useToast();
    const { translations } = useContext(LanguageContext);

    const [student, setStudent] = useState<UserProfile | null>(null);
    const [files, setFiles] = useState<Record<string, StoredFile[]>>({});
    const [events, setEvents] = useState<AppEvent[]>([]);

    useEffect(() => {
        if (!aaparId) return;

        const updateAllData = () => {
            const profile = getProfileByAaparId(aaparId);
            setStudent(profile);

            const allFiles: Record<string, StoredFile[]> = {};
            documentTypes.forEach(docType => {
                allFiles[docType.key] = getFiles(aaparId, docType.key);
            });
            setFiles(allFiles);
            setEvents(getEvents());
        };

        updateAllData();
        const unsubscribe = subscribe(updateAllData);
        return () => unsubscribe();

    }, [aaparId]);
    
    const handleOpen = (file: File) => {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
    };
    
    const handleVerify = (fileType: string, fileId: string) => {
        updateFileStatus(aaparId, fileType, fileId, 'approved');
        toast({
            title: translations.authorityStudentView.documentVerifiedTitle,
            description: translations.authorityStudentView.documentVerifiedDescription,
        });
    };
    
    const handleReject = (fileType: string, fileId: string) => {
        updateFileStatus(aaparId, fileType, fileId, 'rejected');
        toast({
            variant: "destructive",
            title: translations.authorityStudentView.documentRejectedTitle,
            description: translations.authorityStudentView.documentRejectedDescription,
        });
    };


    if (!student) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-8">
                <p>{translations.authorityStudentView.loading}</p>
            </div>
        );
    }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <User className="h-8 w-8" />
                {translations.authorityStudentView.title}
            </h1>
            <Button asChild>
                <Link href="/dashboard/authority">
                    <ArrowLeft className="mr-2" />
                    {translations.authorityStudentView.backToRoster}
                </Link>
            </Button>
        </div>

        <Card className="shadow-lg w-full mb-8">
            <CardHeader>
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={student.imageUrl} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl">{student.name}</CardTitle>
                        <CardDescription>{student.aaparId}</CardDescription>
                        <p className="text-muted-foreground">{student.email}</p>
                    </div>
                </div>
            </CardHeader>
        </Card>

        <h2 className="text-2xl font-semibold mb-4">{translations.authorityStudentView.uploadedDocuments}</h2>
        
            <Accordion type="multiple" className="w-full">
                {documentTypes.map(docType => (
                    <AccordionItem value={docType.key} key={docType.key}>
                        <AccordionTrigger className="text-lg font-medium">
                            {translations.documentTypes[docType.key as keyof typeof translations.documentTypes]}
                        </AccordionTrigger>
                        <AccordionContent>
                            {files[docType.key] && files[docType.key].length > 0 ? (
                                <ul className="space-y-3 pt-2">
                                    {files[docType.key].map((file) => {
                                        const event = file.eventKey ? events.find(e => e.key === file.eventKey) : null;
                                        return (
                                        <li key={file.id} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                                            <div className="flex items-center gap-3">
                                                <FileIcon className="h-5 w-5 text-secondary-foreground" />
                                                <span className={cn(
                                                    "font-medium",
                                                    file.status === 'rejected' && "text-red-500"
                                                )}>{file.name}</span>
                                                {file.status === 'approved' && <Star className="h-4 w-4 text-blue-500" fill="currentColor" />}
                                                {file.signature && <ShieldCheck className="h-4 w-4 text-green-500" title={`Signature: ${file.signature}`} />}
                                                {event && (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                <BookMarked className="h-4 w-4 text-purple-600" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80">
                                                            <div className="p-4 space-y-3">
                                                                <h4 className="font-semibold">{event.name}</h4>
                                                                <p className="text-sm">
                                                                    <span className="font-medium text-muted-foreground">Organizer:</span> {event.organizer}
                                                                </p>
                                                                <p className="text-sm">
                                                                    <span className="font-medium text-muted-foreground">Date:</span> {format(new Date(event.startDate), "PPP")} - {format(new Date(event.endDate), "PPP")}
                                                                </p>
                                                                <Button asChild variant="link" className="p-0 h-auto text-sm">
                                                                    <Link href={event.devopsLink} target="_blank" rel="noopener noreferrer">
                                                                        DevOps Link <ExternalLink className="ml-1 h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="link" size="sm" onClick={() => handleOpen(file.file)}>
                                                    <ExternalLink className="h-4 w-4 mr-1" /> {translations.authorityStudentView.open}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => handleVerify(docType.key, file.id)}>
                                                    <Check className="h-5 w-5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => handleReject(docType.key, file.id)}>
                                                    <X className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </li>
                                    )})}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground text-center pt-2">{translations.authorityStudentView.noFiles}</p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

      </div>
    </div>
  );
}
