
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, File as FileIcon, LogOut, ExternalLink, Trash2, Star, ShieldCheck, QrCode, BookMarked, ArrowLeft } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { getFiles, removeFile, subscribe, StoredFile, getCurrentUserAaparId, getEvents } from "@/lib/file-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LanguageContext } from "@/lib/language-context";
import { format } from "date-fns";
import type { AppEvent } from "@/lib/types";


export default function CertificatesPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [fileToRemove, setFileToRemove] = useState<StoredFile | null>(null);
  const { toast } = useToast();
  const aaparId = getCurrentUserAaparId();
  const { translations } = useContext(LanguageContext);


  useEffect(() => {
    if (!aaparId) return;
    const updateFiles = () => {
        setFiles(getFiles(aaparId, "certificates"));
        setEvents(getEvents());
    };
    updateFiles();
    const unsubscribe = subscribe(updateFiles);
    return () => unsubscribe();
  }, [aaparId]);

  const handleRemove = () => {
    if (!fileToRemove) return;
    if (!aaparId) return;
    removeFile("certificates", fileToRemove.id);
    toast({
      title: translations.certificatesPage.fileRemovedTitle,
      description: `${fileToRemove.name} ${translations.certificatesPage.fileRemovedDescription}`,
    });
    setFileToRemove(null);
  };

  const handleOpen = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">{translations.certificatesPage.title}</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/student">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>
        
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader>
            <CardTitle>{translations.certificatesPage.uploadedCertificates}</CardTitle>
          </CardHeader>
          <CardContent>
            {files.length > 0 ? (
              <ul className="space-y-3">
                {files.map((file) => {
                  const event = file.eventKey ? events.find(e => e.key === file.eventKey) : null;
                  return (
                  <li key={file.id} className="certificate-file-item flex items-center justify-between p-3 bg-secondary rounded-md">
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-5 w-5 text-secondary-foreground" />
                      <span className={cn(
                        "font-medium",
                        file.status === 'rejected' && "text-red-500"
                      )}>{file.name}</span>
                      {file.status === 'approved' && <Star className="h-4 w-4 text-blue-500" fill="currentColor" />}
                      {file.signature && <ShieldCheck className="h-4 w-4 text-green-500" />}
                      {file.qrCode && <QrCode className="h-4 w-4 text-gray-500" />}
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
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{file.date}</span>
                       <Button variant="link" onClick={() => handleOpen(file.file)} className="text-primary hover:underline flex items-center gap-1 p-0 h-auto">
                        <ExternalLink className="h-4 w-4" />
                        {translations.certificatesPage.open}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setFileToRemove(file)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{translations.certificatesPage.remove}</span>
                          </Button>
                        </AlertDialogTrigger>
                         {fileToRemove && fileToRemove.id === file.id && (
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{translations.certificatesPage.areYouSure}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {translations.certificatesPage.permanentDelete}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setFileToRemove(null)}>{translations.certificatesPage.cancel}</AlertDialogCancel>
                              <AlertDialogAction onClick={handleRemove}>{translations.certificatesPage.continue}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        )}
                      </AlertDialog>
                    </div>
                  </li>
                )})}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center">{translations.certificatesPage.noCertificates}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
