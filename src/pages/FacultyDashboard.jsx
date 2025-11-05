import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LogOut, Users, BookOpen, Upload, Eye, Loader2, FileSpreadsheet } from "lucide-react";
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
import { apiService } from "@/services/api";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [facultyData, setFacultyData] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTest, setSelectedTest] = useState("");
  const [bulkMarks, setBulkMarks] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelUploading, setExcelUploading] = useState(false);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const data = await apiService.getFacultySubjects();
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
      const data = await apiService.getClassStudents(classCode);
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
    localStorage.removeItem("userData");
    navigate("/");
  };

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setSelectedTest("");
    setBulkMarks({});
    setExcelFile(null);
    fetchStudentsForClass(classItem.classCode);
  };

  // Populate bulkMarks with existing marks when test is selected
  const populateBulkMarksForTest = (testType) => {
    const newBulkMarks = {};
    students.forEach(student => {
      const existingMark = student.marks?.[testType];
      if (existingMark !== null && existingMark !== undefined) {
        newBulkMarks[student.rollNo] = existingMark.toString();
      }
    });
    setBulkMarks(newBulkMarks);
  };

  const getTestOptions = () => {
    if (!selectedClass) return [];

    // Options for theory subjects
    return [
      { value: "sliptest1", label: "Slip Test 1", max: 5 },
      { value: "sliptest2", label: "Slip Test 2", max: 5 },
      { value: "sliptest3", label: "Slip Test 3", max: 5 },
      { value: "assignment1", label: "Assignment 1", max: 10 },
      { value: "assignment2", label: "Assignment 2", max: 10 },
      { value: "classtest1", label: "Class Test 1", max: 20 },
      { value: "classtest2", label: "Class Test 2", max: 20 },
      { value: "attendance", label: "Attendance", max: 5 },
    ];
  };

  const handleBulkMarkChange = (rollNo, value) => {
    setBulkMarks(prev => ({
      ...prev,
      [rollNo]: value
    }));
  };

  const handleSubmitBulkMarks = async () => {
    if (!selectedTest || !selectedClass) {
      toast({
        title: "Error",
        description: "Please select a test type and class",
        variant: "destructive",
      });
      return;
    }

    const marksToUpload = Object.entries(bulkMarks)
      .filter(([_, value]) => value !== "" && value !== undefined && !isNaN(value))
      .map(([rollNo, value]) => ({
        rollNo,
        marks: parseFloat(value)
      }));

    if (marksToUpload.length === 0) {
      toast({
        title: "Error",
        description: "Please enter valid marks for at least one student",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      await apiService.uploadBulkMarks(
        selectedClass.classCode,
        selectedTest,
        marksToUpload
      );

      toast({
        title: "Success",
        description: `Marks uploaded for ${marksToUpload.length} students`,
      });

      setBulkMarks({});
      setSelectedTest("");
      // Refresh students data to show updated marks
      fetchStudentsForClass(selectedClass.classCode);
    } catch (error) {
      console.error('Error uploading marks:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload marks",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleExcelFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please select a valid Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setExcelFile(file);
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile || !selectedTest || !selectedClass) {
      toast({
        title: "Error",
        description: "Please select a test type, class, and Excel file",
        variant: "destructive",
      });
      return;
    }

    setExcelUploading(true);
    try {
      const result = await apiService.uploadExcelMarks(
        selectedClass.classCode,
        selectedTest,
        excelFile
      );

      toast({
        title: "Success",
        description: `Excel marks uploaded successfully. Processed ${result.processed} students.`,
      });

      if (result.errors && result.errors.length > 0) {
        toast({
          title: "Warning",
          description: `Some entries had errors: ${result.errors.join(', ')}`,
          variant: "destructive",
        });
      }

      setExcelFile(null);
      setSelectedTest("");
      // Refresh students data to show updated marks
      fetchStudentsForClass(selectedClass.classCode);
    } catch (error) {
      console.error('Error uploading Excel marks:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload Excel marks",
        variant: "destructive",
      });
    } finally {
      setExcelUploading(false);
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
                      selectedClass?.classCode === subject.classCode ? "border-2 border-primary shadow-md" : "border-2 border-transparent"
                    }`}
                    onClick={() => handleClassSelect(subject)}
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
        {selectedClass && (
          <Card className="shadow-lg border-primary">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Upload className="w-6 h-6" />
                Manage Marks - {selectedClass.subjectName}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {selectedClass.subjectCode} | {selectedClass.classCode} | Theory Subject (CIE: 40)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12">
                  <TabsTrigger value="upload" className="text-base">
                    <Upload className="w-4 h-4 mr-2" />
                    Manual Upload
                  </TabsTrigger>
                  <TabsTrigger value="excel" className="text-base">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Excel Upload
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
                    <Select value={selectedTest} onValueChange={(value) => {
                      setSelectedTest(value);
                      populateBulkMarksForTest(value);
                    }}>
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

                <TabsContent value="excel" className="space-y-6 mt-8">
                  {/* Excel Upload Section */}
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-lg mb-2 text-blue-900">Excel File Upload</h3>
                      <p className="text-sm text-blue-700 mb-4">
                        Upload student marks from an Excel file. The file should have columns named "Roll No" and "Marks".
                      </p>
                      <div className="text-xs text-blue-600">
                        <p>• Supported formats: .xlsx, .xls</p>
                        <p>• Maximum file size: 5MB</p>
                        <p>• First sheet will be processed</p>
                      </div>
                    </div>

                    {/* Test Selection for Excel */}
                    <div className="space-y-3">
                      <Label htmlFor="excel-test" className="text-base font-semibold">Select Test/Assessment for Excel Upload</Label>
                      <Select value={selectedTest} onValueChange={setSelectedTest}>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Choose a test type for Excel upload" />
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

                    {/* File Upload */}
                    <div className="space-y-3">
                      <Label htmlFor="excel-file" className="text-base font-semibold">Select Excel File</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="excel-file"
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleExcelFileChange}
                          className="flex-1"
                        />
                        {excelFile && (
                          <div className="text-sm text-muted-foreground">
                            {excelFile.name} ({(excelFile.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div className="pt-2">
                      <Button
                        onClick={handleExcelUpload}
                        disabled={excelUploading || !excelFile || !selectedTest}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 h-12 text-base"
                        size="lg"
                      >
                        {excelUploading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Uploading Excel...
                          </>
                        ) : (
                          <>
                            <FileSpreadsheet className="w-5 h-5 mr-2" />
                            Upload Excel Marks
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="view" className="space-y-4 mt-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Student Marks Overview</h3>
                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-muted px-6 py-4 grid grid-cols-[120px_1fr_repeat(9,60px)] gap-2 font-semibold text-sm">
                        <div>Roll No</div>
                        <div>Name</div>
                        <div className="text-center">ST1</div>
                        <div className="text-center">ST2</div>
                        <div className="text-center">ST3</div>
                        <div className="text-center">A1</div>
                        <div className="text-center">A2</div>
                        <div className="text-center">CT1</div>
                        <div className="text-center">CT2</div>
                        <div className="text-center">Atd</div>
                        <div className="text-center">CIE</div>
                      </div>
                      <div className="divide-y">
                        {students.map((student) => (
                          <div key={student.rollNo} className="px-6 py-4 grid grid-cols-[120px_1fr_repeat(9,60px)] gap-2 items-center hover:bg-muted/50 transition-colors text-sm">
                            <div className="font-medium">{student.rollNo}</div>
                            <div>{student.name}</div>
                            <div className="text-center">{student.marks?.slipTest1 || 0}</div>
                            <div className="text-center">{student.marks?.slipTest2 || 0}</div>
                            <div className="text-center">{student.marks?.slipTest3 || 0}</div>
                            <div className="text-center">{student.marks?.assignment1 || 0}</div>
                            <div className="text-center">{student.marks?.assignment2 || 0}</div>
                            <div className="text-center">{student.marks?.classTest1 || 0}</div>
                            <div className="text-center">{student.marks?.classTest2 || 0}</div>
                            <div className="text-center">{student.marks?.attendance || 0}</div>
                            <div className="text-center font-semibold text-primary">{student.marks?.totalMarks || 0}</div>
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
