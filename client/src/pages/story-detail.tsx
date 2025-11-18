import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, ArrowLeft, CheckCircle, Circle, Trophy, Target } from "lucide-react";
import type { Story, Chapter, UserStoryProgress } from "@shared/schema";

type StoryDetailData = Story & {
  chapters: Chapter[];
  userProgress: UserStoryProgress | null;
};

export default function StoryDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/stories/:id");
  const { toast } = useToast();
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);

  const storyId = params?.id || "";

  const { data: story, isLoading } = useQuery<StoryDetailData>({
    queryKey: ["/api/stories", storyId],
    enabled: !!storyId,
  });

  const startStoryMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/stories/${storyId}/start`, "POST", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories", storyId] });
      toast({
        title: "Adventure Started!",
        description: "Your journey begins now. Good luck!",
      });
    },
  });

  const completeChapterMutation = useMutation({
    mutationFn: async (chapterNumber: number) => {
      return await apiRequest(
        `/api/stories/${storyId}/chapters/${chapterNumber}/complete`,
        "POST",
        {}
      );
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories", storyId] });
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      
      if (data.storyCompleted) {
        toast({
          title: "🎉 Story Complete!",
          description: `You earned ${data.rewardPoints} bonus points!`,
        });
      } else {
        toast({
          title: "Chapter Complete!",
          description: `Great work! You earned ${data.rewardPoints} points!`,
        });
      }
      setCurrentChapterId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Not Ready Yet",
        description: error.message || "Complete more questions to finish this chapter.",
        variant: "destructive",
      });
    },
  });

  const handleStartStory = () => {
    startStoryMutation.mutate();
  };

  const handleStartChapter = (chapterId: string) => {
    setCurrentChapterId(chapterId);
  };

  const handleStartPractice = (chapter: Chapter) => {
    // Navigate to practice page with story context
    setLocation(`/practice?subject=${chapter.subject}&storyId=${storyId}&chapterId=${chapter.id}`);
  };

  const handleCompleteChapter = (chapterNumber: number) => {
    completeChapterMutation.mutate(chapterNumber);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-12 w-96 mb-4" />
          <Skeleton className="h-24 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Story Not Found</h2>
          <Button onClick={() => setLocation("/stories")} data-testid="button-back-to-stories">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Button>
        </div>
      </div>
    );
  }

  const progress = story.userProgress;
  const hasStarted = !!progress;
  const currentChapterNum = progress?.currentChapter || 1;
  const completedChapters = progress?.completedChapters || [];
  const questionsCompleted = progress?.questionsCompleted || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/stories")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stories
        </Button>

        {/* Story Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-3 flex items-center gap-3">
                <BookOpen className="w-10 h-10 text-primary" />
                {story.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4" data-testid="text-story-description">
                {story.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" data-testid="badge-story-subject">
                  {story.subject === "maths" ? "Maths" : "English"}
                </Badge>
                <Badge variant="outline" data-testid="badge-story-difficulty">
                  {story.difficulty?.toUpperCase()}
                </Badge>
                <Badge variant="outline" data-testid="badge-story-year-level">
                  Years {story.minYearLevel}-{story.maxYearLevel}
                </Badge>
              </div>
            </div>
            {progress?.isCompleted && (
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <Trophy className="w-8 h-8" />
                <span className="text-lg font-bold">Completed!</span>
              </div>
            )}
          </div>

          {!hasStarted && (
            <Button
              onClick={handleStartStory}
              size="lg"
              className="mt-4"
              disabled={startStoryMutation.isPending}
              data-testid="button-start-adventure"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              {startStoryMutation.isPending ? "Starting..." : "Start Adventure"}
            </Button>
          )}
        </Card>

        {/* Chapters */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Chapters</h2>
          
          {story.chapters.map((chapter, index) => {
            const isCompleted = completedChapters.includes(chapter.chapterNumber);
            const isCurrent = chapter.chapterNumber === currentChapterNum;
            const isLocked = !hasStarted || (chapter.chapterNumber > currentChapterNum && !isCompleted);
            const isExpanded = currentChapterId === chapter.id;

            return (
              <Card
                key={chapter.id}
                className={`p-6 ${isLocked ? "opacity-60" : ""}`}
                data-testid={`card-chapter-${chapter.chapterNumber}`}
              >
                <div className="flex items-start gap-4">
                  {/* Chapter Status Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    ) : isCurrent ? (
                      <Target className="w-8 h-8 text-primary" />
                    ) : (
                      <Circle className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Chapter Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-foreground" data-testid={`text-chapter-title-${chapter.chapterNumber}`}>
                        Chapter {chapter.chapterNumber}: {chapter.title}
                      </h3>
                      <Badge variant="outline" data-testid={`badge-reward-${chapter.chapterNumber}`}>
                        <Trophy className="w-3 h-3 mr-1" />
                        {chapter.rewardPoints} pts
                      </Badge>
                    </div>

                    {!isLocked && (
                      <>
                        <p className="text-sm text-muted-foreground mb-4" data-testid={`text-narrative-${chapter.chapterNumber}`}>
                          {chapter.narrative}
                        </p>
                        
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Objective:
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-objective-${chapter.chapterNumber}`}>
                            {chapter.objectiveDescription}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Complete {chapter.requiredQuestions} practice questions
                          </p>
                        </div>

                        {isCurrent && !isCompleted && (
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Questions Completed</span>
                                <span className="font-semibold" data-testid={`text-questions-progress-${chapter.chapterNumber}`}>
                                  {questionsCompleted} / {chapter.requiredQuestions}
                                </span>
                              </div>
                              <Progress
                                value={(questionsCompleted / (chapter.requiredQuestions || 1)) * 100}
                                className="h-2"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleStartPractice(chapter)}
                                data-testid={`button-practice-${chapter.chapterNumber}`}
                              >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Practice Questions
                              </Button>
                              {questionsCompleted >= (chapter.requiredQuestions || 5) && (
                                <Button
                                  onClick={() => handleCompleteChapter(chapter.chapterNumber)}
                                  variant="default"
                                  disabled={completeChapterMutation.isPending}
                                  data-testid={`button-complete-chapter-${chapter.chapterNumber}`}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  {completeChapterMutation.isPending ? "Completing..." : "Complete Chapter"}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        {isCompleted && (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Chapter Complete!</span>
                          </div>
                        )}
                      </>
                    )}

                    {isLocked && (
                      <p className="text-sm text-muted-foreground italic">
                        Complete previous chapters to unlock this adventure.
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
