import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { StoryCard } from "@/components/story-card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Sparkles } from "lucide-react";
import type { Story, UserStoryProgress } from "@shared/schema";

type StoryWithProgress = Story & { userProgress: UserStoryProgress | null };

export default function Stories() {
  const [, setLocation] = useLocation();

  const { data: stories, isLoading } = useQuery<StoryWithProgress[]>({
    queryKey: ["/api/stories"],
  });

  const handleStartStory = async (storyId: string) => {
    // Navigate to story detail page
    setLocation(`/stories/${storyId}`);
  };

  const handleContinueStory = (storyId: string) => {
    // Navigate to story detail page
    setLocation(`/stories/${storyId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-primary" />
            Story Adventures
          </h1>
          <p className="text-lg text-muted-foreground">
            Embark on exciting learning adventures across New Zealand! Complete practice
            questions to progress through each story.
          </p>
        </div>

        {/* Story Grid */}
        {!stories || stories.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Stories Available
            </h3>
            <p className="text-muted-foreground">
              Check back soon for exciting new adventures!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onStart={handleStartStory}
                onContinue={handleContinueStory}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
