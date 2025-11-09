import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Users, BookOpen, GraduationCap, Plus, LogOut, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

const AdminDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("departments");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form states
  const [newDepartment, setNewDepartment] = useState({ name: "", code: "" });
  const [newSubject, setNewSubject] = useState({
    code: "",
    name: "",
    abbreviation: "",
    credits: "",
    type: "theory",
    semester: ""
  });
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "Assistant Professor"
  });
  const [newClass, setNewClass] = useState({
    section: "",
    year: "",
    semester: ""
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await apiService.getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Load departments error:', error);
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await apiService.createDepartment(newDepartment);
      toast({
        title: "Success",
        description: "Department created successfully",
      });
      setNewDepartment({ name: "", code: "" });
      loadDepartments();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive",
      });
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!selectedDepartment) return;

    try {
      await apiService.addSubjectToDepartment(selectedDepartment._id, newSubject);
      toast({
        title: "Success",
        description: "Subject added successfully",
      });
      setNewSubject({
        code: "",
        name: "",
        abbreviation: "",
        credits: "",
        type: "theory",
        semester: ""
      });
      loadDepartments();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add subject",
        variant: "destructive",
      });
    }
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    if (!selectedDepartment) return;

    try {
      await apiService.addFacultyToDepartment(selectedDepartment._id, newFaculty);
      toast({
        title: "Success",
        description: "Faculty added successfully",
      });
      setNewFaculty({
        name: "",
        email: "",
        mobile: "",
        designation: "Assistant Professor"
      });
      loadDepartments();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add faculty",
        variant: "destructive",
      });
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!selectedDepartment) return;

    try {
      await apiService.addClassToDepartment(selectedDepartment._id, newClass);
      toast({
        title: "Success",
        description: "Class added successfully",
      });
      setNewClass({
        section: "",
        year: "",
        semester: ""
      });
      loadDepartments();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add class",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage departments, subjects, faculty, and classes</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Departments</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                    <DialogDescription>
                      Add a new department to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateDepartment} className="space-y-4">
                    <div>
                      <Label htmlFor="dept-name">Department Name</Label>
                      <Input
                        id="dept-name"
                        value={newDepartment.name}
                        onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                        placeholder="e.g., Computer Science"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dept-code">Department Code</Label>
                      <Input
                        id="dept-code"
                        value={newDepartment.code}
                        onChange={(e) => setNewDepartment({...newDepartment, code: e.target.value})}
                        placeholder="e.g., CSE"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Create Department</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <Card
                  key={dept._id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedDepartment?._id === dept._id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5" />
                      <span>{dept.name}</span>
                    </CardTitle>
                    <CardDescription>{dept.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subjects:</span>
                        <Badge variant="secondary">{dept.subjects?.length || 0}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Faculty:</span>
                        <Badge variant="secondary">{dept.faculty?.length || 0}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Classes:</span>
                        <Badge variant="secondary">{dept.classes?.length || 0}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            {selectedDepartment ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Subjects in {selectedDepartment.name}</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Subject
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Subject to {selectedDepartment.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddSubject} className="space-y-4">
                        <div>
                          <Label htmlFor="subject-code">Subject Code</Label>
                          <Input
                            id="subject-code"
                            value={newSubject.code}
                            onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                            placeholder="e.g., 22CSC21"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject-name">Subject Name</Label>
                          <Input
                            id="subject-name"
                            value={newSubject.name}
                            onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                            placeholder="e.g., Software Engineering"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject-credits">Credits</Label>
                          <Input
                            id="subject-credits"
                            type="number"
                            value={newSubject.credits}
                            onChange={(e) => setNewSubject({...newSubject, credits: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject-type">Type</Label>
                          <Select value={newSubject.type} onValueChange={(value) => setNewSubject({...newSubject, type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="theory">Theory</SelectItem>
                              <SelectItem value="lab">Lab</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="subject-semester">Semester</Label>
                          <Input
                            id="subject-semester"
                            type="number"
                            value={newSubject.semester}
                            onChange={(e) => setNewSubject({...newSubject, semester: e.target.value})}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">Add Subject</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Semester</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDepartment.subjects?.map((subject) => (
                      <TableRow key={subject._id}>
                        <TableCell className="font-medium">{subject.code}</TableCell>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.credits}</TableCell>
                        <TableCell>
                          <Badge variant={subject.type === 'theory' ? 'default' : 'secondary'}>
                            {subject.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{subject.semester}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Department</h3>
                <p className="text-gray-600">Choose a department from the Departments tab to manage subjects.</p>
              </div>
            )}
          </TabsContent>

          {/* Faculty Tab */}
          <TabsContent value="faculty" className="space-y-6">
            {selectedDepartment ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Faculty in {selectedDepartment.name}</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Faculty
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Faculty to {selectedDepartment.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddFaculty} className="space-y-4">
                        <div>
                          <Label htmlFor="faculty-name">Full Name</Label>
                          <Input
                            id="faculty-name"
                            value={newFaculty.name}
                            onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                            placeholder="e.g., Dr. John Doe"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="faculty-email">Email</Label>
                          <Input
                            id="faculty-email"
                            type="email"
                            value={newFaculty.email}
                            onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                            placeholder="e.g., john.doe@college.edu"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="faculty-mobile">Mobile</Label>
                          <Input
                            id="faculty-mobile"
                            value={newFaculty.mobile}
                            onChange={(e) => setNewFaculty({...newFaculty, mobile: e.target.value})}
                            placeholder="e.g., +91 9876543210"
                          />
                        </div>
                        <div>
                          <Label htmlFor="faculty-designation">Designation</Label>
                          <Select value={newFaculty.designation} onValueChange={(value) => setNewFaculty({...newFaculty, designation: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Professor">Professor</SelectItem>
                              <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                              <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                              <SelectItem value="Lecturer">Lecturer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Add Faculty</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Mobile</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDepartment.faculty?.map((faculty) => (
                      <TableRow key={faculty._id}>
                        <TableCell className="font-medium">{faculty.name}</TableCell>
                        <TableCell>{faculty.email}</TableCell>
                        <TableCell>{faculty.designation}</TableCell>
                        <TableCell>{faculty.mobile || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Department</h3>
                <p className="text-gray-600">Choose a department from the Departments tab to manage faculty.</p>
              </div>
            )}
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            {selectedDepartment ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Classes in {selectedDepartment.name}</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Class
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Class to {selectedDepartment.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddClass} className="space-y-4">
                        <div>
                          <Label htmlFor="class-section">Section</Label>
                          <Input
                            id="class-section"
                            value={newClass.section}
                            onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                            placeholder="e.g., CSE-A"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="class-year">Year</Label>
                          <Input
                            id="class-year"
                            type="number"
                            value={newClass.year}
                            onChange={(e) => setNewClass({...newClass, year: e.target.value})}
                            placeholder="e.g., 3"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="class-semester">Semester</Label>
                          <Input
                            id="class-semester"
                            type="number"
                            value={newClass.semester}
                            onChange={(e) => setNewClass({...newClass, semester: e.target.value})}
                            placeholder="e.g., 6"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">Add Class</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedDepartment.classes?.map((classItem, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <GraduationCap className="w-5 h-5" />
                          <span>{classItem.section}</span>
                        </CardTitle>
                        <CardDescription>
                          Year {classItem.year}, Semester {classItem.semester}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm">
                          <span>Students:</span>
                          <Badge variant="secondary">{classItem.students?.length || 0}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Department</h3>
                <p className="text-gray-600">Choose a department from the Departments tab to manage classes.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
