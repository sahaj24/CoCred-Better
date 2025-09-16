"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: "1",
    question: "What is CoCred and how does it work?",
    answer: "CoCred is a digital platform for managing and showcasing your co-curricular activities. It helps you track your activities, get them verified by authorities, and build a comprehensive portfolio that can be shared with employers or academic institutions.",
    category: "Getting Started"
  },
  {
    id: "2",
    question: "How do I create my first activity entry?",
    answer: "To create an activity entry, go to your dashboard and click 'Add Activity'. Fill in the details including activity name, description, dates, and upload any supporting documents. Once submitted, it will be sent to the relevant authority for verification.",
    category: "Getting Started"
  },
  {
    id: "3",
    question: "How do I register for CoCred?",
    answer: "Click the 'Register' button on the homepage, choose whether you're a student or authority, and fill in your details. Students need to provide their university information, while authorities need institutional verification.",
    category: "Getting Started"
  },

  // Account Management
  {
    id: "4",
    question: "How can I update my profile information?",
    answer: "Go to Settings > Profile Settings where you can update your personal information, profile picture, bio, and contact details. Don't forget to save your changes!",
    category: "Account Management"
  },
  {
    id: "5",
    question: "Can I change my email address?",
    answer: "Yes, you can update your email address in the Settings section. You'll need to verify the new email address before the change takes effect.",
    category: "Account Management"
  },
  {
    id: "6",
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link via email. Follow the instructions to create a new password.",
    category: "Account Management"
  },

  // Activities & Verification
  {
    id: "7",
    question: "How long does activity verification take?",
    answer: "Verification typically takes 3-7 business days depending on the authority's workload. You'll receive email notifications when your activity status changes.",
    category: "Activities & Verification"
  },
  {
    id: "8",
    question: "What documents do I need to upload for verification?",
    answer: "Common documents include certificates, participation letters, photos from events, or official announcements. The specific requirements may vary by activity type and your institution's policies.",
    category: "Activities & Verification"
  },
  {
    id: "9",
    question: "Can I edit an activity after submission?",
    answer: "You can edit activities that are in 'Draft' or 'Rejected' status. Once an activity is approved, you cannot edit it, but you can contact the verifying authority for corrections.",
    category: "Activities & Verification"
  },
  {
    id: "10",
    question: "What happens if my activity is rejected?",
    answer: "If rejected, you'll receive feedback from the authority explaining the reason. You can then make necessary corrections and resubmit the activity for verification.",
    category: "Activities & Verification"
  },

  // Portfolio & Sharing
  {
    id: "11",
    question: "How do I share my portfolio?",
    answer: "Go to the 'Share Portfolio' section where you can generate a shareable link, download a PDF version, or share directly via social media. You can control what information is visible to others.",
    category: "Portfolio & Sharing"
  },
  {
    id: "12",
    question: "Can I customize what appears in my shared portfolio?",
    answer: "Yes! You can choose which activities to include, customize your profile visibility settings, and select what personal information to display in your public portfolio.",
    category: "Portfolio & Sharing"
  },
  {
    id: "13",
    question: "Is my portfolio data secure?",
    answer: "Absolutely. We use enterprise-grade security measures to protect your data. You have full control over privacy settings and can choose what information is public or private.",
    category: "Portfolio & Sharing"
  },

  // Technical Support
  {
    id: "14",
    question: "Why can't I upload my documents?",
    answer: "Check that your files are in supported formats (PDF, JPG, PNG, DOCX) and under 10MB each. Also ensure you have a stable internet connection. Clear your browser cache if issues persist.",
    category: "Technical Support"
  },
  {
    id: "15",
    question: "The website is loading slowly. What should I do?",
    answer: "Try refreshing the page, clearing your browser cache, or switching to a different browser. If problems persist, it might be a temporary server issue - please try again later or contact support.",
    category: "Technical Support"
  },
  {
    id: "16",
    question: "Can I use CoCred on my mobile device?",
    answer: "Yes! CoCred is fully responsive and works on all devices. For the best mobile experience, we recommend using the latest version of your mobile browser.",
    category: "Technical Support"
  }
];

const categories = Array.from(new Set(faqData.map(item => item.category)));

export function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filter FAQ items based on search and category
  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-[#2161FF]" />
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600">Find answers to common questions about CoCred</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for answers..."
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

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQ.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </CardContent>
          </Card>
        ) : (
          filteredFAQ.map(item => (
            <Card key={item.id} className="transition-all hover:shadow-md">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-[#2161FF] focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-blue-100 text-[#2161FF] px-2 py-1 rounded-full font-medium">
                          {item.category}
                        </span>
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
          <CardTitle className="text-center">Still Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MessageCircle className="h-6 w-6 text-[#2161FF]" />
              <span>Live Chat</span>
              <span className="text-xs text-gray-500">Available 24/7</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Mail className="h-6 w-6 text-[#2161FF]" />
              <span>Email Support</span>
              <span className="text-xs text-gray-500">support@cocred.com</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <ExternalLink className="h-6 w-6 text-[#2161FF]" />
              <span>Help Center</span>
              <span className="text-xs text-gray-500">Detailed guides</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">For Students:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Upload clear, high-quality documents</li>
                <li>• Provide detailed activity descriptions</li>
                <li>• Check your email for verification updates</li>
                <li>• Keep your profile information up to date</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">For Authorities:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Review activities promptly</li>
                <li>• Provide clear feedback for rejections</li>
                <li>• Set up proper verification criteria</li>
                <li>• Communicate with students when needed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}