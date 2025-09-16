"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, GraduationCap, Shield, Calendar, FileText, Settings } from "lucide-react";

export default function DevNavigationPage() {
  const navigationRoutes = [
    {
      category: "Authority Dashboards",
      routes: [
        {
          path: "/dashboard/authority",
          label: "Authority Dashboard",
          description: "Main authority dashboard with role-based interface",
          icon: Shield
        },
        {
          path: "/dashboard/authority/faculty",
          label: "Faculty Portal",
          description: "Faculty management interface",
          icon: User
        },
        {
          path: "/dashboard/authority/add-event",
          label: "Add Event",
          description: "Create new events",
          icon: Calendar
        }
      ]
    },
    {
      category: "Student Dashboards",
      routes: [
        {
          path: "/dashboard/student",
          label: "Student Dashboard",
          description: "Main student interface",
          icon: GraduationCap
        }
      ]
    },
    {
      category: "Authentication Pages",
      routes: [
        {
          path: "/login/authority",
          label: "Authority Login",
          description: "Authority login page",
          icon: Shield
        },
        {
          path: "/login/student",
          label: "Student Login",
          description: "Student login page",
          icon: GraduationCap
        },
        {
          path: "/register/authority",
          label: "Authority Register",
          description: "Authority registration page",
          icon: Shield
        }
      ]
    },
    {
      category: "Utility Pages",
      routes: [
        {
          path: "/unauthorized",
          label: "Unauthorized Page",
          description: "Access denied page",
          icon: Settings
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">🚀 Dev Navigation</h1>
          <p className="text-muted-foreground text-lg">
            Quick access to all pages for frontend development (no login required)
          </p>
        </div>

        <div className="space-y-8">
          {navigationRoutes.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-semibold mb-4 text-foreground border-b pb-2">
                {category.category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.routes.map((route) => {
                  const IconComponent = route.icon;
                  return (
                    <Card key={route.path} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{route.label}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {route.description}
                        </CardDescription>
                        <Button asChild className="w-full">
                          <Link href={route.path}>
                            Visit Page
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">💡</span>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Development Mode</h3>
              <p className="text-blue-800 text-sm">
                This page allows you to navigate to any part of the application without authentication. 
                Perfect for frontend development and testing UI components.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}