import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Cat, Dog, Flame, Bot, Bird, Squirrel } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

const PET_TYPES = [
  { id: "cat", name: "Cat", icon: Cat, color: "from-orange-400 to-orange-600" },
  { id: "dog", name: "Dog", icon: Dog, color: "from-amber-400 to-amber-600" },
  { id: "dragon", name: "Dragon", icon: Flame, color: "from-red-400 to-red-600" },
  { id: "robot", name: "Robot", icon: Bot, color: "from-blue-400 to-blue-600" },
  { id: "owl", name: "Owl", icon: Bird, color: "from-purple-400 to-purple-600" },
  { id: "fox", name: "Fox", icon: Squirrel, color: "from-pink-400 to-pink-600" },
];

interface PetSelectorProps {
  open: boolean;
  onClose: () => void;
}

export function PetSelector({ open, onClose }: PetSelectorProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [petName, setPetName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!selectedType || !petName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please choose a pet type and give it a name!",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      await apiRequest("POST", "/api/pets", {
        petType: selectedType,
        name: petName.trim(),
      });

      // Invalidate pet query to fetch the new pet
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      toast({
        title: "Pet Adopted!",
        description: `Meet ${petName}, your new learning companion!`,
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create pet",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-pet-selector">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Learning Companion!</DialogTitle>
          <DialogDescription>
            Pick a virtual pet to join you on your learning journey. Feed them with points you earn!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pet Type Selection */}
          <div>
            <Label className="text-base mb-3 block">Select a Pet Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PET_TYPES.map((petType) => {
                const Icon = petType.icon;
                const isSelected = selectedType === petType.id;

                return (
                  <Card
                    key={petType.id}
                    className={cn(
                      "p-4 cursor-pointer hover-elevate active-elevate-2 transition-all",
                      isSelected && "ring-2 ring-primary ring-offset-2"
                    )}
                    onClick={() => setSelectedType(petType.id)}
                    data-testid={`pet-type-${petType.id}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center",
                          petType.color
                        )}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="font-semibold">{petType.name}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Pet Name Input */}
          <div>
            <Label htmlFor="pet-name" className="text-base mb-2 block">
              Name Your Pet
            </Label>
            <Input
              id="pet-name"
              placeholder="Enter a fun name..."
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              maxLength={20}
              data-testid="input-pet-name"
            />
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreate}
            disabled={!selectedType || !petName.trim() || isCreating}
            className="w-full"
            size="lg"
            data-testid="button-create-pet"
          >
            {isCreating ? "Adopting Pet..." : "Adopt Pet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
