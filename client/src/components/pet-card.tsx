import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Cat, Dog, Flame, Bot, Bird, Squirrel, Heart, Apple, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Pet } from "@shared/schema";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

const PET_ICONS: Record<string, { icon: any; color: string }> = {
  cat: { icon: Cat, color: "from-orange-400 to-orange-600" },
  dog: { icon: Dog, color: "from-amber-400 to-amber-600" },
  dragon: { icon: Flame, color: "from-red-400 to-red-600" },
  robot: { icon: Bot, color: "from-blue-400 to-blue-600" },
  owl: { icon: Bird, color: "from-purple-400 to-purple-600" },
  fox: { icon: Squirrel, color: "from-pink-400 to-pink-600" },
};

interface PetCardProps {
  pet: Pet;
  userPoints: number;
}

export function PetCard({ pet, userPoints }: PetCardProps) {
  const [isFeeding, setIsFeeding] = useState(false);
  const { toast } = useToast();
  
  const petConfig = PET_ICONS[pet.petType] || PET_ICONS.cat;
  const PetIcon = petConfig.icon;
  const foodCost = 50;

  const handleFeed = async () => {
    if (userPoints < foodCost) {
      toast({
        title: "Not Enough Points",
        description: `You need ${foodCost} points to feed ${pet.name}!`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsFeeding(true);
      await apiRequest("POST", "/api/pets/feed");

      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      toast({
        title: `${pet.name} is Happy!`,
        description: `You fed ${pet.name}. Happiness increased!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to feed pet",
        variant: "destructive",
      });
    } finally {
      setIsFeeding(false);
    }
  };

  const happiness = pet.happiness ?? 100;
  const hunger = pet.hunger ?? 0;
  const level = pet.level ?? 1;
  const experience = pet.experience ?? 0;
  const experienceToNextLevel = level * 100;
  const experienceProgress = (experience / experienceToNextLevel) * 100;

  const getMoodEmoji = () => {
    if (happiness > 80) return "😊";
    if (happiness > 50) return "🙂";
    if (happiness > 20) return "😐";
    return "😢";
  };

  const getHungerStatus = () => {
    if (hunger < 30) return { text: "Full", color: "text-green-600" };
    if (hunger < 60) return { text: "Peckish", color: "text-yellow-600" };
    if (hunger < 80) return { text: "Hungry", color: "text-orange-600" };
    return { text: "Very Hungry!", color: "text-red-600" };
  };

  const hungerStatus = getHungerStatus();

  return (
    <Card className="overflow-hidden" data-testid="card-pet">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{pet.name}</CardTitle>
            <CardDescription>Your Learning Companion</CardDescription>
          </div>
          <Badge variant="secondary" className="text-base px-3 py-1" data-testid="badge-pet-level">
            <Sparkles className="w-3 h-3 mr-1" />
            Level {level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Pet Avatar */}
        <motion.div
          className="flex justify-center"
          animate={{
            y: hunger > 50 ? [0, -5, 0] : [0, -2, 0],
          }}
          transition={{
            duration: hunger > 50 ? 1 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className={cn(
              "w-32 h-32 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg",
              petConfig.color
            )}
            data-testid="avatar-pet"
          >
            <PetIcon className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Mood */}
        <div className="text-center text-sm text-muted-foreground">
          Mood: <span className="text-2xl">{getMoodEmoji()}</span>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {/* Happiness */}
          <div>
            <div className="flex items-center justify-between mb-1 text-sm">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                Happiness
              </span>
              <span className="font-medium" data-testid="text-pet-happiness">
                {happiness}%
              </span>
            </div>
            <Progress value={happiness} className="h-2" />
          </div>

          {/* Hunger */}
          <div>
            <div className="flex items-center justify-between mb-1 text-sm">
              <span className="flex items-center gap-1">
                <Apple className="w-4 h-4 text-green-500" />
                Hunger
              </span>
              <span className={cn("font-medium", hungerStatus.color)} data-testid="text-pet-hunger">
                {hungerStatus.text}
              </span>
            </div>
            <Progress value={hunger} className="h-2" />
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center justify-between mb-1 text-sm">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Experience
              </span>
              <span className="text-xs text-muted-foreground" data-testid="text-pet-experience">
                {experience}/{experienceToNextLevel}
              </span>
            </div>
            <Progress value={experienceProgress} className="h-2" />
          </div>
        </div>

        {/* Feed Button */}
        <Button
          onClick={handleFeed}
          disabled={isFeeding || userPoints < foodCost}
          className="w-full"
          variant={hunger > 50 ? "default" : "outline"}
          data-testid="button-feed-pet"
        >
          <Apple className="w-4 h-4 mr-2" />
          Feed ({foodCost} points)
        </Button>

        {userPoints < foodCost && (
          <p className="text-xs text-center text-muted-foreground">
            Earn more points to feed {pet.name}!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
