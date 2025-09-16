import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, MoreHorizontal, Download, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  status: 'approved' | 'pending' | 'disapproved';
  avatar?: string;
  lastActivity?: string;
  course?: string;
}

interface StudentTableProps {
  students: Student[];
  onApprove?: (studentId: string) => void;
  onDisapprove?: (studentId: string) => void;
  onViewDetails?: (studentId: string) => void;
  onBulkApprove?: (studentIds: string[]) => void;
  onBulkDisapprove?: (studentIds: string[]) => void;
  onExportCSV?: () => void;
  showActions?: boolean;
  showCourse?: boolean;
  showBulkActions?: boolean;
}

const statusConfig = {
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 hover:bg-green-200'
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
  },
  disapproved: {
    label: 'Disapproved',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 hover:bg-red-200'
  }
};

export function StudentTable({
  students,
  onApprove,
  onDisapprove,
  onViewDetails,
  onBulkApprove,
  onBulkDisapprove,
  onExportCSV,
  showActions = true,
  showCourse = false,
  showBulkActions = false
}: StudentTableProps) {
  const [sortField, setSortField] = useState<keyof Student>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleBulkApprove = () => {
    onBulkApprove?.(selectedStudents);
    setSelectedStudents([]);
  };

  const handleBulkDisapprove = () => {
    onBulkDisapprove?.(selectedStudents);
    setSelectedStudents([]);
  };

  const isAllSelected = selectedStudents.length === students.length;
  const isIndeterminate = selectedStudents.length > 0 && selectedStudents.length < students.length;

  const StatusBadge = ({ status }: { status: Student['status'] }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant="secondary" className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No students found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {showBulkActions && selectedStudents.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium">
            {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={handleBulkApprove}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve Selected
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleBulkDisapprove}
            >
              <X className="h-4 w-4 mr-1" />
              Disapprove Selected
            </Button>
            {onExportCSV && (
              <Button size="sm" variant="outline" onClick={onExportCSV}>
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {showBulkActions && (
              <TableHead className="w-12">
                <Checkbox 
                  checked={isAllSelected}
                  // @ts-ignore - indeterminate is not in the type definition but works
                  indeterminate={isIndeterminate}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all students"
                />
              </TableHead>
            )}
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('name')}
            >
              Student
              {sortField === 'name' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('studentId')}
            >
              Student ID
              {sortField === 'studentId' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            {showCourse && (
              <TableHead>Course</TableHead>
            )}
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('status')}
            >
              Status
              {sortField === 'status' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>Last Activity</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStudents.map((student) => (
            <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
              {showBulkActions && (
                <TableCell>
                  <Checkbox 
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                    aria-label={`Select ${student.name}`}
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {student.studentId}
              </TableCell>
              {showCourse && (
                <TableCell>{student.course || '-'}</TableCell>
              )}
              <TableCell>
                <StatusBadge status={student.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {student.lastActivity || 'Never'}
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {student.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => onApprove?.(student.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDisapprove?.(student.id)}
                        >
                          Disapprove
                        </Button>
                      </>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails?.(student.id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Documents</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        {student.status !== 'pending' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => onApprove?.(student.id)}
                              className="text-green-600"
                            >
                              Mark as Approved
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDisapprove?.(student.id)}
                              className="text-red-600"
                            >
                              Mark as Disapproved
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}