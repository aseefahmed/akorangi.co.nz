import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Brain,
  Trophy,
  Flame,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";
import { Link } from "wouter";
import type { PracticeSession, UserAchievement } from "@shared/schema";

export default function Dashboard() {
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

  const { data: recentSessions = [], isLoading: sessionsLoading } = useQuery<
    PracticeSession[]
  >({
    queryKey: ["/api/practice-sessions/recent"],
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
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const mathsProgress = 65;
  const englishProgress = 72;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent rounded-2xl p-8 border border-primary/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Welcome back, {user?.firstName || "Learner"}! 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                Ready to continue your learning adventure?
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-3xl font-bold text-primary">
                  <Star className="w-8 h-8 fill-primary" />
                  {user?.totalPoints || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-3xl font-bold text-chart-3">
                  <Flame className="w-8 h-8 fill-chart-3" />
                  {user?.currentStreak || 0}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/20 hover-elevate active-elevate-2 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  🔢
                </div>
                Maths Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{mathsProgress}%</span>
                </div>
                <Progress value={mathsProgress} className="h-2" />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">Addition</Badge>
                <Badge variant="secondary" className="text-xs">Multiplication</Badge>
                <Badge variant="secondary" className="text-xs">Fractions</Badge>
              </div>

              <Link href="/practice/maths">
                <Button className="w-full" size="lg" data-testid="button-practice-maths">
                  <Brain className="w-5 h-5 mr-2" />
                  Start Maths Practice
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover-elevate active-elevate-2 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-accent/10 to-transparent pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  📚
                </div>
                English Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{englishProgress}%</span>
                </div>
                <Progress value={englishProgress} className="h-2" />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">Reading</Badge>
                <Badge variant="secondary" className="text-xs">Vocabulary</Badge>
                <Badge variant="secondary" className="text-xs">Grammar</Badge>
              </div>

              <Link href="/practice/english">
                <Button className="w-full" size="lg" data-testid="button-practice-english">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start English Practice
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Achievements Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No practice sessions yet.</p>
                  <p className="text-sm">Start practicing to see your progress here!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover-elevate"
                      data-testid={`session-${session.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">
                          {session.subject === "maths" ? "🔢" : "📚"}
                        </div>
                        <div>
                          <div className="font-semibold capitalize">
                            {session.subject} - Year {session.yearLevel}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.questionsCorrect}/{session.questionsAttempted} correct
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-primary font-semibold">
                          <Star className="w-4 h-4 fill-primary" />
                          +{session.pointsEarned}
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

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievementsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : achievements.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Trophy className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No achievements yet.</p>
                  <p className="text-xs">Keep practicing to unlock badges!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement: any) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover-elevate"
                      data-testid={`achievement-${achievement.id}`}
                    >
                      <div className="text-2xl">{achievement.achievement?.icon || "🏆"}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {achievement.achievement?.name || "Achievement"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {achievements.length > 3 && (
                <Link href="/progress">
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    View All Achievements
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
