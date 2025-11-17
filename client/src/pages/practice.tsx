import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  CheckCircle2,
  XCircle,
  Sparkles,
  Star,
  ArrowRight,
  Home,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";

type Question = {
  id: string;
  question: string;
  correctAnswer: string;
  topic?: string;
  difficulty?: string;
};

type AnswerResult = {
  isCorrect: boolean;
  feedback: string;
};

export default function Practice() {
  const { subject } = useParams();
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [yearLevel, setYearLevel] = useState<number>(user?.yearLevel || 3);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/practice-sessions", {
        subject,
        yearLevel,
      });
      return response;
    },
    onSuccess: (data: any) => {
      setSessionId(data.id);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to start practice session",
        variant: "destructive",
      });
    },
  });

  const generateQuestionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/questions/generate", {
        subject,
        yearLevel,
      });
      return response;
    },
    onSuccess: (data: Question) => {
      setCurrentQuestion(data);
      setUserAnswer("");
      setAnswerResult(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to generate question",
        variant: "destructive",
      });
    },
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async () => {
      if (!currentQuestion || !sessionId) return;
      const response = await apiRequest("POST", "/api/questions/validate", {
        sessionId,
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        correctAnswer: currentQuestion.correctAnswer,
        userAnswer,
        subject,
      });
      return response;
    },
    onSuccess: (data: AnswerResult) => {
      setAnswerResult(data);
      setQuestionsAnswered((prev) => prev + 1);
      
      if (data.isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
        const points = 10;
        setSessionPoints((prev) => prev + points);
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to validate answer",
        variant: "destructive",
      });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) return;
      await apiRequest("POST", `/api/practice-sessions/${sessionId}/complete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/practice-sessions/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
      });
      
      toast({
        title: "Session Complete!",
        description: `You earned ${sessionPoints} points! Great job! 🎉`,
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to complete session",
        variant: "destructive",
      });
    },
  });

  const handleStartSession = () => {
    createSessionMutation.mutate();
    generateQuestionMutation.mutate();
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Oops!",
        description: "Please enter an answer first",
        variant: "destructive",
      });
      return;
    }
    submitAnswerMutation.mutate();
  };

  const handleNextQuestion = () => {
    if (questionsAnswered >= 5) {
      completeSessionMutation.mutate();
      setTimeout(() => navigate("/dashboard"), 2000);
    } else {
      generateQuestionMutation.mutate();
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-muted-foreground">Loading practice session...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/20">
            <CardHeader className="text-center pb-6">
              <div className="text-6xl mb-4">{subject === "maths" ? "🔢" : "📚"}</div>
              <CardTitle className="text-3xl capitalize mb-2">
                {subject} Practice
              </CardTitle>
              <p className="text-muted-foreground">
                Get ready for some fun {subject} questions!
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="year-level" className="text-base mb-2 block">
                  Select Your Year Level
                </Label>
                <Select
                  value={yearLevel.toString()}
                  onValueChange={(value) => setYearLevel(parseInt(value))}
                >
                  <SelectTrigger id="year-level" data-testid="select-year-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        Year {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">5 Practice Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-chart-3" />
                  <span className="font-medium">Earn up to 50 Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="font-medium">AI-Generated Questions</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleStartSession}
                disabled={createSessionMutation.isPending}
                data-testid="button-start-practice"
              >
                {createSessionMutation.isPending ? (
                  <>
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Start Practice Session
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/dashboard")}
                data-testid="button-back-dashboard"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progressPercentage = (questionsAnswered / 5) * 100;
  const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Header */}
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {questionsAnswered}/5
                  </div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-2">
                    {Math.round(accuracy)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-2xl font-bold text-chart-3">
                    <Star className="w-5 h-5 fill-chart-3" />
                    {sessionPoints}
                  </div>
                  <div className="text-xs text-muted-foreground">Points</div>
                </div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        {generateQuestionMutation.isPending ? (
          <Card className="border-primary/20">
            <CardContent className="p-12 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
              <p className="text-lg text-muted-foreground">
                Generating your next question...
              </p>
            </CardContent>
          </Card>
        ) : currentQuestion && !answerResult ? (
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Question {questionsAnswered + 1}</CardTitle>
                {currentQuestion.topic && (
                  <Badge variant="secondary">{currentQuestion.topic}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.question}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer" className="text-base">Your Answer</Label>
                <Input
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="text-lg"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !submitAnswerMutation.isPending) {
                      handleSubmitAnswer();
                    }
                  }}
                  data-testid="input-answer"
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitAnswer}
                disabled={submitAnswerMutation.isPending || !userAnswer.trim()}
                data-testid="button-submit-answer"
              >
                {submitAnswerMutation.isPending ? (
                  <>
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Submit Answer
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : answerResult ? (
          <Card className={`border-2 ${answerResult.isCorrect ? "border-chart-2" : "border-chart-4"}`}>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                {answerResult.isCorrect ? (
                  <div className="space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-chart-2 mx-auto" />
                    <h3 className="text-2xl font-bold text-chart-2">Correct! 🎉</h3>
                    <div className="flex items-center justify-center gap-2 text-xl">
                      <Star className="w-6 h-6 fill-chart-3 text-chart-3" />
                      <span className="font-bold text-chart-3">+10 points</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <XCircle className="w-16 h-16 text-chart-4 mx-auto" />
                    <h3 className="text-2xl font-bold text-chart-4">Not quite right</h3>
                    <p className="text-muted-foreground">
                      The correct answer was: <span className="font-semibold">{currentQuestion?.correctAnswer}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Feedback
                </p>
                <p className="leading-relaxed">{answerResult.feedback}</p>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleNextQuestion}
                disabled={completeSessionMutation.isPending}
                data-testid="button-next-question"
              >
                {questionsAnswered >= 5 ? (
                  completeSessionMutation.isPending ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-5 h-5 mr-2" />
                      Finish Session
                    </>
                  )
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Next Question
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
