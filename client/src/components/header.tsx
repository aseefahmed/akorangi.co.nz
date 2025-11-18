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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Star,
  Flame,
  User,
  LogOut,
  BarChart3,
  Home,
  Users,
  Brain,
  BookOpen,
  Trophy,
  Zap,
  Target,
  Calculator,
  Divide,
  Percent,
  BookText,
  PenTool,
  SpellCheck,
  TrendingUp,
  Calendar,
  Award,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg cursor-pointer" data-testid="link-logo">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SmartLearn NZ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Practice Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base" data-testid="nav-practice-trigger">
                    <Brain className="w-4 h-4 mr-2" />
                    Practice
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                      {/* Maths Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">Mathematics</h4>
                            <p className="text-xs text-muted-foreground">Master numbers and problem solving</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Link href="/practice/maths">
                            <div className="group flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="nav-practice-maths">
                              <Calculator className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Addition & Subtraction</div>
                                <div className="text-xs text-muted-foreground">Build your number sense</div>
                              </div>
                            </div>
                          </Link>
                          <Link href="/practice/maths">
                            <div className="group flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="nav-practice-maths-mult">
                              <Divide className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Multiplication & Division</div>
                                <div className="text-xs text-muted-foreground">Master times tables</div>
                              </div>
                            </div>
                          </Link>
                          <Link href="/practice/maths">
                            <div className="group flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="nav-practice-maths-fractions">
                              <Percent className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Fractions & Decimals</div>
                                <div className="text-xs text-muted-foreground">Understand parts of numbers</div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* English Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">English</h4>
                            <p className="text-xs text-muted-foreground">Improve reading and writing</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Link href="/practice/english">
                            <div className="group flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="nav-practice-english-reading">
                              <BookText className="w-4 h-4 text-accent" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Reading Comprehension</div>
                                <div className="text-xs text-muted-foreground">Understand stories better</div>
                              </div>
                            </div>
                          </Link>
                          <Link href="/practice/english">
                            <div className="group flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="nav-practice-english-vocab">
                              <PenTool className="w-4 h-4 text-accent" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Vocabulary & Grammar</div>
                                <div className="text-xs text-muted-foreground">Learn new words</div>
                              </div>
                            </div>
                          </Link>
                          <Link href="/practice/english">
                            <div className="group flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="nav-practice-english-spelling">
                              <SpellCheck className="w-4 h-4 text-accent" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Spelling & Writing</div>
                                <div className="text-xs text-muted-foreground">Perfect your spelling</div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Progress */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/progress" className={navigationMenuTriggerStyle()} data-testid="nav-progress">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Progress
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Achievements Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base" data-testid="nav-achievements-trigger">
                    <Trophy className="w-4 h-4 mr-2" />
                    Achievements
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px]">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-chart-3 to-chart-2 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">Unlock Badges & Rewards</h4>
                            <p className="text-xs text-muted-foreground">Track your amazing progress</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Link href="/progress">
                            <div className="group flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="nav-achievements-badges">
                              <Award className="w-4 h-4 text-chart-3" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">My Badges</div>
                                <div className="text-xs text-muted-foreground">See what you've unlocked</div>
                              </div>
                            </div>
                          </Link>
                          <Link href="/progress">
                            <div className="group flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="nav-achievements-streak">
                              <Flame className="w-4 h-4 text-chart-3" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Streak Milestones</div>
                                <div className="text-xs text-muted-foreground">Keep the streak going!</div>
                              </div>
                            </div>
                          </Link>
                          <Link href="/progress">
                            <div className="group flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="nav-achievements-points">
                              <Star className="w-4 h-4 text-chart-3" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Points & Rewards</div>
                                <div className="text-xs text-muted-foreground">Earn more points</div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Daily Challenge */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/dashboard" className={navigationMenuTriggerStyle()} data-testid="nav-daily-challenge">
                      <Zap className="w-4 h-4 mr-2" />
                      Daily Challenge
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side: Stats + User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Points and Streak - Hidden on small screens */}
            <div className="hidden md:flex items-center gap-3">
              <Badge variant="secondary" className="gap-1 px-3 py-1" data-testid="badge-header-points">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-semibold">{user?.totalPoints || 0}</span>
              </Badge>
              <Badge variant="secondary" className="gap-1 px-3 py-1" data-testid="badge-header-streak">
                <Flame className="w-4 h-4 fill-chart-3 text-chart-3" />
                <span className="font-semibold">{user?.currentStreak || 0}</span>
              </Badge>
            </div>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Mobile Stats */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Badge variant="secondary" className="gap-1 px-3 py-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-semibold">{user?.totalPoints || 0}</span>
                    </Badge>
                    <Badge variant="secondary" className="gap-1 px-3 py-1">
                      <Flame className="w-4 h-4 fill-chart-3 text-chart-3" />
                      <span className="font-semibold">{user?.currentStreak || 0}</span>
                    </Badge>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-nav-dashboard">
                        <Home className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/practice/maths">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-nav-maths">
                        <Brain className="w-4 h-4 mr-2" />
                        Maths Practice
                      </Button>
                    </Link>
                    <Link href="/practice/english">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-nav-english">
                        <BookOpen className="w-4 h-4 mr-2" />
                        English Practice
                      </Button>
                    </Link>
                    <Link href="/progress">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-nav-progress">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Progress
                      </Button>
                    </Link>
                    <Link href="/progress">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-nav-achievements">
                        <Trophy className="w-4 h-4 mr-2" />
                        Achievements
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-nav-daily-challenge">
                        <Zap className="w-4 h-4 mr-2" />
                        Daily Challenge
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* User Menu Dropdown */}
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
                {(user?.role === "parent" || user?.role === "teacher") && (
                  <DropdownMenuItem asChild>
                    <Link href="/parent-dashboard">
                      <div className="flex items-center w-full cursor-pointer" data-testid="link-parent-dashboard">
                        <Users className="w-4 h-4 mr-2" />
                        {user.role === "teacher" ? "My Students" : "My Children"}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )}
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
      </div>
    </header>
  );
}
