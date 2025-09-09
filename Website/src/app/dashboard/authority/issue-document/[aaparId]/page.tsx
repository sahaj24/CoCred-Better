
"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, FileUp, Key, List, Loader2, Hash } from "lucide-react";
import { getProfileByAaparId, issueFileToStudent, subscribe, getEvents } from "@/lib/file-store";
import type { UserProfile, AppEvent } from "@/lib/types";
import { LanguageContext } from "@/lib/language-context";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function IssueDocumentPage() {
    const params = useParams();
    const router = useRouter();
    const aaparId = params.aaparId as string;
    const { toast } = useToast();
    const { translations } = useContext(LanguageContext);

    const [student, setStudent] = useState<UserProfile | null>(null);
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentCategory, setDocumentCategory] = useState<string>("");
    const [secureKey, setSecureKey] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!aaparId) return;

        const updateProfile = () => {
            const profile = getProfileByAaparId(aaparId);
            setStudent(profile);
            setEvents(getEvents());
        };
        
        updateProfile();
        const unsubscribe = subscribe(updateProfile);
        return () => unsubscribe();
    }, [aaparId]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          if (file.type !== "application/pdf") {
            toast({
              variant: "destructive",
              title: "Invalid File Type",
              description: "Please upload a PDF file.",
            });
            event.target.value = '';
            setSelectedFile(null);
            return;
          }
          setSelectedFile(file);
        }
    };

    const handleSubmit = () => {
        if (!selectedFile || !documentCategory || !secureKey) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please select a file, a category, and provide a secure key.",
            });
            return;
        }

        if (documentCategory === 'certificates' && !events.some(e => e.key === secureKey)) {
             toast({
                variant: "destructive",
                title: "Invalid Event Key",
                description: "The selected key is not a valid event key for certificates.",
            });
            return;
        }

        setIsLoading(true);
        
        // Simulate async operation
        setTimeout(() => {
            issueFileToStudent(aaparId, documentCategory, selectedFile, secureKey);

            toast({
                title: "Document Issued Successfully",
                description: `${selectedFile.name} has been added to ${student?.name}'s profile.`,
            });
            
            router.push(`/dashboard/authority/student/${aaparId}`);
        }, 1000);
    };


    if (!student) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-8">
                <p>Loading student data...</p>
            </div>
        );
    }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <FileUp className="h-8 w-8" />
                Issue Document
            </h1>
            <Button asChild>
                <Link href={`/dashboard/authority/student/${aaparId}`}>
                    <ArrowLeft className="mr-2" />
                    Back to Student
                </Link>
            </Button>
        </div>

        <Card className="shadow-lg w-full mb-8">
            <CardHeader>
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={student.imageUrl} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{student.name}</CardTitle>
                        <CardDescription>Issuing a new document for this student.</CardDescription>
                    </div>
                </div>
            </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="document-upload">Upload Document (PDF only)</Label>
                    <div className="relative">
                        <FileUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="document-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="pl-10"/>
                    </div>
                </div>

                <div className="space-y-2">
                     <Label htmlFor="category-select">Document Category</Label>
                    <Select onValueChange={(value) => { setDocumentCategory(value); setSecureKey(''); }} value={documentCategory}>
                        <SelectTrigger id="category-select" className="w-full relative">
                             <List className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                             <div className="pl-6">
                                <SelectValue placeholder="Select a category..." />
                             </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="certificates">Certificate</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                            <SelectItem value="gradesheets">Gradesheet</SelectItem>
                            <SelectItem value="projects">Project</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="secure-key">{documentCategory === 'certificates' ? 'Event Key' : 'Secure Key'}</Label>
                     {documentCategory === 'certificates' ? (
                        <Select onValueChange={setSecureKey} value={secureKey}>
                            <SelectTrigger id="secure-key-select" className="w-full relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <div className="pl-6">
                                    <SelectValue placeholder="Select an event key..." />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {events.map(event => (
                                    <SelectItem key={event.id} value={event.key}>{event.key} ({event.name})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     ) : (
                         <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                            id="secure-key" 
                            type="text" 
                            placeholder="Enter the secure key for this document"
                            value={secureKey} 
                            onChange={(e) => setSecureKey(e.target.value)}
                            className="pl-10 font-mono text-sm" />
                        </div>
                     )}
                </div>
                
                <Button onClick={handleSubmit} disabled={isLoading || !selectedFile || !documentCategory || !secureKey} className="w-full">
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <FileUp className="mr-2"/>}
                    {isLoading ? "Issuing..." : "Upload and Issue Document"}
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
