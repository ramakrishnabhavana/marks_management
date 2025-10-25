import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LogOut, Users, BookOpen, Upload, Eye, Loader2 } from "lucide-react";
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

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [facultyData, setFacultyData] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTest, setSelectedTest] = useState("");
  const [bulkMarks, setBulkMarks] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/faculty/subjects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch faculty data');

      const data = await response.json();
      setFacultyData(data);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      toast({
        title: "Error",
        description: "Failed to load faculty data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForClass = async (classCode) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/faculty/classes/${classCode}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch students');

      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedTest("");
    setBulkMarks({});
    fetchStudentsForClass(subject.classCode);
  };

  const getTestOptions = () => {
    if (!selectedSubject) return [];

    // For now, assuming all subjects are theory subjects
    // This can be enhanced based on subject type from backend
    return [
      { value: "slipTests", label: "Slip Tests (Array)", max: 5 },
      { value: "assignments", label: "Assignments (Array)", max: 10 },
      { value: "mids", label: "Mid Semester Tests (Array)", max: 20 },
      { value: "attendanceMarks", label: "Attendance Marks", max: 5 },
    ];
  };

  const handleBulkMarkChange = (rollNo, value) => {
    setBulkMarks(prev => ({ ...prev, [rollNo]: value }));
  };

  const handleSubmitBulkMarks = async () => {
    if (!selectedTest || !selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a test and subject",
        variant: "destructive",
      });
      return;
    }

    const marksToUpload = Object.entries(bulkMarks)
      .filter(([_, value]) => value !== "" && value !== undefined)
      .map(([rollNo, value]) => ({
        rollNo,
        value: Array.isArray(value) ? value : [parseFloat(value)]
      }));

    if (marksToUpload.length === 0) {
      toast({
        title: "Error",
        description: "Please enter marks for at least one student",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/faculty/classes/${selectedSubject.classCode}/marks/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          markType: selectedTest,
          marks: marksToUpload
        })
      });

      if (!response.ok) throw new Error('Failed to upload marks');

      toast({
        title: "Success",
        description: `Marks uploaded for ${marksToUpload.length} students`,
      });

      setBulkMarks({});
      setSelectedTest("");
      // Refresh students data to show updated marks
      fetchStudentsForClass(selectedSubject.classCode);
    } catch (error) {
      console.error('Error uploading marks:', error);
      toast({
        title: "Error",
        description: "Failed to upload marks",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading faculty data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-accent text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Faculty Portal</h1>
                <p className="text-white/90">Welcome back!</p>
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
        {/* Subjects Overview */}
        <Card className="shadow-lg mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BookOpen className="w-6 h-6" />
              My Subjects
            </CardTitle>
            <CardDescription className="text-base">Select a subject to upload marks</CardDescription>
          </CardHeader>
          <CardContent>
            {facultyData?.subjects?.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {facultyData.subjects.map((subject) => (
                  <Card
                    key={subject.classCode}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                      selectedSubject?.classCode === subject.classCode ? "border-2 border-primary shadow-md" : "border-2 border-transparent"
                    }`}
                    onClick={() => handleSubjectSelect(subject)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{subject.subjectCode}</CardTitle>
                          <CardDescription className="text-sm leading-relaxed">{subject.subjectName}</CardDescription>
                        </div>
                        <Badge variant="default" className="ml-2">
                          Theory
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Class:</span>
                        <span className="font-medium">{subject.classCode}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits:</span>
                        <span className="font-medium">{subject.credits}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-semibold text-primary">{subject.studentCount}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No subjects assigned</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Marks Upload/View Section */}
        {selectedSubject && (
          <Card className="shadow-lg border-primary">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Upload className="w-6 h-6" />
                Manage Marks - {selectedSubject.subjectName}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {selectedSubject.subjectCode} | {selectedSubject.classCode} | Theory Subject (CIE: 40)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="upload" className="text-base">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Marks
                  </TabsTrigger>
                  <TabsTrigger value="view" className="text-base">
                    <Eye className="w-4 h-4 mr-2" />
                    View Student-Wise
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6 mt-8">
                  {/* Test Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="test" className="text-base font-semibold">Select Test/Assessment</Label>
                    <Select value={selectedTest} onValueChange={setSelectedTest}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Choose a test to upload marks" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTestOptions().map(test => (
                          <SelectItem key={test.value} value={test.value} className="text-base">
                            {test.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bulk Upload Table */}
                  {selectedTest && (
                    <div className="space-y-6">
                      <div className="bg-primary/10 p-5 rounded-lg border border-primary/20">
                        <h3 className="font-semibold text-lg mb-2">
                          {getTestOptions().find(t => t.value === selectedTest)?.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Enter marks for all students below. Maximum marks: {getTestOptions().find(t => t.value === selectedTest)?.max}
                        </p>
                      </div>

                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-muted px-6 py-4 grid grid-cols-3 gap-6 font-semibold">
                          <div>Roll Number</div>
                          <div>Student Name</div>
                          <div>Marks</div>
                        </div>
                        <div className="divide-y">
                          {students.map((student) => (
                            <div key={student.rollNo} className="px-6 py-4 grid grid-cols-3 gap-6 items-center hover:bg-muted/50 transition-colors">
                              <div className="font-medium">{student.rollNo}</div>
                              <div>{student.name}</div>
                              <div>
                                <Input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max={getTestOptions().find(t => t.value === selectedTest)?.max}
                                  placeholder="0"
                                  value={bulkMarks[student.rollNo] || ""}
                                  onChange={(e) => handleBulkMarkChange(student.rollNo, e.target.value)}
                                  className="max-w-[120px] h-11"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button
                          onClick={handleSubmitBulkMarks}
                          disabled={uploading}
                          className="w-full bg-gradient-primary hover:opacity-90 h-12 text-base"
                          size="lg"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 mr-2" />
                              Submit Marks for All Students
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="view" className="space-y-4 mt-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Student Marks Overview</h3>
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-muted px-6 py-4 grid grid-cols-6 gap-4 font-semibold text-sm">
                        <div>Roll No</div>
                        <div>Name</div>
                        <div>Slip Test Avg</div>
                        <div>Assignment Avg</div>
                        <div>Mid Avg</div>
                        <div>Total</div>
                      </div>
                      <div className="divide-y">
                        {students.map((student) => (
                          <div key={student.rollNo} className="px-6 py-4 grid grid-cols-6 gap-4 items-center hover:bg-muted/50 transition-colors text-sm">
                            <div className="font-medium">{student.rollNo}</div>
                            <div>{student.name}</div>
                            <div>{student.marks?.slipTestAverage || 0}</div>
                            <div>{student.marks?.assignmentAverage || 0}</div>
                            <div>{student.marks?.midAverage || 0}</div>
                            <div className="font-semibold text-primary">{student.marks?.totalMarks || 0}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
