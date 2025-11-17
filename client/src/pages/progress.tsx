import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  Star,
  Home,
  Calendar,
} from "lucide-react";
import { Link } from "wouter";
import type { PracticeSession, UserAchievement } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function ProgressPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: allSessions = [], isLoading: sessionsLoading } = useQuery<
    PracticeSession[]
  >({
    queryKey: ["/api/practice-sessions/all"],
    enabled: isAuthenticated,
  });

  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<
    UserAchievement[]
  >({
    queryKey: ["/api/achievements/user"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-muted-foreground">Loading progress report...</p>
        </div>
      </div>
    );
  }

  const totalSessions = allSessions.length;
  const totalQuestionsAttempted = allSessions.reduce(
    (sum, session) => sum + (session.questionsAttempted || 0),
    0
  );
  const totalQuestionsCorrect = allSessions.reduce(
    (sum, session) => sum + (session.questionsCorrect || 0),
    0
  );
  const overallAccuracy =
    totalQuestionsAttempted > 0
      ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100)
      : 0;

  const mathsSessions = allSessions.filter((s) => s.subject === "maths");
  const englishSessions = allSessions.filter((s) => s.subject === "english");

  const subjectData = [
    {
      subject: "Maths",
      sessions: mathsSessions.length,
      accuracy: mathsSessions.length
        ? Math.round(
            (mathsSessions.reduce((sum, s) => sum + (s.questionsCorrect || 0), 0) /
              mathsSessions.reduce((sum, s) => sum + (s.questionsAttempted || 0), 0)) *
              100
          )
        : 0,
    },
    {
      subject: "English",
      sessions: englishSessions.length,
      accuracy: englishSessions.length
        ? Math.round(
            (englishSessions.reduce((sum, s) => sum + (s.questionsCorrect || 0), 0) /
              englishSessions.reduce((sum, s) => sum + (s.questionsAttempted || 0), 0)) *
              100
          )
        : 0,
    },
  ];

  const recentActivity = allSessions
    .slice(0, 7)
    .reverse()
    .map((session, index) => ({
      day: `Day ${index + 1}`,
      points: session.pointsEarned || 0,
      accuracy:
        session.questionsAttempted > 0
          ? Math.round((session.questionsCorrect / session.questionsAttempted) * 100)
          : 0,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Progress Report</h1>
            <p className="text-muted-foreground">Track your learning journey</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" data-testid="button-back-home">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-primary" />
                <div className="text-3xl font-bold">{totalSessions}</div>
              </div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-chart-2" />
                <div className="text-3xl font-bold">{overallAccuracy}%</div>
              </div>
              <p className="text-sm text-muted-foreground">Overall Accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-chart-3 fill-chart-3" />
                <div className="text-3xl font-bold">{user?.totalPoints || 0}</div>
              </div>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-chart-4" />
                <div className="text-3xl font-bold">{achievements.length}</div>
              </div>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : subjectData.some((d) => d.sessions > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="hsl(var(--primary))" name="Sessions" />
                    <Bar dataKey="accuracy" fill="hsl(var(--chart-2))" name="Accuracy %" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>No practice data yet. Start practicing to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : recentActivity.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={recentActivity}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="points"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      name="Points"
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      name="Accuracy %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>No recent activity. Start practicing to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievements Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievement Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievementsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : achievements.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No achievements unlocked yet.</p>
                <p className="text-sm">Keep practicing to earn your first badge!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((achievement: any) => (
                  <Card
                    key={achievement.id}
                    className="border-primary/20 hover-elevate"
                    data-testid={`achievement-card-${achievement.id}`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-5xl mb-3">{achievement.achievement?.icon || "🏆"}</div>
                      <h3 className="font-bold mb-1">
                        {achievement.achievement?.name || "Achievement"}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.achievement?.description || ""}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Practice History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : allSessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No practice sessions yet.</p>
                <p className="text-sm">Start practicing to build your history!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover-elevate"
                    data-testid={`history-session-${session.id}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">
                        {session.subject === "maths" ? "🔢" : "📚"}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold capitalize mb-1">
                          {session.subject} - Year {session.yearLevel}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {session.questionsCorrect}/{session.questionsAttempted} correct
                          </span>
                          <span>
                            {session.questionsAttempted > 0
                              ? Math.round(
                                  (session.questionsCorrect / session.questionsAttempted) * 100
                                )
                              : 0}
                            % accuracy
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-semibold text-primary mb-1">
                        <Star className="w-4 h-4 fill-primary" />
                        {session.pointsEarned || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.completedAt
                          ? new Date(session.completedAt).toLocaleDateString()
                          : "In progress"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
