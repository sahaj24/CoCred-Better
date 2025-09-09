
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, File as FileIcon, LogOut, ExternalLink, Trash2, Star } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { getFiles, removeFile, subscribe, StoredFile, getCurrentUserAaparId } from "@/lib/file-store";
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
import { cn } from "@/lib/utils";
import { LanguageContext } from "@/lib/language-context";

export default function GradesheetsPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [fileToRemove, setFileToRemove] = useState<StoredFile | null>(null);
  const { toast } = useToast();
  const aaparId = getCurrentUserAaparId();
  const { translations } = useContext(LanguageContext);


  useEffect(() => {
    if (!aaparId) return;
    const updateFiles = () => setFiles(getFiles(aaparId, "gradesheets"));
    updateFiles();
    const unsubscribe = subscribe(updateFiles);
    return () => unsubscribe();
  }, [aaparId]);

  const handleRemove = () => {
    if (!fileToRemove) return;
    removeFile("gradesheets", fileToRemove.id);
    toast({
      title: translations.gradesheetsPage.fileRemovedTitle,
      description: `${fileToRemove.name} ${translations.gradesheetsPage.fileRemovedDescription}`,
    });
    setFileToRemove(null);
  };

  const handleOpen = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <FileText className="h-8 w-8" />
            {translations.gradesheetsPage.title}
            </h1>
            <Button asChild>
                <Link href="/dashboard/student">
                    <LogOut className="mr-2" />
                    {translations.gradesheetsPage.backToDashboard}
                </Link>
            </Button>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{translations.gradesheetsPage.uploadedGradesheets}</CardTitle>
          </CardHeader>
          <CardContent>
            {files.length > 0 ? (
              <ul className="space-y-3">
                {files.map((file) => (
                  <li key={file.id} className="gradesheet-file-item flex items-center justify-between p-3 bg-secondary rounded-md">
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-5 w-5 text-secondary-foreground" />
                       <span className={cn(
                        "font-medium",
                        file.status === 'rejected' && "text-red-500"
                      )}>{file.name}</span>
                      {file.status === 'approved' && <Star className="h-4 w-4 text-blue-500" fill="currentColor" />}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{file.date}</span>
                       <Button variant="link" onClick={() => handleOpen(file.file)} className="text-primary hover:underline flex items-center gap-1 p-0 h-auto">
                        <ExternalLink className="h-4 w-4" />
                        {translations.gradesheetsPage.open}
                      </Button>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => setFileToRemove(file)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{translations.gradesheetsPage.remove}</span>
                          </Button>
                        </AlertDialogTrigger>
                        {fileToRemove && fileToRemove.id === file.id && (
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{translations.gradesheetsPage.areYouSure}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {translations.gradesheetsPage.permanentDelete}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setFileToRemove(null)}>{translations.gradesheetsPage.cancel}</AlertDialogCancel>
                              <AlertDialogAction onClick={handleRemove}>{translations.gradesheetsPage.continue}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        )}
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
                <p className="text-muted-foreground text-center">{translations.gradesheetsPage.noGradesheets}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
