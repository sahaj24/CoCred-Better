"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  BookOpen,
  Users,
  Award,
  Shield,
  Settings,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const facultyFAQData: FAQItem[] = [
  // Getting Started - Faculty
  {
    id: "1",
    question: "How do I set up my faculty account and permissions?",
    answer: "After your initial account creation by the system administrator, go to Settings > Authority & Permissions to configure your approval rights. You can set permissions for approving internships, issuing certificates, managing events, and accessing analytics based on your role.",
    category: "Getting Started",
    tags: ["setup", "permissions", "account"]
  },
  {
    id: "2",
    question: "What are the different authority levels and what can I approve?",
    answer: "Authority levels include Department Faculty (approve department activities), Department Head (approve all department activities + cross-department), Dean (approve college-level activities), and System Admin (full access). Each level has specific approval permissions that can be customized.",
    category: "Getting Started",
    tags: ["authority", "permissions", "levels"]
  },
  {
    id: "3",
    question: "How do I access the faculty dashboard?",
    answer: "Log in with your faculty credentials and you'll be directed to your dashboard. The dashboard shows pending approvals, recent activities, system status, and quick action buttons for common tasks like reviewing submissions and managing events.",
    category: "Getting Started",
    tags: ["dashboard", "access", "login"]
  },

  // Activity Management
  {
    id: "4",
    question: "How do I review and approve student activity submissions?",
    answer: "Go to Activity Management to see all pending submissions. Click on any activity to view details, documents, and student information. You can approve, reject, or request additional documentation. Use the bulk action feature for multiple approvals.",
    category: "Activity Management",
    tags: ["review", "approve", "submissions"]
  },
  {
    id: "5",
    question: "What should I look for when verifying student documents?",
    answer: "Verify document authenticity, check dates align with event periods, ensure all required documentation is present, validate student information matches records, and confirm the activity meets institutional standards. Look for certificates, participation letters, project evidence, or completion confirmations.",
    category: "Activity Management",
    tags: ["verification", "documents", "validation"]
  },
  {
    id: "6",
    question: "How do I handle activities that require additional documentation?",
    answer: "Click 'Request More Info' on the activity, specify what additional documents are needed, and add comments for the student. The student will be notified automatically and can resubmit with the requested documentation.",
    category: "Activity Management",
    tags: ["documentation", "review", "resubmission"]
  },
  {
    id: "7",
    question: "Can I bulk approve multiple activities at once?",
    answer: "Yes, if you have bulk approval permissions. Select multiple activities using checkboxes, then choose 'Bulk Approve' from the actions menu. This is useful for similar activities like workshop completions or standard certifications.",
    category: "Activity Management",
    tags: ["bulk", "approve", "efficiency"]
  },
  {
    id: "8",
    question: "What happens after I approve a student activity?",
    answer: "The student is automatically notified of approval, the activity is added to their verified portfolio, and if applicable, an official certificate is generated. The activity also appears in institutional analytics and reporting.",
    category: "Activity Management",
    tags: ["approval", "notification", "certificates"]
  },

  // Event Management
  {
    id: "9",
    question: "How do I create and manage institutional events?",
    answer: "Go to Event Management > Create Event. Fill in event details including name, dates, organizer, registration requirements, and add any relevant links. Once created, you can track registrations and manage event-related activities.",
    category: "Event Management",
    tags: ["events", "creation", "management"]
  },
  {
    id: "10",
    question: "How do I set up automatic certificate generation for events?",
    answer: "When creating an event, enable 'Auto-generate certificates' and specify completion criteria. After the event ends, certificates will be automatically generated for eligible participants and added to their portfolios.",
    category: "Event Management",
    tags: ["certificates", "automation", "events"]
  },
  {
    id: "11",
    question: "Can I collaborate with other faculty on event management?",
    answer: "Yes, you can add co-organizers when creating events. Co-organizers receive notifications about the event and can help manage registrations and approvals. Use the 'Add Collaborator' option in event settings.",
    category: "Event Management",
    tags: ["collaboration", "co-organizers", "teamwork"]
  },

  // Analytics & Reporting
  {
    id: "12",
    question: "How do I access and interpret analytics data?",
    answer: "Go to Analytics Dashboard to view comprehensive metrics including student engagement, event completion rates, certificate issuance, and department performance. Use filters to customize views by time period, department, or activity type.",
    category: "Analytics & Reporting",
    tags: ["analytics", "reports", "metrics"]
  },
  {
    id: "13",
    question: "Can I generate reports for administrative purposes?",
    answer: "Yes, use the 'Export Report' feature in Analytics to generate PDF or Excel reports. Reports can include student activity summaries, department performance, event analytics, and custom data ranges for administrative review.",
    category: "Analytics & Reporting",
    tags: ["reports", "export", "administration"]
  },
  {
    id: "14",
    question: "How do I track my department's performance over time?",
    answer: "The Analytics Dashboard includes department-specific metrics and trend analysis. You can view monthly comparisons, track student engagement rates, monitor certificate issuance, and compare performance against institutional averages.",
    category: "Analytics & Reporting",
    tags: ["performance", "trends", "department"]
  },

  // System Features
  {
    id: "15",
    question: "How do notifications work for faculty members?",
    answer: "You receive notifications for new submissions, urgent approvals, system updates, and scheduled reports. Customize notification preferences in Settings > Notifications. You can choose email, in-app, or both for different types of notifications.",
    category: "System Features",
    tags: ["notifications", "alerts", "preferences"]
  },
  {
    id: "16",
    question: "How do I manage my faculty profile and public visibility?",
    answer: "Go to Settings > Faculty Profile to update your information, research interests, office hours, and contact details. Use Privacy Settings to control what information is publicly visible to students and other faculty members.",
    category: "System Features",
    tags: ["profile", "privacy", "visibility"]
  },
  {
    id: "17",
    question: "What security features are available for faculty accounts?",
    answer: "Enable two-factor authentication, set session timeouts, receive login alerts, and monitor suspicious activity. Faculty accounts have enhanced security due to approval permissions. Regular password updates are recommended.",
    category: "System Features",
    tags: ["security", "2FA", "account protection"]
  },

  // Troubleshooting
  {
    id: "18",
    question: "What should I do if I can't access certain features or pages?",
    answer: "Check your authority permissions in Settings. If you need additional permissions, contact your system administrator. Some features may be restricted based on your faculty level or institutional policies.",
    category: "Troubleshooting",
    tags: ["access", "permissions", "restrictions"]
  },
  {
    id: "19",
    question: "How do I handle technical issues with document viewing or downloads?",
    answer: "Try refreshing the page, clearing browser cache, or using a different browser. Ensure pop-up blockers aren't preventing downloads. For persistent issues, check your internet connection or contact technical support.",
    category: "Troubleshooting",
    tags: ["technical", "documents", "downloads"]
  },
  {
    id: "20",
    question: "What if I accidentally approve or reject an activity?",
    answer: "Contact your system administrator immediately. Depending on institutional policy, approvals may be reversible within a certain timeframe. Document the error and provide justification for the reversal request.",
    category: "Troubleshooting",
    tags: ["mistakes", "reversal", "corrections"]
  },

  // Best Practices
  {
    id: "21",
    question: "What are the best practices for efficient activity review?",
    answer: "Set regular review schedules, use filters to prioritize high-priority submissions, create standardized verification checklists, communicate clearly with students about requirements, and use bulk actions for similar activities.",
    category: "Best Practices",
    tags: ["efficiency", "review", "workflow"]
  },
  {
    id: "22",
    question: "How should I communicate with students about their submissions?",
    answer: "Use the built-in comment system for specific feedback, be clear and constructive in rejection reasons, provide guidance for resubmission, respond promptly to student queries, and maintain professional communication standards.",
    category: "Best Practices",
    tags: ["communication", "feedback", "students"]
  },
  {
    id: "23",
    question: "How can I ensure consistent approval standards across my department?",
    answer: "Establish clear departmental guidelines, conduct regular faculty meetings to discuss standards, use the comment system to document approval rationale, and coordinate with other faculty members on borderline cases.",
    category: "Best Practices",
    tags: ["consistency", "standards", "coordination"]
  }
];

