import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, Star, Lock } from "lucide-react";
import type { Story, UserStoryProgress } from "@shared/schema";

interface StoryCardProps {
  story: Story & { userProgress: UserStoryProgress | null };
  onStart: (storyId: string) => void;
  onContinue: (storyId: string) => void;
}

export function StoryCard({ story, onStart, onContinue }: StoryCardProps) {
  const progress = story.userProgress;
  const hasStarted = !!progress;
  const isCompleted = progress?.isCompleted || false;
  const currentChapter = progress?.currentChapter || 1;
  const completedChapters = progress?.completedChapters?.length || 0;

  // Estimate total chapters (you could make this dynamic by fetching)
  const totalChapters = 3; // Most stories have 3 chapters
  const progressPercent = hasStarted ? (completedChapters / totalChapters) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getSubjectColor = (subject: string) => {
    return subject === "maths"
      ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20"
      : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
  };

  return (
    <Card className="p-6 hover-elevate active-elevate-2 transition-all">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {story.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                variant="outline"
                className={getDifficultyColor(story.difficulty || "medium")}
                data-testid={`badge-difficulty-${story.id}`}
              >
                {story.difficulty?.toUpperCase() || "MEDIUM"}
              </Badge>
              <Badge
                variant="outline"
                className={getSubjectColor(story.subject)}
                data-testid={`badge-subject-${story.id}`}
              >
                {story.subject === "maths" ? "Maths" : "English"}
              </Badge>
              <Badge
                variant="outline"
                className="bg-muted"
                data-testid={`badge-year-level-${story.id}`}
              >
                Years {story.minYearLevel}-{story.maxYearLevel}
              </Badge>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-semibold">Complete!</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-description-${story.id}`}>
          {story.description}
        </p>

        {/* Progress */}
        {hasStarted && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Star className="w-4 h-4" />
                Progress
              </span>
              <span className="font-semibold text-foreground" data-testid={`text-progress-${story.id}`}>
                {completedChapters} / {totalChapters} Chapters
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-2">
          {!hasStarted && (
            <Button
              onClick={() => onStart(story.id)}
              className="flex-1"
              data-testid={`button-start-story-${story.id}`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Start Adventure
            </Button>
          )}
          {hasStarted && !isCompleted && (
            <Button
              onClick={() => onContinue(story.id)}
              className="flex-1"
              data-testid={`button-continue-story-${story.id}`}
            >
              Continue Chapter {currentChapter}
            </Button>
          )}
          {isCompleted && (
            <Button
              onClick={() => onContinue(story.id)}
              variant="outline"
              className="flex-1"
              data-testid={`button-replay-story-${story.id}`}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Replay Story
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
