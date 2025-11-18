import { useEffect, useState } from "react";
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
  Zap,
  Target,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
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

  // Calculate real progress based on sessions
  const mathsSessions = recentSessions.filter(s => s.subject === "maths" && s.completedAt);
  const englishSessions = recentSessions.filter(s => s.subject === "english" && s.completedAt);
  
  const mathsAccuracy = mathsSessions.length > 0
    ? Math.round((mathsSessions.reduce((sum, s) => sum + (s.questionsCorrect || 0), 0) / 
        mathsSessions.reduce((sum, s) => sum + (s.questionsAttempted || 0), 1)) * 100)
    : 0;
    
  const englishAccuracy = englishSessions.length > 0
    ? Math.round((englishSessions.reduce((sum, s) => sum + (s.questionsCorrect || 0), 0) / 
        englishSessions.reduce((sum, s) => sum + (s.questionsAttempted || 0), 1)) * 100)
    : 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-accent/5 to-background">
      <motion.div 
        className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section with Animated Stats */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-chart-2/10 rounded-3xl p-6 sm:p-8 border-2 border-primary/20 shadow-lg"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-welcome-message">
                Hey {user?.firstName || "Superstar"}!
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-medium" data-testid="text-welcome-subtitle">
                Ready for an amazing learning adventure today?
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <motion.div 
                className="text-center p-4 rounded-2xl bg-primary/10 border border-primary/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="card-total-points"
              >
                <div className="flex items-center gap-2 text-2xl sm:text-4xl font-bold text-primary" data-testid="text-total-points">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-primary animate-pulse" />
                  {user?.totalPoints || 0}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-semibold">Total Points</div>
              </motion.div>
              <motion.div 
                className="text-center p-4 rounded-2xl bg-chart-3/10 border border-chart-3/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="card-day-streak"
              >
                <div className="flex items-center gap-2 text-2xl sm:text-4xl font-bold text-chart-3" data-testid="text-day-streak">
                  <Flame className="w-6 h-6 sm:w-8 sm:h-8 fill-chart-3 animate-bounce" />
                  {user?.currentStreak || 0}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-semibold">Day Streak</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Daily Challenge Banner */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-chart-3/30 bg-gradient-to-r from-chart-3/5 to-chart-2/5 hover-elevate overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-3 to-chart-2 flex items-center justify-center text-3xl shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      Daily Challenge
                      <Sparkles className="w-5 h-5 text-chart-3 animate-pulse" />
                    </h3>
                    <p className="text-muted-foreground">Complete today's special quiz and earn bonus points!</p>
                  </div>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-chart-3 to-chart-2 hover:from-chart-3/90 hover:to-chart-2/90" data-testid="button-daily-challenge">
                  <Target className="w-5 h-5 mr-2" />
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-primary/20 hover-elevate active-elevate-2 overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Brain className="w-10 h-10 text-white" data-testid="icon-maths" />
                  </motion.div>
                  <div>
                    <div>Maths Practice</div>
                    {user?.mathsDifficulty && (
                      <Badge variant="secondary" className="mt-1 text-xs" data-testid="badge-maths-difficulty">
                        {user.mathsDifficulty.charAt(0).toUpperCase() + user.mathsDifficulty.slice(1)} Level
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-primary/5" data-testid="stat-maths-sessions">
                    <div className="text-2xl font-bold text-primary">{mathsSessions.length}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-chart-2/10" data-testid="stat-maths-accuracy">
                    <div className="text-2xl font-bold text-chart-2">{mathsAccuracy}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-chart-3/10" data-testid="stat-maths-points">
                    <div className="text-2xl font-bold text-chart-3">
                      {mathsSessions.reduce((sum, s) => sum + (s.pointsEarned || 0), 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Points</div>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Addition</Badge>
                  <Badge variant="secondary" className="text-xs">Multiplication</Badge>
                  <Badge variant="secondary" className="text-xs">Fractions</Badge>
                  <Badge variant="secondary" className="text-xs">Word Problems</Badge>
                </div>

                <Link href="/practice/maths">
                  <Button className="w-full" size="lg" data-testid="button-practice-maths">
                    <Brain className="w-5 h-5 mr-2" />
                    Start Maths Practice
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-2 border-accent/20 hover-elevate active-elevate-2 overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-br from-accent/10 to-transparent pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <BookOpen className="w-10 h-10 text-white" data-testid="icon-english" />
                  </motion.div>
                  <div>
                    <div>English Practice</div>
                    {user?.englishDifficulty && (
                      <Badge variant="secondary" className="mt-1 text-xs" data-testid="badge-english-difficulty">
                        {user.englishDifficulty.charAt(0).toUpperCase() + user.englishDifficulty.slice(1)} Level
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-accent/5" data-testid="stat-english-sessions">
                    <div className="text-2xl font-bold text-accent">{englishSessions.length}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-chart-2/10" data-testid="stat-english-accuracy">
                    <div className="text-2xl font-bold text-chart-2">{englishAccuracy}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-chart-3/10" data-testid="stat-english-points">
                    <div className="text-2xl font-bold text-chart-3">
                      {englishSessions.reduce((sum, s) => sum + (s.pointsEarned || 0), 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Points</div>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Reading</Badge>
                  <Badge variant="secondary" className="text-xs">Vocabulary</Badge>
                  <Badge variant="secondary" className="text-xs">Grammar</Badge>
                  <Badge variant="secondary" className="text-xs">Spelling</Badge>
                </div>

                <Link href="/practice/english">
                  <Button className="w-full" size="lg" data-testid="button-practice-english">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Start English Practice
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats and Achievements Row */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
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
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          {session.subject === "maths" ? (
                            <Brain className="w-6 h-6 text-primary" />
                          ) : (
                            <BookOpen className="w-6 h-6 text-accent" />
                          )}
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
                  <Trophy className="w-10 h-10 mx-auto mb-2 opacity-50" data-testid="icon-achievements" />
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
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-chart-3/20 to-chart-3/10 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-chart-3" data-testid="icon-achievements" />
                      </div>
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
                  <Button variant="outline" className="w-full mt-4" size="sm" data-testid="button-view-all-achievements">
                    View All Achievements
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