const categories = Array.from(new Set(facultyFAQData.map(item => item.category)));

export function FacultyFAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filter FAQ items based on search and category
  const filteredFAQ = facultyFAQData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-[#2161FF]" />
          Faculty FAQ & Help Center
        </h1>
        <p className="text-gray-600">Find answers to common questions about using CoCred as a faculty member</p>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for answers, features, or procedures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                onClick={() => setSelectedCategory("All")}
                size="sm"
                className={selectedCategory === "All" ? "bg-[#2161FF] hover:bg-blue-700" : ""}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className={selectedCategory === category ? "bg-[#2161FF] hover:bg-blue-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-[#2161FF] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Activity Management</h3>
            <p className="text-sm text-gray-600">Learn how to review, approve, and manage student submissions efficiently</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-[#2161FF] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Event & Certificates</h3>
            <p className="text-sm text-gray-600">Create events and manage automatic certificate generation</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-[#2161FF] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Authority & Security</h3>
            <p className="text-sm text-gray-600">Understand permissions, security features, and best practices</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQ.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </CardContent>
          </Card>
        ) : (
          filteredFAQ.map(item => (
            <Card key={item.id} className="bg-white transition-all hover:shadow-md">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-[#2161FF] focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        <div className="flex gap-1">
                          {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs bg-blue-100 text-[#2161FF] px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.question}
                      </h3>
                    </div>
                    <div className="ml-4">
                      {expandedItems.includes(item.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>
                
                {expandedItems.includes(item.id) && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center">Need Additional Support?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            Can't find what you're looking for? Our dedicated faculty support team is here to help!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MessageCircle className="h-6 w-6 text-[#2161FF]" />
              <span>Faculty Chat Support</span>
              <span className="text-xs text-gray-500">Available Mon-Fri 9-5</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Mail className="h-6 w-6 text-[#2161FF]" />
              <span>Email Support</span>
              <span className="text-xs text-gray-500">faculty-support@cocred.com</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <BookOpen className="h-6 w-6 text-[#2161FF]" />
              <span>Faculty Handbook</span>
              <span className="text-xs text-gray-500">Comprehensive guide</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Faculty Tips */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Faculty Tips & Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Efficient Review Process:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-6">
                <li>• Set up daily review schedules</li>
                <li>• Use filters to prioritize submissions</li>
                <li>• Implement standardized checklists</li>
                <li>• Utilize bulk approval for similar activities</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-600" />
                System Optimization:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-6">
                <li>• Configure notification preferences</li>
                <li>• Customize dashboard for your workflow</li>
                <li>• Set up security features (2FA, alerts)</li>
                <li>• Regular profile and settings updates</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-purple-600" />
                Student Communication:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-6">
                <li>• Provide clear, constructive feedback</li>
                <li>• Use comment system for specific guidance</li>
                <li>• Respond promptly to student queries</li>
                <li>• Maintain professional communication standards</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-orange-600" />
                Quality Assurance:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-6">
                <li>• Establish consistent approval standards</li>
                <li>• Document rationale for decisions</li>
                <li>• Coordinate with department colleagues</li>
                <li>• Regular review of institutional policies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}