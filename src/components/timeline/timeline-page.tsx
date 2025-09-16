"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

// Simple activity type matching the reference
interface TimelineActivity {
  id: string;
  title: string;
  category: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
}

export function TimelinePage() {
  const { user } = useAuth();

  // Simple mock activities like in the reference
  const allActivities: TimelineActivity[] = [
    {
      id: "1",
      title: "JavaScript Certification",
      category: "Technical Skills",
      date: "2025-09-01",
      status: "Approved"
    },
    {
      id: "2",
      title: "React Fundamentals Certificate",
      category: "Web Development",
      date: "2025-08-15",
      status: "Pending"
    },
    {
      id: "3",
      title: "Student Council Leadership",
      category: "Leadership",
      date: "2025-07-20",
      status: "Approved"
    },
    {
      id: "4",
      title: "Machine Learning Project",
      category: "Research",
      date: "2025-06-10",
      status: "Approved"
    },
    {
      id: "5",
      title: "Summer Internship",
      category: "Professional Experience",
      date: "2025-05-01",
      status: "Approved"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Activity Timeline</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#2161FF]"/>
            Your Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allActivities.length > 0 ? (
            <div className="border-l-2 border-border pl-6 space-y-8 relative">
              {allActivities.map((activity) => (
                <div key={activity.id} className="relative">
                  <div className={`absolute -left-[34px] top-1 h-4 w-4 rounded-full border-2 border-background ${
                    activity.status === 'Approved' ? 'bg-blue-500' : 
                    activity.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                  }`}></div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                  <p className="font-medium text-sm">
                    {activity.title} <span className="text-muted-foreground font-normal">in {activity.category}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Status: {activity.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your activity timeline is empty.</p>
              <p className="text-sm text-muted-foreground">Start logging activities to see your journey here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}