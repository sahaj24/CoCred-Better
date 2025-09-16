"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Calendar,
  Users,
  Award,
  Filter,
  Download
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface LeaderboardStudent {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  approvedActivities: number;
  totalActivities: number;
  lastActivity: string;
  rank: number;
  points: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

interface DepartmentStats {
  department: string;
  studentCount: number;
  avgActivities: number;
  topStudent: string;
}

export function LeaderboardPage() {
  const { user } = useAuth();
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"overall" | "department" | "year">("overall");

  // Mock leaderboard data - in real app this would come from backend
  const mockStudents: LeaderboardStudent[] = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@university.edu",
      department: "Computer Science",
      year: "4th Year",
      approvedActivities: 15,
      totalActivities: 18,
      lastActivity: "2025-09-15",
      rank: 1,
      points: 150,
      avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=2161FF&color=fff"
    },
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah.chen@university.edu",
      department: "Information Technology",
      year: "3rd Year",
      approvedActivities: 13,
      totalActivities: 15,
      lastActivity: "2025-09-14",
      rank: 2,
      points: 135,
      avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=2161FF&color=fff"
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      email: "michael.rodriguez@university.edu",
      department: "Computer Science",
      year: "4th Year",
      approvedActivities: 12,
      totalActivities: 14,
      lastActivity: "2025-09-13",
      rank: 3,
      points: 128,
      avatar: "https://ui-avatars.com/api/?name=Michael+Rodriguez&background=2161FF&color=fff"
    },
    {
      id: user?.id || "current",
      name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Current User",
      email: user?.email || "current.user@university.edu",
      department: "Computer Science",
      year: "3rd Year",
      approvedActivities: 8,
      totalActivities: 10,
      lastActivity: "2025-09-16",
      rank: 5,
      points: 85,
      isCurrentUser: true,
      avatar: user?.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=Current+User&background=2161FF&color=fff"
    },
    {
      id: "4",
      name: "Emma Thompson",
      email: "emma.thompson@university.edu",
      department: "Information Technology",
      year: "2nd Year",
      approvedActivities: 10,
      totalActivities: 12,
      lastActivity: "2025-09-12",
      rank: 4,
      points: 105,
      avatar: "https://ui-avatars.com/api/?name=Emma+Thompson&background=2161FF&color=fff"
    },
    {
      id: "5",
      name: "David Park",
      email: "david.park@university.edu",
      department: "Electronics",
      year: "3rd Year",
      approvedActivities: 7,
      totalActivities: 9,
      lastActivity: "2025-09-11",
      rank: 6,
      points: 75,
      avatar: "https://ui-avatars.com/api/?name=David+Park&background=2161FF&color=fff"
    },
    {
      id: "6",
      name: "Lisa Wang",
      email: "lisa.wang@university.edu",
      department: "Mechanical Engineering",
      year: "4th Year",
      approvedActivities: 9,
      totalActivities: 11,
      lastActivity: "2025-09-10",
      rank: 7,
      points: 95,
      avatar: "https://ui-avatars.com/api/?name=Lisa+Wang&background=2161FF&color=fff"
    }
  ];

  // Calculate department stats
  const departmentStats: DepartmentStats[] = useMemo(() => {
    const deptMap = new Map<string, { students: LeaderboardStudent[], totalActivities: number }>();
    
    mockStudents.forEach(student => {
      if (!deptMap.has(student.department)) {
        deptMap.set(student.department, { students: [], totalActivities: 0 });
      }
      const dept = deptMap.get(student.department)!;
      dept.students.push(student);
      dept.totalActivities += student.approvedActivities;
    });

    return Array.from(deptMap.entries()).map(([department, data]) => ({
      department,
      studentCount: data.students.length,
      avgActivities: Math.round(data.totalActivities / data.students.length),
      topStudent: data.students.sort((a, b) => b.approvedActivities - a.approvedActivities)[0].name
    }));
  }, [mockStudents]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-yellow-700" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-yellow-100 text-yellow-800 border-yellow-200",
        2: "bg-gray-100 text-gray-800 border-gray-200",
        3: "bg-yellow-100 text-yellow-700 border-yellow-200"
      };
      return (
        <Badge variant="outline" className={colors[rank as keyof typeof colors]}>
          #{rank}
        </Badge>
      );
    }
    return <Badge variant="outline">#{rank}</Badge>;
  };

  const filteredStudents = mockStudents.filter(student => {
    const matchesDept = filterDepartment === "all" || student.department === filterDepartment;
    const matchesYear = filterYear === "all" || student.year === filterYear;
    return matchesDept && matchesYear;
  });

  const uniqueDepartments = [...new Set(mockStudents.map(s => s.department))];
  const uniqueYears = [...new Set(mockStudents.map(s => s.year))].sort();

  const currentUserRank = mockStudents.find(s => s.isCurrentUser)?.rank || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-[#2161FF]" />
            Student Leaderboard
          </h1>
          <p className="text-gray-600">See how you rank among your peers based on approved activities</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Rankings
        </Button>
      </div>

      {/* Current User Highlight */}
      {currentUserRank > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-[#2161FF]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Current Ranking</h3>
                  <p className="text-sm text-gray-600">Keep up the great work!</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2161FF]">#{currentUserRank}</div>
                <div className="text-sm text-gray-600">out of {mockStudents.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Mode Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={viewMode === "overall" ? "default" : "outline"}
                onClick={() => setViewMode("overall")}
              >
                Overall Rankings
              </Button>
              <Button
                size="sm"
                variant={viewMode === "department" ? "default" : "outline"}
                onClick={() => setViewMode("department")}
              >
                By Department
              </Button>
              <Button
                size="sm"
                variant={viewMode === "year" ? "default" : "outline"}
                onClick={() => setViewMode("year")}
              >
                By Year
              </Button>
            </div>

            {viewMode === "overall" && (
              <>
                <select 
                  value={filterDepartment} 
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2161FF] focus:ring-[#2161FF]"
                >
                  <option value="all">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select 
                  value={filterYear} 
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2161FF] focus:ring-[#2161FF]"
                >
                  <option value="all">All Years</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {viewMode === "overall" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Student Rankings</span>
              <Badge variant="secondary" className="text-xs">
                Based on approved activities
              </Badge>
            </CardTitle>
            <CardDescription>
              Rankings are updated in real-time as activities get approved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-center">Activities</TableHead>
                  <TableHead className="text-center">Success Rate</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead>Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents
                  .sort((a, b) => a.rank - b.rank)
                  .map((student) => (
                    <TableRow 
                      key={student.id} 
                      className={`${student.isCurrentUser ? 'bg-white border-blue-200 shadow-sm' : 'hover:bg-gray-50'}`}
                    >
                      <TableCell className="font-bold">
                        <div className="flex items-center justify-center">
                          {getRankIcon(student.rank)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback className="bg-[#2161FF] text-white">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {student.name}
                              {student.isCurrentUser && (
                                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.year}</TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold">{student.approvedActivities}</div>
                        <div className="text-xs text-gray-500">of {student.totalActivities}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold">
                          {Math.round((student.approvedActivities / student.totalActivities) * 100)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-semibold">
                          {student.points}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(student.lastActivity).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Department Stats */}
      {viewMode === "department" && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Compare performance across different departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {departmentStats.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{dept.department}</h3>
                      <p className="text-sm text-gray-600">{dept.studentCount} students</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{dept.avgActivities} avg activities</div>
                      <div className="text-sm text-gray-600">Top: {dept.topStudent}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Performers Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Top Performers This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredStudents.slice(0, 3).map((student, index) => (
              <div key={student.id} className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="mb-3">{getRankIcon(index + 1)}</div>
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback className="bg-[#2161FF] text-white text-lg">
                    {student.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.department}</p>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-[#2161FF]">{student.approvedActivities}</span>
                  <span className="text-sm text-gray-500 ml-1">activities</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}