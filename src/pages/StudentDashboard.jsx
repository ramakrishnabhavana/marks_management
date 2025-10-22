import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, GraduationCap, BookOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demonstration
const mockStudentData = {
  name: "Alice Johnson",
  rollNo: "CSE-3A-001",
  class: "CSE-3A",
  subjects: [
    {
      courseCode: "22CSC21",
      name: "Software Engineering",
      type: "theory",
      credits: 3,
      marks: {
        slipTests: [4, 5, 3],
        assignments: [8, 10],
        classTests: [15, 18],
        attendance: 5,
        totalCIE: 40,
        external: 60,
        total: 100,
      },
    },
    {
      courseCode: "22CSC23",
      name: "CASE Tools Lab",
      type: "lab",
      credits: 1,
      marks: {
        weeklyCIE: [28, 30, 25],
        internalTests: [18, 20],
        totalCIE: 47,
        external: 50,
        total: 97,
      },
    },
    {
      courseCode: "22CSC22",
      name: "Database Management Systems",
      type: "theory",
      credits: 3,
      marks: {
        slipTests: [5, 4, 5],
        assignments: [9, 8],
        classTests: [18, 17],
        attendance: 5,
        totalCIE: 42,
        external: 58,
        total: 100,
      },
    },
    {
      courseCode: "22ITC08",
      name: "Computer Networks",
      type: "theory",
      credits: 3,
      marks: {
        slipTests: [3, 4, 4],
        assignments: [7, 9],
        classTests: [16, 15],
        attendance: 4,
        totalCIE: 36,
        external: 55,
        total: 91,
      },
    },
  ],
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 75) return "text-info";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 90) return <Badge className="bg-success">Excellent</Badge>;
    if (percentage >= 75) return <Badge className="bg-info">Good</Badge>;
    if (percentage >= 60) return <Badge className="bg-warning text-white">Average</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  const calculateAverage = (marks) => {
    return (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Student Portal</h1>
                <p className="text-white/90 text-sm">{mockStudentData.name}</p>
              </div>
            </div>
            <Button variant="outline" className="text-white border-white hover:bg-white/20" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Student Info */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle>Academic Overview</CardTitle>
            <CardDescription>
              Roll No: {mockStudentData.rollNo} | Class: {mockStudentData.class}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Subjects Overview */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Subjects & Performance
            </CardTitle>
            <CardDescription>Click on a subject to view detailed marks breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Subject Name</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead className="text-center">CIE Marks</TableHead>
                  <TableHead className="text-center">External</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudentData.subjects.map((subject) => {
                  const percentage = (subject.marks.total / 100) * 100;
                  return (
                    <TableRow
                      key={subject.courseCode}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <TableCell className="font-medium">{subject.courseCode}</TableCell>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell className="text-center">{subject.credits}</TableCell>
                      <TableCell className="text-center font-semibold">{subject.marks.totalCIE}/50</TableCell>
                      <TableCell className="text-center">{subject.marks.external}/50</TableCell>
                      <TableCell className={`text-center font-bold text-lg ${getPerformanceColor(percentage)}`}>
                        {subject.marks.total}
                      </TableCell>
                      <TableCell className="text-center">{getPerformanceBadge(percentage)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        {selectedSubject && (
          <Card className="shadow-lg border-primary">
            <CardHeader>
              <CardTitle>{selectedSubject.name} - Detailed Breakdown</CardTitle>
              <CardDescription>
                {selectedSubject.courseCode} | {selectedSubject.type === "theory" ? "Theory" : "Lab"} | {selectedSubject.credits} Credits
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSubject.type === "theory" ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Internal Evaluation</h3>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="font-medium mb-2">Slip Tests (Best 2 of 3) - 5 marks</p>
                      <div className="flex gap-2 text-sm">
                        {selectedSubject.marks.slipTests.map((mark, idx) => (
                          <Badge key={idx} variant="outline">{mark}</Badge>
                        ))}
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Average: {calculateAverage(selectedSubject.marks.slipTests.sort((a, b) => b - a).slice(0, 2))}
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="font-medium mb-2">Assignments - 10 marks</p>
                      <div className="flex gap-2 text-sm">
                        {selectedSubject.marks.assignments.map((mark, idx) => (
                          <Badge key={idx} variant="outline">{mark}</Badge>
                        ))}
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Average: {calculateAverage(selectedSubject.marks.assignments)}
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="font-medium mb-2">Class Tests - 20 marks</p>
                      <div className="flex gap-2 text-sm">
                        {selectedSubject.marks.classTests.map((mark, idx) => (
                          <Badge key={idx} variant="outline">{mark}</Badge>
                        ))}
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Average: {calculateAverage(selectedSubject.marks.classTests)}
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="font-medium mb-2">Attendance - 5 marks</p>
                      <Badge variant="outline">{selectedSubject.marks.attendance}</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Summary</h3>
                    
                    <div className="bg-primary/10 p-6 rounded-lg space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-primary/20">
                        <span className="font-medium">Total CIE Marks:</span>
                        <span className="text-2xl font-bold text-primary">{selectedSubject.marks.totalCIE}/50</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-primary/20">
                        <span className="font-medium">External Marks:</span>
                        <span className="text-2xl font-bold text-primary">{selectedSubject.marks.external}/50</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-lg">Final Total:</span>
                        <span className="text-3xl font-bold text-accent">{selectedSubject.marks.total}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Lab Evaluation</h3>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="font-medium mb-2">Weekly CIE</p>
                      <div className="flex gap-2 text-sm flex-wrap">
                        {selectedSubject.marks.weeklyCIE.map((mark, idx) => (
                          <Badge key={idx} variant="outline">Week {idx + 1}: {mark}</Badge>
                        ))}
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Average: {calculateAverage(selectedSubject.marks.weeklyCIE)}
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="font-medium mb-2">Internal Tests</p>
                      <div className="flex gap-2 text-sm">
                        {selectedSubject.marks.internalTests.map((mark, idx) => (
                          <Badge key={idx} variant="outline">Test {idx + 1}: {mark}</Badge>
                        ))}
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Average: {calculateAverage(selectedSubject.marks.internalTests)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Summary</h3>
                    
                    <div className="bg-primary/10 p-6 rounded-lg space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-primary/20">
                        <span className="font-medium">Total CIE Marks:</span>
                        <span className="text-2xl font-bold text-primary">{selectedSubject.marks.totalCIE}/50</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-primary/20">
                        <span className="font-medium">External Marks:</span>
                        <span className="text-2xl font-bold text-primary">{selectedSubject.marks.external}/50</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-lg">Final Total:</span>
                        <span className="text-3xl font-bold text-accent">{selectedSubject.marks.total}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
