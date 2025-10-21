import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Users, BookOpen, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Mock student data
const mockStudents = [
  { id: "s1", name: "Alice Johnson", rollNo: "CSE-3A-001", class: "CSE-3A" },
  { id: "s2", name: "Bob Williams", rollNo: "CSE-3A-002", class: "CSE-3A" },
  { id: "s3", name: "Carol Davis", rollNo: "CSE-3A-003", class: "CSE-3A" },
  { id: "s4", name: "David Miller", rollNo: "CSE-3A-004", class: "CSE-3A" },
  { id: "s5", name: "Emma Wilson", rollNo: "CSE-3A-005", class: "CSE-3A" },
];

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<typeof mockFacultyData.subjects[0] | null>(null);
  const [selectedTest, setSelectedTest] = useState("");
  const [bulkMarks, setBulkMarks] = useState<Record<string, string>>({});

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const getTestOptions = () => {
    if (!selectedSubject) return [];
    
    if (selectedSubject.type === "theory") {
      return [
        { value: "sliptest1", label: "Slip Test 1 (Max 5)", max: 5 },
        { value: "sliptest2", label: "Slip Test 2 (Max 5)", max: 5 },
        { value: "sliptest3", label: "Slip Test 3 (Max 5)", max: 5 },
        { value: "assignment1", label: "Assignment 1 (Max 10)", max: 10 },
        { value: "assignment2", label: "Assignment 2 (Max 10)", max: 10 },
        { value: "classtest1", label: "Class Test 1 (Max 20)", max: 20 },
        { value: "classtest2", label: "Class Test 2 (Max 20)", max: 20 },
        { value: "attendance", label: "Attendance (Max 5)", max: 5 },
      ];
    } else {
      return [
        { value: "weeklycie1", label: "Weekly CIE 1 (Max 30)", max: 30 },
        { value: "weeklycie2", label: "Weekly CIE 2 (Max 30)", max: 30 },
        { value: "weeklycie3", label: "Weekly CIE 3 (Max 30)", max: 30 },
        { value: "internaltest1", label: "Internal Test 1 (Max 20)", max: 20 },
        { value: "internaltest2", label: "Internal Test 2 (Max 20)", max: 20 },
      ];
    }
  };

  const handleBulkMarkChange = (studentId: string, value: string) => {
    setBulkMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSubmitBulkMarks = () => {
    if (!selectedTest) {
      toast({
        title: "Error",
        description: "Please select a test",
        variant: "destructive",
      });
      return;
    }

    const submittedCount = Object.keys(bulkMarks).filter(key => bulkMarks[key]).length;
    
    toast({
      title: "Marks Uploaded Successfully",
      description: `${selectedTest.toUpperCase()} marks uploaded for ${submittedCount} students`,
    });

    setBulkMarks({});
    setSelectedTest("");
  };

  const getClassStudents = () => {
    if (!selectedSubject) return [];
    return mockStudents.filter(s => s.class === selectedSubject.class);
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

        {/* Marks Upload/View Section */}
        {selectedSubject && (
          <Card className="shadow-lg border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Manage Marks - {selectedSubject.name}
              </CardTitle>
              <CardDescription>
                {selectedSubject.courseCode} | {selectedSubject.class} | {selectedSubject.type === "theory" ? "Theory" : "Lab"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Marks
                  </TabsTrigger>
                  <TabsTrigger value="view">
                    <Eye className="w-4 h-4 mr-2" />
                    View Student-Wise
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6 mt-6">
                  {/* Test Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="test">Select Test/Assessment</Label>
                    <Select value={selectedTest} onValueChange={setSelectedTest}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a test to upload marks" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTestOptions().map(test => (
                          <SelectItem key={test.value} value={test.value}>
                            {test.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bulk Upload Table */}
                  {selectedTest && (
                    <div className="space-y-4">
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">
                          {getTestOptions().find(t => t.value === selectedTest)?.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Enter marks for all students below
                        </p>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted px-4 py-3 grid grid-cols-3 gap-4 font-semibold text-sm">
                          <div>Roll Number</div>
                          <div>Student Name</div>
                          <div>Marks</div>
                        </div>
                        <div className="divide-y">
                          {getClassStudents().map((student) => (
                            <div key={student.id} className="px-4 py-3 grid grid-cols-3 gap-4 items-center hover:bg-muted/50">
                              <div className="font-medium text-sm">{student.rollNo}</div>
                              <div className="text-sm">{student.name}</div>
                              <div>
                                <Input
                                  type="number"
                                  step="0.5"
                                  max={getTestOptions().find(t => t.value === selectedTest)?.max}
                                  placeholder="0"
                                  value={bulkMarks[student.id] || ""}
                                  onChange={(e) => handleBulkMarkChange(student.id, e.target.value)}
                                  className="max-w-[100px]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          onClick={handleSubmitBulkMarks} 
                          className="w-full bg-gradient-primary hover:opacity-90" 
                          size="lg"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Submit Marks for All Students
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="view" className="space-y-4 mt-6">
                  <p className="text-sm text-muted-foreground">
                    View detailed marks breakdown for individual students (coming soon)
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;
