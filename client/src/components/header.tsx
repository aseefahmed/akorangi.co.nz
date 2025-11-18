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
  Sparkles,
  Map,
  Heart,
  BarChart,
  GraduationCap,
  Eye,
  Bot,
  ArrowRight,
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
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg cursor-pointer" data-testid="link-logo-landing">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SmartLearn NZ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation for Landing Page */}
          <div className="hidden md:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Features Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base" data-testid="nav-landing-features-trigger">
                    <Eye className="w-4 h-4 mr-2" />
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[800px] p-6">
                      {/* Hero Section */}
                      <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-chart-3/10 border border-primary/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-6 h-6 text-primary" />
                              <h3 className="text-lg font-bold">Interactive Learning for Kiwi Kids</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              AI-powered practice, story adventures, and virtual pets make learning fun for Years 1-8
                            </p>
                            <div className="flex gap-2">
                              <Button size="sm" asChild data-testid="button-landing-features-hero-practice">
                                <a href="/api/login">
                                  <Brain className="w-4 h-4 mr-2" />
                                  Try Practice Now
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </a>
                              </Button>
                              <Button variant="outline" size="sm" asChild data-testid="button-landing-features-hero-stories">
                                <a href="/api/login">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Start a Story
                                </a>
                              </Button>
                            </div>
                          </div>
                          <div className="hidden md:flex w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent items-center justify-center">
                            <GraduationCap className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Three Column Feature Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Learn Column */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Brain className="w-4 h-4 text-primary" />
                            </div>
                            <h4 className="font-semibold text-sm">Learn</h4>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-feature-card-ai-practice">
                              <div className="flex items-start gap-2">
                                <Bot className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">AI-Powered Questions</div>
                                  <div className="text-xs text-muted-foreground">GPT-5 generates NZ curriculum-aligned questions</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-feature-card-adaptive">
                              <div className="flex items-start gap-2">
                                <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Adaptive Difficulty</div>
                                  <div className="text-xs text-muted-foreground">Automatically adjusts to your skill level</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-feature-card-curriculum">
                              <div className="flex items-start gap-2">
                                <GraduationCap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">NZ Curriculum</div>
                                  <div className="text-xs text-muted-foreground">Aligned with New Zealand education standards</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Adventure Column */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                              <Map className="w-4 h-4 text-accent" />
                            </div>
                            <h4 className="font-semibold text-sm">Adventure</h4>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-feature-card-story-mode">
                              <div className="flex items-start gap-2">
                                <BookOpen className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Story Mode</div>
                                  <div className="text-xs text-muted-foreground">Learn through interactive story adventures</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-feature-card-virtual-pets">
                              <div className="flex items-start gap-2">
                                <Heart className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Virtual Pets</div>
                                  <div className="text-xs text-muted-foreground">Adopt and care for your learning companion</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Grow Column */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                              <Trophy className="w-4 h-4 text-chart-3" />
                            </div>
                            <h4 className="font-semibold text-sm">Grow</h4>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-feature-card-gamification">
                              <div className="flex items-start gap-2">
                                <Star className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Points & Rewards</div>
                                  <div className="text-xs text-muted-foreground">Earn points and unlock achievements</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-feature-card-progress">
                              <div className="flex items-start gap-2">
                                <BarChart className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Progress Tracking</div>
                                  <div className="text-xs text-muted-foreground">Monitor learning growth and stats</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Subjects Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base" data-testid="nav-landing-subjects-trigger">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Subjects
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[700px] p-6">
                      {/* Hero Section */}
                      <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-6 h-6 text-primary" />
                              <h3 className="text-lg font-bold">Master Math & English</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              NZ curriculum-aligned practice for Years 1-8. Sign up to start learning!
                            </p>
                            <div className="flex gap-2">
                              <Button size="sm" asChild data-testid="button-landing-subjects-hero-maths">
                                <a href="/api/login">
                                  <Calculator className="w-4 h-4 mr-2" />
                                  Practice Maths
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </a>
                              </Button>
                              <Button variant="outline" size="sm" asChild data-testid="button-landing-subjects-hero-english">
                                <a href="/api/login">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Practice English
                                </a>
                              </Button>
                            </div>
                          </div>
                          <div className="hidden md:flex w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent to-primary items-center justify-center">
                            <BookOpen className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Two Column Subject Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* Mathematics Column */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Mathematics</h4>
                              <p className="text-xs text-muted-foreground">Numbers & problem solving</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-subject-card-addition">
                              <div className="flex items-start gap-2">
                                <Calculator className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Addition & Subtraction</div>
                                  <div className="text-xs text-muted-foreground">Build your number sense</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-subject-card-multiplication">
                              <div className="flex items-start gap-2">
                                <Divide className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Multiplication & Division</div>
                                  <div className="text-xs text-muted-foreground">Master times tables</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-subject-card-fractions">
                              <div className="flex items-start gap-2">
                                <Percent className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Fractions & Decimals</div>
                                  <div className="text-xs text-muted-foreground">Understand parts of numbers</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* English Column */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">English</h4>
                              <p className="text-xs text-muted-foreground">Reading & writing skills</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-subject-card-reading">
                              <div className="flex items-start gap-2">
                                <BookText className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Reading Comprehension</div>
                                  <div className="text-xs text-muted-foreground">Understand stories better</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-subject-card-vocabulary">
                              <div className="flex items-start gap-2">
                                <PenTool className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Vocabulary & Grammar</div>
                                  <div className="text-xs text-muted-foreground">Learn new words</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="landing-subject-card-spelling">
                              <div className="flex items-start gap-2">
                                <SpellCheck className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Spelling & Writing</div>
                                  <div className="text-xs text-muted-foreground">Perfect your spelling</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <a href="#how-it-works" className={navigationMenuTriggerStyle()} data-testid="nav-landing-how-it-works">
                      How It Works
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Button asChild className="ml-2" data-testid="button-landing-login">
              <a href="/api/login">
                <User className="w-4 h-4 mr-2" />
                Log In
              </a>
            </Button>
          </div>

          {/* Mobile Menu for Landing Page */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu-landing">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {/* Features Section */}
                  <div className="py-2">
                    <div className="px-3 mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Features</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Interactive learning for Years 1-8
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-landing-feature-ai-practice">
                        <Bot className="w-3 h-3 mr-2" />
                        AI-Powered Questions
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-landing-feature-adaptive">
                        <TrendingUp className="w-3 h-3 mr-2" />
                        Adaptive Difficulty
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-landing-feature-curriculum">
                        <GraduationCap className="w-3 h-3 mr-2" />
                        NZ Curriculum
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-landing-feature-story-mode">
                        <BookOpen className="w-3 h-3 mr-2" />
                        Story Mode
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-landing-feature-virtual-pets">
                        <Heart className="w-3 h-3 mr-2" />
                        Virtual Pets
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-landing-feature-gamification">
                        <Star className="w-3 h-3 mr-2" />
                        Points & Rewards
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-landing-feature-progress">
                        <BarChart className="w-3 h-3 mr-2" />
                        Progress Tracking
                      </Button>
                    </div>
                  </div>

                  {/* Subjects Section */}
                  <div className="py-2">
                    <div className="px-3 mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Subjects</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Math & English practice
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start pl-9" asChild onClick={() => setMobileMenuOpen(false)} data-testid="mobile-landing-subject-maths">
                        <a href="/api/login">
                          <Calculator className="w-3 h-3 mr-2" />
                          Mathematics
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start pl-9" asChild onClick={() => setMobileMenuOpen(false)} data-testid="mobile-landing-subject-english">
                        <a href="/api/login">
                          <BookText className="w-3 h-3 mr-2" />
                          English
                        </a>
                      </Button>
                    </div>
                  </div>

                  <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileMenuOpen(false)}>
                    <a href="#how-it-works" data-testid="mobile-nav-landing-how-it-works">
                      How It Works
                    </a>
                  </Button>
                  <Button className="w-full mt-4" asChild data-testid="mobile-button-landing-login">
                    <a href="/api/login">
                      <User className="w-4 h-4 mr-2" />
                      Log In
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
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

                {/* Features Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base" data-testid="nav-features-trigger">
                    <Eye className="w-4 h-4 mr-2" />
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[800px] p-6">
                      {/* Hero Section */}
                      <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-chart-3/10 border border-primary/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-6 h-6 text-primary" />
                              <h3 className="text-lg font-bold">Interactive Learning for Kiwi Kids</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              AI-powered practice, story adventures, and virtual pets make learning fun for Years 1-8
                            </p>
                            <div className="flex gap-2">
                              <Link href="/practice/maths">
                                <Button size="sm" data-testid="button-features-hero-practice">
                                  <Brain className="w-4 h-4 mr-2" />
                                  Try Practice Now
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                              <Link href="/stories">
                                <Button variant="outline" size="sm" data-testid="button-features-hero-stories">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Start a Story
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div className="hidden md:flex w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent items-center justify-center">
                            <GraduationCap className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Three Column Feature Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Learn Column */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Brain className="w-4 h-4 text-primary" />
                            </div>
                            <h4 className="font-semibold text-sm">Learn</h4>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="feature-card-ai-practice">
                              <div className="flex items-start gap-2">
                                <Bot className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">AI-Powered Questions</div>
                                  <div className="text-xs text-muted-foreground">GPT-5 generates NZ curriculum-aligned questions</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="feature-card-adaptive">
                              <div className="flex items-start gap-2">
                                <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Adaptive Difficulty</div>
                                  <div className="text-xs text-muted-foreground">Automatically adjusts to your skill level</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="feature-card-curriculum">
                              <div className="flex items-start gap-2">
                                <GraduationCap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">NZ Curriculum</div>
                                  <div className="text-xs text-muted-foreground">Aligned with Years 1-8 standards</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Adventure Column */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                              <Map className="w-4 h-4 text-accent" />
                            </div>
                            <h4 className="font-semibold text-sm">Adventure</h4>
                          </div>
                          
                          <Link href="/stories">
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="feature-card-story-mode">
                              <div className="flex items-start gap-2">
                                <BookOpen className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Story Mode</div>
                                  <div className="text-xs text-muted-foreground">Learn through NZ-themed adventures</div>
                                </div>
                              </div>
                            </div>
                          </Link>
                          
                          <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="feature-card-virtual-pets">
                            <div className="flex items-start gap-2">
                              <Heart className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium">Virtual Pets</div>
                                <div className="text-xs text-muted-foreground">Companion pets that grow with you</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Grow Column */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                              <Trophy className="w-4 h-4 text-chart-3" />
                            </div>
                            <h4 className="font-semibold text-sm">Grow</h4>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="feature-card-gamification">
                              <div className="flex items-start gap-2">
                                <Star className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">Points & Rewards</div>
                                  <div className="text-xs text-muted-foreground">Earn points and unlock achievements</div>
                                </div>
                              </div>
                            </div>
                            
                            <Link href="/progress">
                              <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="feature-card-progress">
                                <div className="flex items-start gap-2">
                                  <BarChart className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium">Progress Tracking</div>
                                    <div className="text-xs text-muted-foreground">Detailed analytics for parents & teachers</div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Subjects Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base" data-testid="nav-subjects-trigger">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Subjects
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[700px] p-6">
                      {/* Hero Section */}
                      <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-6 h-6 text-primary" />
                              <h3 className="text-lg font-bold">Master Math & English</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              NZ curriculum-aligned practice for Years 1-8. Choose your subject and start learning!
                            </p>
                            <div className="flex gap-2">
                              <Link href="/practice/maths">
                                <Button size="sm" data-testid="button-subjects-hero-maths">
                                  <Calculator className="w-4 h-4 mr-2" />
                                  Practice Maths
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                              <Link href="/practice/english">
                                <Button variant="outline" size="sm" data-testid="button-subjects-hero-english">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Practice English
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div className="hidden md:flex w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent to-primary items-center justify-center">
                            <BookOpen className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Two Column Subject Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* Mathematics Column */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Mathematics</h4>
                              <p className="text-xs text-muted-foreground">Numbers & problem solving</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <Link href="/practice/maths">
                              <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="subject-card-addition">
                                <div className="flex items-start gap-2">
                                  <Calculator className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium">Addition & Subtraction</div>
                                    <div className="text-xs text-muted-foreground">Build your number sense</div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                            
                            <Link href="/practice/maths">
                              <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="subject-card-multiplication">
                                <div className="flex items-start gap-2">
                                  <Divide className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium">Multiplication & Division</div>
                                    <div className="text-xs text-muted-foreground">Master times tables</div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                            
                            <Link href="/practice/maths">
                              <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="subject-card-fractions">
                                <div className="flex items-start gap-2">
                                  <Percent className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium">Fractions & Decimals</div>
                                    <div className="text-xs text-muted-foreground">Understand parts of numbers</div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>

                        {/* English Column */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">English</h4>
                              <p className="text-xs text-muted-foreground">Reading & writing skills</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <Link href="/practice/english">
                              <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="subject-card-reading">
                                <div className="flex items-start gap-2">
                                  <BookText className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium">Reading Comprehension</div>
                                    <div className="text-xs text-muted-foreground">Understand stories better</div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                            
                            <Link href="/practice/english">
                              <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="subject-card-vocabulary">
                                <div className="flex items-start gap-2">
                                  <PenTool className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium">Vocabulary & Grammar</div>
                                    <div className="text-xs text-muted-foreground">Learn new words</div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                            
                            <Link href="/practice/english">
                              <div className="p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer" data-testid="subject-card-spelling">
                                <div className="flex items-start gap-2">
                                  <SpellCheck className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium">Spelling & Writing</div>
                                    <div className="text-xs text-muted-foreground">Perfect your spelling</div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
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

                {/* Stories */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/stories" className={navigationMenuTriggerStyle()} data-testid="nav-stories">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Stories
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

                    {/* Features Section */}
                    <div className="py-2">
                      <div className="px-3 mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">Features</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Interactive learning for Years 1-8
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-feature-ai-practice">
                          <Bot className="w-3 h-3 mr-2" />
                          AI-Powered Questions
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-feature-adaptive">
                          <TrendingUp className="w-3 h-3 mr-2" />
                          Adaptive Difficulty
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-feature-curriculum">
                          <GraduationCap className="w-3 h-3 mr-2" />
                          NZ Curriculum
                        </Button>
                        <Link href="/stories">
                          <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-feature-story-mode">
                            <BookOpen className="w-3 h-3 mr-2" />
                            Story Mode
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-feature-virtual-pets">
                          <Heart className="w-3 h-3 mr-2" />
                          Virtual Pets
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-feature-gamification">
                          <Star className="w-3 h-3 mr-2" />
                          Points & Rewards
                        </Button>
                        <Link href="/progress">
                          <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-feature-progress">
                            <BarChart className="w-3 h-3 mr-2" />
                            Progress Tracking
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Subjects Section */}
                    <div className="py-2">
                      <div className="px-3 mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">Subjects</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Math & English practice
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Link href="/practice/maths">
                          <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-subject-maths">
                            <Calculator className="w-3 h-3 mr-2" />
                            Mathematics
                          </Button>
                        </Link>
                        <Link href="/practice/english">
                          <Button variant="ghost" size="sm" className="w-full justify-start pl-9" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-subject-english">
                            <BookText className="w-3 h-3 mr-2" />
                            English
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <Link href="/progress">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-nav-progress">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Progress
                      </Button>
                    </Link>
                    <Link href="/stories">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-nav-stories">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Stories
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
