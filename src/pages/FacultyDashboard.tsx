import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Users, BookOpen, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock data for faculty subjects
const mockFacultyData = {
  name: "Dr. Robert Smith",
  subjects: [
    {
      id: "sub1",
      courseCode: "22CSC21",
      name: "Software Engineering",
      type: "theory",
      credits: 3,
      class: "CSE-3A",
      students: 60,
    },
    {
      id: "sub2",
      courseCode: "22CSC23",
      name: "CASE Tools Lab",
      type: "lab",
      credits: 1,
      class: "CSE-3A",
      students: 60,
    },
    {
      id: "sub3",
      courseCode: "22ITC08",
      name: "Computer Networks",
      type: "theory",
      credits: 3,
      class: "CSE-3B",
      students: 58,
    },
  ],
};

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<typeof mockFacultyData.subjects[0] | null>(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  
  // Form states for theory subjects
  const [slipTest1, setSlipTest1] = useState("");
  const [slipTest2, setSlipTest2] = useState("");
  const [slipTest3, setSlipTest3] = useState("");
  const [assignment1, setAssignment1] = useState("");
  const [assignment2, setAssignment2] = useState("");
  const [classTest1, setClassTest1] = useState("");
  const [classTest2, setClassTest2] = useState("");
  const [attendance, setAttendance] = useState("");

  // Form states for lab subjects
  const [weeklyCIE1, setWeeklyCIE1] = useState("");
  const [weeklyCIE2, setWeeklyCIE2] = useState("");
  const [weeklyCIE3, setWeeklyCIE3] = useState("");
  const [internalTest1, setInternalTest1] = useState("");
  const [internalTest2, setInternalTest2] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const calculateTheoryTotal = () => {
    const slipTests = [parseFloat(slipTest1) || 0, parseFloat(slipTest2) || 0, parseFloat(slipTest3) || 0];
    const bestSlipTests = slipTests.sort((a, b) => b - a).slice(0, 2);
    const slipTestAvg = (bestSlipTests.reduce((a, b) => a + b, 0) / 2);
    
    const assignmentAvg = ((parseFloat(assignment1) || 0) + (parseFloat(assignment2) || 0)) / 2;
    const classTestAvg = ((parseFloat(classTest1) || 0) + (parseFloat(classTest2) || 0)) / 2;
    const attendanceMarks = parseFloat(attendance) || 0;

    return (slipTestAvg + assignmentAvg + classTestAvg + attendanceMarks).toFixed(2);
  };

  const calculateLabTotal = () => {
    const weeklyCIE = [parseFloat(weeklyCIE1) || 0, parseFloat(weeklyCIE2) || 0, parseFloat(weeklyCIE3) || 0];
    const weeklyCIEAvg = weeklyCIE.reduce((a, b) => a + b, 0) / weeklyCIE.length;
    const scaledWeeklyCIE = (weeklyCIEAvg / 30) * 50;
    
    const internalTestAvg = ((parseFloat(internalTest1) || 0) + (parseFloat(internalTest2) || 0)) / 2;
    const scaledInternalTest = (internalTestAvg / 20) * 50;

    const total = (scaledWeeklyCIE + scaledInternalTest) / 2;
    return total.toFixed(2);
  };

  const handleSubmitMarks = () => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive",
      });
      return;
    }

    const total = selectedSubject?.type === "theory" ? calculateTheoryTotal() : calculateLabTotal();

    toast({
      title: "Marks Uploaded Successfully",
      description: `Total CIE Marks: ${total}/50`,
    });

    // Reset form
    setSlipTest1("");
    setSlipTest2("");
    setSlipTest3("");
    setAssignment1("");
    setAssignment2("");
    setClassTest1("");
    setClassTest2("");
    setAttendance("");
    setWeeklyCIE1("");
    setWeeklyCIE2("");
    setWeeklyCIE3("");
    setInternalTest1("");
    setInternalTest2("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-accent text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Faculty Portal</h1>
                <p className="text-white/90 text-sm">{mockFacultyData.name}</p>
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
        {/* Subjects Overview */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              My Subjects
            </CardTitle>
            <CardDescription>Select a subject to upload marks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {mockFacultyData.subjects.map((subject) => (
                <Card
                  key={subject.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedSubject?.id === subject.id ? "border-2 border-primary shadow-md" : ""
                  }`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{subject.courseCode}</CardTitle>
                        <CardDescription className="mt-1">{subject.name}</CardDescription>
                      </div>
                      <Badge variant={subject.type === "theory" ? "default" : "secondary"}>
                        {subject.type === "theory" ? "Theory" : "Lab"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Class: {subject.class}</span>
                      <span>Credits: {subject.credits}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {subject.students} students
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Marks Upload Form */}
        {selectedSubject && (
          <Card className="shadow-lg border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Marks - {selectedSubject.name}
              </CardTitle>
              <CardDescription>
                {selectedSubject.courseCode} | {selectedSubject.class} | {selectedSubject.type === "theory" ? "Theory" : "Lab"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Student Selection */}
                <div className="space-y-2">
                  <Label htmlFor="student">Select Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student1">Alice Johnson (CSE-3A-001)</SelectItem>
                      <SelectItem value="student2">Bob Williams (CSE-3A-002)</SelectItem>
                      <SelectItem value="student3">Carol Davis (CSE-3A-003)</SelectItem>
                      <SelectItem value="student4">David Miller (CSE-3A-004)</SelectItem>
                      <SelectItem value="student5">Emma Wilson (CSE-3A-005)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedStudent && (
                  <>
                    {selectedSubject.type === "theory" ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Theory Marks Form */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Slip Tests (Max 5 each)</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="slip1">Test 1</Label>
                              <Input
                                id="slip1"
                                type="number"
                                max="5"
                                step="0.5"
                                value={slipTest1}
                                onChange={(e) => setSlipTest1(e.target.value)}
                                placeholder="0-5"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="slip2">Test 2</Label>
                              <Input
                                id="slip2"
                                type="number"
                                max="5"
                                step="0.5"
                                value={slipTest2}
                                onChange={(e) => setSlipTest2(e.target.value)}
                                placeholder="0-5"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="slip3">Test 3</Label>
                              <Input
                                id="slip3"
                                type="number"
                                max="5"
                                step="0.5"
                                value={slipTest3}
                                onChange={(e) => setSlipTest3(e.target.value)}
                                placeholder="0-5"
                              />
                            </div>
                          </div>

                          <h3 className="font-semibold text-lg border-b pb-2 mt-6">Assignments (Max 10 each)</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="assign1">Assignment 1</Label>
                              <Input
                                id="assign1"
                                type="number"
                                max="10"
                                step="0.5"
                                value={assignment1}
                                onChange={(e) => setAssignment1(e.target.value)}
                                placeholder="0-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="assign2">Assignment 2</Label>
                              <Input
                                id="assign2"
                                type="number"
                                max="10"
                                step="0.5"
                                value={assignment2}
                                onChange={(e) => setAssignment2(e.target.value)}
                                placeholder="0-10"
                              />
                            </div>
                          </div>

                          <h3 className="font-semibold text-lg border-b pb-2 mt-6">Class Tests (Max 20 each)</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="class1">Test 1</Label>
                              <Input
                                id="class1"
                                type="number"
                                max="20"
                                step="0.5"
                                value={classTest1}
                                onChange={(e) => setClassTest1(e.target.value)}
                                placeholder="0-20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="class2">Test 2</Label>
                              <Input
                                id="class2"
                                type="number"
                                max="20"
                                step="0.5"
                                value={classTest2}
                                onChange={(e) => setClassTest2(e.target.value)}
                                placeholder="0-20"
                              />
                            </div>
                          </div>

                          <h3 className="font-semibold text-lg border-b pb-2 mt-6">Attendance (Max 5)</h3>
                          <div className="space-y-2">
                            <Label htmlFor="attendance">Attendance Marks</Label>
                            <Input
                              id="attendance"
                              type="number"
                              max="5"
                              step="0.5"
                              value={attendance}
                              onChange={(e) => setAttendance(e.target.value)}
                              placeholder="0-5"
                            />
                          </div>
                        </div>

                        {/* Calculation Summary */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Automated Calculation</h3>
                          <div className="bg-primary/10 p-6 rounded-lg space-y-3">
                            <div className="text-sm space-y-2">
                              <p className="font-medium">Slip Tests (Best 2 of 3):</p>
                              <p className="text-muted-foreground">Auto-calculated from entered values</p>
                            </div>
                            <div className="text-sm space-y-2">
                              <p className="font-medium">Assignments Average:</p>
                              <p className="text-muted-foreground">Auto-calculated from 2 assignments</p>
                            </div>
                            <div className="text-sm space-y-2">
                              <p className="font-medium">Class Tests Average:</p>
                              <p className="text-muted-foreground">Auto-calculated from 2 tests</p>
                            </div>
                            <div className="text-sm space-y-2">
                              <p className="font-medium">Attendance:</p>
                              <p className="text-muted-foreground">Direct entry</p>
                            </div>
                            <div className="pt-4 border-t border-primary/20">
                              <p className="text-2xl font-bold text-accent">
                                Total CIE: {calculateTheoryTotal()}/50
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Lab Marks Form */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Weekly CIE (Max 30 each)</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="week1">Week 1</Label>
                              <Input
                                id="week1"
                                type="number"
                                max="30"
                                step="0.5"
                                value={weeklyCIE1}
                                onChange={(e) => setWeeklyCIE1(e.target.value)}
                                placeholder="0-30"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="week2">Week 2</Label>
                              <Input
                                id="week2"
                                type="number"
                                max="30"
                                step="0.5"
                                value={weeklyCIE2}
                                onChange={(e) => setWeeklyCIE2(e.target.value)}
                                placeholder="0-30"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="week3">Week 3</Label>
                              <Input
                                id="week3"
                                type="number"
                                max="30"
                                step="0.5"
                                value={weeklyCIE3}
                                onChange={(e) => setWeeklyCIE3(e.target.value)}
                                placeholder="0-30"
                              />
                            </div>
                          </div>

                          <h3 className="font-semibold text-lg border-b pb-2 mt-6">Internal Tests (Max 20 each)</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="internal1">Test 1</Label>
                              <Input
                                id="internal1"
                                type="number"
                                max="20"
                                step="0.5"
                                value={internalTest1}
                                onChange={(e) => setInternalTest1(e.target.value)}
                                placeholder="0-20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="internal2">Test 2</Label>
                              <Input
                                id="internal2"
                                type="number"
                                max="20"
                                step="0.5"
                                value={internalTest2}
                                onChange={(e) => setInternalTest2(e.target.value)}
                                placeholder="0-20"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Calculation Summary */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Automated Calculation</h3>
                          <div className="bg-primary/10 p-6 rounded-lg space-y-3">
                            <div className="text-sm space-y-2">
                              <p className="font-medium">Weekly CIE Average:</p>
                              <p className="text-muted-foreground">Scaled to 50 marks</p>
                            </div>
                            <div className="text-sm space-y-2">
                              <p className="font-medium">Internal Tests Average:</p>
                              <p className="text-muted-foreground">Scaled to 50 marks</p>
                            </div>
                            <div className="text-sm space-y-2">
                              <p className="font-medium">Final CIE:</p>
                              <p className="text-muted-foreground">Average of both components</p>
                            </div>
                            <div className="pt-4 border-t border-primary/20">
                              <p className="text-2xl font-bold text-accent">
                                Total CIE: {calculateLabTotal()}/50
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t">
                      <Button onClick={handleSubmitMarks} className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Marks
                      </Button>
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

export default FacultyDashboard;
