
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { addEvent } from "@/lib/file-store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, Calendar as CalendarIcon, Link as LinkIcon, Hash, User, FilePlus, ChevronRight } from "lucide-react";
import type { DateRange } from "react-day-picker";

export default function AddEventPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [eventName, setEventName] = useState("");
    const [date, setDate] = useState<DateRange | undefined>();
    const [eventKey, setEventKey] = useState("");
    const [eventOrganizer, setEventOrganizer] = useState("");
    const [devopsLink, setDevopsLink] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        if (!eventName || !date?.from || !date?.to || !eventKey || !eventOrganizer || !devopsLink) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please fill out all fields to create an event.",
            });
            return;
        }

        setIsLoading(true);

        const newEvent = {
            name: eventName,
            startDate: date.from.toISOString(),
            endDate: date.to.toISOString(),
            key: eventKey,
            organizer: eventOrganizer,
            devopsLink: devopsLink,
        };

        addEvent(newEvent);

        toast({
            title: "Event Created Successfully",
            description: `${eventName} has been added to the roster.`,
        });

        router.push("/dashboard/authority");
    };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <FilePlus className="h-8 w-8" />
                Add New Event
            </h1>
            <Button asChild>
                <Link href="/dashboard/authority">
                    <ArrowLeft className="mr-2" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>

        <Card className="shadow-lg w-full">
            <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Fill in the details below to create a new event.</CardDescription>
            </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name</Label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="event-name" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g., Annual Tech Fest 2024" className="pl-10"/>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="event-date">Event Dates</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pick a date range</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="event-key">Event Key</Label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="event-key" value={eventKey} onChange={(e) => setEventKey(e.target.value)} placeholder="A unique key for this event" className="pl-10 font-mono"/>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="event-organizer">Event Organizer</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="event-organizer" value={eventOrganizer} onChange={(e) => setEventOrganizer(e.target.value)} placeholder="e.g., Computer Science Department" className="pl-10"/>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="devops-link">DevOps Link</Label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="devops-link" type="url" value={devopsLink} onChange={(e) => setDevopsLink(e.target.value)} placeholder="https://example.com/devops" className="pl-10"/>
                    </div>
                </div>
                
                <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
                    {isLoading ? "Creating..." : "Create Event"}
                    <ChevronRight className="ml-2"/>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
