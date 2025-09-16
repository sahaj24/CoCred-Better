
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, File as FileIcon, LogOut, ExternalLink, Trash2, Star, ArrowLeft } from "lucide-react";
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


export default function ProjectsPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [fileToRemove, setFileToRemove] = useState<StoredFile | null>(null);
  const { toast } = useToast();
  const aaparId = getCurrentUserAaparId();
  const { translations } = useContext(LanguageContext);


  useEffect(() => {
    if (!aaparId) return;
    const updateFiles = () => setFiles(getFiles(aaparId, "projects"));
    updateFiles();
    const unsubscribe = subscribe(updateFiles);
    return () => unsubscribe();
  }, [aaparId]);

  const handleRemove = () => {
    if (!fileToRemove) return;
    removeFile("projects", fileToRemove.id);
    toast({
      title: translations.projectsPage.fileRemovedTitle,
      description: `${fileToRemove.name} ${translations.projectsPage.fileRemovedDescription}`,
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
            <GitBranch className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">{translations.projectsPage.title}</h1>
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
            <CardTitle>{translations.projectsPage.uploadedFiles}</CardTitle>
          </CardHeader>
          <CardContent>
            {files.length > 0 ? (
              <ul className="space-y-3">
                {files.map((file) => (
                  <li key={file.id} className="project-file-item flex items-center justify-between p-3 bg-secondary rounded-md">
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
                        {translations.projectsPage.open}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => setFileToRemove(file)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{translations.projectsPage.remove}</span>
                          </Button>
                        </AlertDialogTrigger>
                        {fileToRemove && fileToRemove.id === file.id && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{translations.projectsPage.areYouSure}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {translations.projectsPage.permanentDelete}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setFileToRemove(null)}>{translations.projectsPage.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRemove}>{translations.projectsPage.continue}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        )}
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
                <p className="text-muted-foreground text-center">{translations.projectsPage.noProjects}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
