import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star, Flame, User, LogOut, BarChart3, Home } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg cursor-pointer">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SmartLearn NZ
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg cursor-pointer">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SmartLearn NZ
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Points and Streak - Hidden on small screens */}
          <div className="hidden sm:flex items-center gap-4">
            <Badge variant="secondary" className="gap-1 px-3 py-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-semibold">{user?.totalPoints || 0}</span>
            </Badge>
            <Badge variant="secondary" className="gap-1 px-3 py-1">
              <Flame className="w-4 h-4 fill-chart-3 text-chart-3" />
              <span className="font-semibold">{user?.currentStreak || 0}</span>
            </Badge>
          </div>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                data-testid="button-user-menu"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2">
                <p className="text-sm font-semibold" data-testid="text-user-name">
                  {user?.firstName || user?.email || "User"}
                </p>
                <p className="text-xs text-muted-foreground" data-testid="text-user-email">
                  {user?.email || ""}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Year {user?.yearLevel || 1}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <div className="flex items-center w-full cursor-pointer" data-testid="link-dashboard">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/progress">
                  <div className="flex items-center w-full cursor-pointer" data-testid="link-progress">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Progress Report
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = "/api/logout";
                }}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
