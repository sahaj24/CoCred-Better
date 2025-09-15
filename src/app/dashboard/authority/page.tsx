
"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ChevronRight, LogOut, FilePlus, Plus, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { getAllUserProfiles, getEvents, removeEvent } from "@/lib/file-store";
import type { UserProfile, AppEvent } from "@/lib/types";
import { LanguageContext } from "@/lib/language-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
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
import { useToast } from "@/hooks/use-toast";


export default function AuthorityDashboard() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [eventToDelete, setEventToDelete] = useState<AppEvent | null>(null);
  const { translations } = useContext(LanguageContext);
  const { toast } = useToast();

  useEffect(() => {
    setStudents(getAllUserProfiles());
    setEvents(getEvents());
  }, []);

  const handleDeleteEvent = () => {
    if (!eventToDelete) return;
    removeEvent(eventToDelete.id);
    toast({
      title: "Event Deleted",
      description: `The event "${eventToDelete.name}" has been successfully removed.`,
    });
    setEvents(getEvents()); // Refresh the events list
    setEventToDelete(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 md:p-8 relative">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <User className="h-8 w-8" />
                {translations.authorityDashboard.title}
            </h1>
            <Button asChild variant="outline">
                <Link href="/">
                    <LogOut className="mr-2" />
                    {translations.authorityDashboard.logout}
                </Link>
            </Button>
        </div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle>{translations.authorityDashboard.studentRoster}</CardTitle>
            <CardDescription>{translations.authorityDashboard.selectStudent}</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length > 0 ? (
              <ul className="space-y-3">
                {students.map((student) => (
                  <li key={student.aaparId} className="flex items-center justify-between p-4 bg-secondary rounded-md hover:bg-secondary/80 transition-colors">
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
                      <div className="flex items-center gap-2">
                         <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/authority/issue-document/${student.aaparId}`}>
                                <FilePlus className="mr-2 h-4 w-4" />
                                Issue Document
                            </Link>
                        </Button>
                        <Button asChild size="sm">
                             <Link href={`/dashboard/authority/student/${student.aaparId}`} className="flex items-center">
                                View Documents
                                <ChevronRight className="h-5 w-5 text-primary-foreground ml-1" />
                            </Link>
                        </Button>
                      </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center">{translations.authorityDashboard.noStudents}</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Event Roster</CardTitle>
            <CardDescription>All scheduled events.</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <ul className="space-y-3">
                {events.map((event) => (
                  <li key={event.id} className="flex items-center justify-between p-4 bg-secondary rounded-md">
                      <div className="flex items-center gap-4">
                        <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-sm text-muted-foreground">{event.organizer}</p>
                            <p className="text-xs text-muted-foreground font-mono">{event.key}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                         <div>
                            <p className="text-sm font-medium">{format(new Date(event.startDate), "PPP")} - {format(new Date(event.endDate), "PPP")}</p>
                            <Link href={event.devopsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                DevOps Link
                            </Link>
                         </div>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => setEventToDelete(event)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete Event</span>
                                </Button>
                            </AlertDialogTrigger>
                            {eventToDelete && eventToDelete.id === event.id && (
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the event
                                    <span className="font-semibold text-foreground"> {event.name}</span>.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setEventToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteEvent}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            )}
                        </AlertDialog>
                      </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center">No events have been created yet.</p>
            )}
          </CardContent>
        </Card>

      </div>
      <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button asChild className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg" size="icon">
                    <Link href="/dashboard/authority/add-event">
                        <Plus className="h-8 w-8" />
                    </Link>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add Event</p>
            </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
