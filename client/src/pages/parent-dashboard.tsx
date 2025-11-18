import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { UserPlus, Trophy, TrendingUp, Target, BookOpen, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

type StudentStats = {
  student: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    yearLevel: number | null;
    totalPoints: number | null;
    currentStreak: number | null;
    longestStreak: number | null;
  };
  maths: {
    totalSessions: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    difficulty: string | null;
  };
  english: {
    totalSessions: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    difficulty: string | null;
  };
  recentSessions: any[];
};

type StudentLink = {
  id: string;
  supervisorId: string;
  studentId: string;
  relationship: string;
  approved: boolean;
  createdAt: Date;
  student: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    yearLevel: number | null;
  };
};

export default function ParentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Fetch student links
  const { data: studentLinks = [], isLoading: linksLoading } = useQuery<StudentLink[]>({
    queryKey: ["/api/student-links"],
  });

  // Fetch stats for selected student
  const { data: studentStats, isLoading: statsLoading } = useQuery<StudentStats>({
    queryKey: ["/api/students", selectedStudent, "stats"],
    enabled: !!selectedStudent,
  });

  // Add student link mutation
  const addStudentMutation = useMutation({
    mutationFn: async (studentEmail: string) => {
      // First find the student by email
      const response = await fetch(`/api/students/find?email=${encodeURIComponent(studentEmail)}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Student not found");
      }
      
      const foundStudent = await response.json();
      
      // Then create the link with the student ID
      return apiRequest("/api/student-links", "POST", {
        studentId: foundStudent.id,
        relationship: user?.role === "teacher" ? "teacher" : "parent",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student-links"] });
      toast({
        title: "Student added",
        description: "Student link created successfully",
      });
      setNewStudentEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      });
    },
  });

  // Auto-select first student if none selected
  useEffect(() => {
    if (!selectedStudent && studentLinks.length > 0 && !linksLoading) {
      setSelectedStudent(studentLinks[0].student.id);
    }
  }, [selectedStudent, studentLinks, linksLoading]);

  if (linksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {user?.role === "teacher" ? "Teacher Dashboard" : "Parent Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          Monitor and track your {user?.role === "teacher" ? "students'" : "children's"} learning progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Student List Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Students</CardTitle>
              <CardDescription>
                {studentLinks.length} student{studentLinks.length !== 1 ? "s" : ""} linked
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {studentLinks.map((link) => (
                <Button
                  key={link.id}
                  variant={selectedStudent === link.student.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedStudent(link.student.id)}
                  data-testid={`button-select-student-${link.student.id}`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {link.student.firstName} {link.student.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Year {link.student.yearLevel}
                    </span>
                  </div>
                </Button>
              ))}

              {studentLinks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No students linked yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Add Student Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Student</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Student email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  data-testid="input-student-email"
                />
                <Button
                  size="icon"
                  onClick={() => addStudentMutation.mutate(newStudentEmail)}
                  disabled={!newStudentEmail || addStudentMutation.isPending}
                  data-testid="button-add-student"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter the student's email address
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Student Stats Content */}
        <div>
          {selectedStudent && studentStats ? (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-total-points">
                      {studentStats.student.totalPoints || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Earned from practice</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-current-streak">
                      {studentStats.student.currentStreak || 0} days
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Longest: {studentStats.student.longestStreak || 0} days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Year Level</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-year-level">
                      Year {studentStats.student.yearLevel}
                    </div>
                    <p className="text-xs text-muted-foreground">NZ Curriculum</p>
                  </CardContent>
                </Card>
              </div>

              {/* Subject Performance */}
              <Tabs defaultValue="maths" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="maths" data-testid="tab-maths">
                    <Calculator className="h-4 w-4 mr-2" />
                    Mathematics
                  </TabsTrigger>
                  <TabsTrigger value="english" data-testid="tab-english">
                    <BookOpen className="h-4 w-4 mr-2" />
                    English
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="maths" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Mathematics Progress</CardTitle>
                        <Badge variant="secondary">
                          {studentStats.maths.difficulty || "medium"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Accuracy</span>
                          <span className="text-sm font-bold">{studentStats.maths.accuracy}%</span>
                        </div>
                        <Progress value={studentStats.maths.accuracy} />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Sessions</p>
                          <p className="text-2xl font-bold">{studentStats.maths.totalSessions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Questions</p>
                          <p className="text-2xl font-bold">{studentStats.maths.totalQuestions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Correct</p>
                          <p className="text-2xl font-bold">{studentStats.maths.correctAnswers}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="english" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>English Progress</CardTitle>
                        <Badge variant="secondary">
                          {studentStats.english.difficulty || "medium"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Accuracy</span>
                          <span className="text-sm font-bold">{studentStats.english.accuracy}%</span>
                        </div>
                        <Progress value={studentStats.english.accuracy} />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Sessions</p>
                          <p className="text-2xl font-bold">{studentStats.english.totalSessions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Questions</p>
                          <p className="text-2xl font-bold">{studentStats.english.totalQuestions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Correct</p>
                          <p className="text-2xl font-bold">{studentStats.english.correctAnswers}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : statsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
                <p className="text-muted-foreground">Loading stats...</p>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground mb-4">
                  Select a student to view their progress
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
