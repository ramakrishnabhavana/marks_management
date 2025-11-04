import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogOut, GraduationCap, BookOpen, BarChart3, FileText, ClipboardList, FileCheck, Calendar } from "lucide-react";

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
      maxCIE: 40,
      marks: {
        slipTests: [4, 5, 3],
        assignments: [8, 10],
        classTests: [15, 18],
        attendance: 5,
      },
    },
    {
      courseCode: "22CSC22",
      name: "Enterprise Application Development",
      type: "theory",
      credits: 3,
      maxCIE: 40,
      marks: {
        slipTests: [5, 4, 5],
        assignments: [9, 10],
        classTests: [17, 19],
        attendance: 5,
      },
    },
    {
      courseCode: "22CSC23",
      name: "Machine Learning",
      type: "theory",
      credits: 3,
      maxCIE: 40,
      marks: {
        slipTests: [4, 5, 4],
        assignments: [8, 9],
        classTests: [16, 18],
        attendance: 4,
      },
    },
    {
      courseCode: "22ITC08",
      name: "Computer Networks",
      type: "theory",
      credits: 3,
      maxCIE: 40,
      marks: {
        slipTests: [3, 4, 4],
        assignments: [7, 9],
        classTests: [16, 15],
        attendance: 4,
      },
    },
    {
      courseCode: "22CSC24",
      name: "Formal Languages and Automata Theory",
      type: "theory",
      credits: 3,
      maxCIE: 40,
      marks: {
        slipTests: [5, 4, 5],
        assignments: [10, 9],
        classTests: [18, 17],
        attendance: 5,
      },
    },
    {
      courseCode: "22CSC25",
      name: "Professional Elective",
      type: "theory",
      credits: 3,
      maxCIE: 40,
      marks: {
        slipTests: [4, 5, 3],
        assignments: [8, 10],
        classTests: [15, 18],
        attendance: 5,
      },
    },
    {
      courseCode: "22CSC26",
      name: "CASE Tools Lab",
      type: "lab",
      credits: 1,
      maxCIE: 50,
      marks: {
        weeklyCIE: [28, 30, 25],
        internalTests: [18, 20],
      },
    },
    {
      courseCode: "22CSC27",
      name: "Enterprise Application Development Lab",
      type: "lab",
      credits: 1,
      maxCIE: 50,
      marks: {
        weeklyCIE: [27, 29, 26],
        internalTests: [19, 21],
      },
    },
    {
      courseCode: "22CSC28",
      name: "Computer Networks Lab",
      type: "lab",
      credits: 1,
      maxCIE: 50,
      marks: {
        weeklyCIE: [26, 28, 27],
        internalTests: [17, 19],
      },
    },
    {
      courseCode: "22CSC29",
      name: "Machine Learning Lab",
      type: "lab",
      credits: 1,
      maxCIE: 50,
      marks: {
        weeklyCIE: [29, 31, 28],
        internalTests: [20, 22],
      },
    },
    {
      courseCode: "22CSC30",
      name: "Competitive Coding",
      type: "lab",
      credits: 1,
      maxCIE: 50,
      marks: {
        weeklyCIE: [30, 32, 29],
        internalTests: [21, 23],
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

  const calculateCIETotal = (subject) => {
    if (subject.type === "theory") {
      // CIE = (sliptest1 + sliptest2 + sliptest3) - min(sliptest1, sliptest2, sliptest3) + (assignment1 + assignment2)/2 + (classtest1 + classtest2)/2 + attendance
      const slipTests = subject.marks.slipTests;
      let slipTestContribution = 0;
      if (slipTests.length >= 3) {
        const minSlipTest = Math.min(...slipTests);
        slipTestContribution = slipTests.reduce((a, b) => a + b, 0) - minSlipTest;
      } else if (slipTests.length === 2) {
        slipTestContribution = slipTests.reduce((a, b) => a + b, 0);
      } else if (slipTests.length === 1) {
        slipTestContribution = slipTests[0];
      }

      const assignmentAvg = subject.marks.assignments.length > 0
        ? subject.marks.assignments.reduce((a, b) => a + b, 0) / subject.marks.assignments.length
        : 0;

      const classTestAvg = subject.marks.classTests.length > 0
        ? subject.marks.classTests.reduce((a, b) => a + b, 0) / subject.marks.classTests.length
        : 0;

      const attendance = subject.marks.attendance || 0;
      return parseFloat((slipTestContribution + assignmentAvg + classTestAvg + attendance).toFixed(2));
    } else {
      // Average of weekly CIE marks (contributes to 30 marks)
      const weeklyCIEAvg = subject.marks.weeklyCIE.length > 0
        ? subject.marks.weeklyCIE.reduce((a, b) => a + b, 0) / subject.marks.weeklyCIE.length
        : 0;
      // Average of internal tests (contributes to 20 marks)
      const internalTestAvg = subject.marks.internalTests.length > 0
        ? subject.marks.internalTests.reduce((a, b) => a + b, 0) / subject.marks.internalTests.length
        : 0;
      return parseFloat((weeklyCIEAvg + internalTestAvg).toFixed(2));
    }
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

      <main className="container mx-auto px-6 py-10">
        {/* Subjects List */}
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BookOpen className="w-6 h-6" />
              My Subjects
            </CardTitle>
            <CardDescription className="text-base">Click on a subject to view detailed marks breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStudentData.subjects.map((subject) => (
                <Card
                  key={subject.courseCode}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                    selectedSubject?.courseCode === subject.courseCode ? "border-2 border-primary shadow-md" : "border-2 border-transparent"
                  }`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{subject.courseCode}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">{subject.name}</CardDescription>
                      </div>
                      <Badge variant={subject.type === "theory" ? "default" : "secondary"} className="ml-2">
                        {subject.type === "theory" ? "Theory" : "Lab"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <span className="font-medium">
                        {subject.type === "theory" ? "Theory (CIE: 40)" : "Lab (CIE: 50)"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-semibold">CIE Total</span>
                      <span className="font-bold text-2xl text-primary">
                        {calculateCIETotal(subject)}/{subject.maxCIE}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Marks View */}
        {selectedSubject && (
          <Card className="shadow-lg border-primary mt-8">
            <CardHeader className="pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl mb-2">
                    <BarChart3 className="w-6 h-6" />
                    {selectedSubject.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {selectedSubject.courseCode} | {selectedSubject.type === "theory" ? "Theory Subject" : "Lab Subject"}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Final Total</p>
                  <p className="text-3xl font-bold text-primary">
                    {calculateCIETotal(selectedSubject)}/{selectedSubject.maxCIE}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {selectedSubject.type === "theory" ? (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                        <FileText className="w-5 h-5" />
                        Slip Tests (Max 5 each)
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedSubject.marks.slipTests.map((mark, idx) => (
                          <Card key={idx} className="bg-muted/30 border-muted">
                            <CardContent className="pt-6 pb-6 text-center">
                              <p className="text-sm text-muted-foreground mb-2 font-medium">Slip Test {idx + 1}</p>
                              <p className="text-3xl font-bold text-primary">{mark}/5</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                        <ClipboardList className="w-5 h-5" />
                        Assignments (Max 10 each)
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedSubject.marks.assignments.map((mark, idx) => (
                          <Card key={idx} className="bg-muted/30 border-muted">
                            <CardContent className="pt-6 pb-6 text-center">
                              <p className="text-sm text-muted-foreground mb-2 font-medium">Assignment {idx + 1}</p>
                              <p className="text-3xl font-bold text-primary">{mark}/10</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                        <FileCheck className="w-5 h-5" />
                        Class Tests (Max 20 each)
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedSubject.marks.classTests.map((mark, idx) => (
                          <Card key={idx} className="bg-muted/30 border-muted">
                            <CardContent className="pt-6 pb-6 text-center">
                              <p className="text-sm text-muted-foreground mb-2 font-medium">Class Test {idx + 1}</p>
                              <p className="text-3xl font-bold text-primary">{mark}/20</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                        <Calendar className="w-5 h-5" />
                        Attendance (Max 5)
                      </h3>
                      <Card className="bg-muted/30 border-muted max-w-xs">
                        <CardContent className="pt-6 pb-6 text-center">
                          <p className="text-sm text-muted-foreground mb-2 font-medium">Attendance Marks</p>
                          <p className="text-3xl font-bold text-primary">{selectedSubject.marks.attendance}/5</p>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                        <FileText className="w-5 h-5" />
                        Weekly CIE (Max 30 each)
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedSubject.marks.weeklyCIE.map((mark, idx) => (
                          <Card key={idx} className="bg-muted/30 border-muted">
                            <CardContent className="pt-6 pb-6 text-center">
                              <p className="text-sm text-muted-foreground mb-2 font-medium">Week {idx + 1}</p>
                              <p className="text-3xl font-bold text-primary">{mark}/30</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                        <FileCheck className="w-5 h-5" />
                        Internal Tests (Max 20 each)
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedSubject.marks.internalTests.map((mark, idx) => (
                          <Card key={idx} className="bg-muted/30 border-muted">
                            <CardContent className="pt-6 pb-6 text-center">
                              <p className="text-sm text-muted-foreground mb-2 font-medium">Internal Test {idx + 1}</p>
                              <p className="text-3xl font-bold text-primary">{mark}/20</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
