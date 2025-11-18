import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Brain, Star, Trophy, Sparkles, Zap, Target, Flame, Rocket,
  Bot, TrendingUp, GraduationCap, Heart, Users, BarChart, CheckCircle, Shield,
  Smile, BookText, Calculator, Activity, Gift, Crown, Cat, Dog, Rabbit, Fish, Bird, Squirrel
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import logoImage from "@assets/generated_images/AkoRangi_educational_logo_design_8d5c3a98.png";

export default function Landing() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredPet, setHoveredPet] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-accent/5 to-background overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-chart-3/20 to-chart-2/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-44 h-44 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section - Enhanced */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6 flex flex-col items-center">
            {/* Logo */}
            <motion.img
              src={logoImage}
              alt="AkoRangi Logo"
              className="w-32 h-32 sm:w-40 sm:h-40 mb-6 drop-shadow-2xl"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/30 via-accent/30 to-chart-3/30 px-6 py-3 rounded-full mb-6 border-2 border-primary/40 shadow-xl backdrop-blur-sm"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI-Powered Learning Magic for Kiwi Kids</span>
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            </motion.div>
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent leading-tight"
            data-testid="heading-hero-title"
          >
            AkoRangi
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 max-w-3xl mx-auto"
          >
            Where Learning Becomes an Adventure!
          </motion.p>
          
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of Kiwi kids mastering maths and English through personalized practice, 
            AI feedback, virtual pets, and exciting achievements. Built for Years 1-8!
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="text-lg text-white shadow-2xl bg-gradient-to-r from-primary to-accent"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-start-learning"
              >
                <Rocket className="w-6 h-6 mr-2" />
                Start Learning Free
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="text-lg bg-background/90 backdrop-blur-sm shadow-xl border-2 border-primary/40"
                data-testid="button-parent-login"
                onClick={() => window.location.href = "/api/login"}
              >
                <Users className="w-6 h-6 mr-2" />
                Parent/Teacher Login
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Floating Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/40 rounded-2xl p-4 sm:p-6 shadow-xl hover-elevate active-elevate-2"
            >
              <Star className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-2 fill-primary" />
              <div className="text-3xl sm:text-4xl font-bold text-primary">5000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-semibold">AI Questions</div>
            </motion.div>
            <motion.div
              variants={floatVariants}
              animate="animate"
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-accent/40 rounded-2xl p-4 sm:p-6 shadow-xl hover-elevate active-elevate-2"
            >
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-accent mx-auto mb-2 fill-accent" />
              <div className="text-3xl sm:text-4xl font-bold text-accent">50+</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-semibold">Achievements</div>
            </motion.div>
            <motion.div
              variants={floatVariants}
              animate="animate"
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-chart-3/30 to-chart-3/10 border-2 border-chart-3/40 rounded-2xl p-4 sm:p-6 shadow-xl hover-elevate active-elevate-2"
            >
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-chart-3 mx-auto mb-2 fill-chart-3" />
              <div className="text-3xl sm:text-4xl font-bold text-chart-3">6</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-semibold">Virtual Pets</div>
            </motion.div>
            <motion.div
              variants={floatVariants}
              animate="animate"
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-chart-2/30 to-chart-2/10 border-2 border-chart-2/40 rounded-2xl p-4 sm:p-6 shadow-xl hover-elevate active-elevate-2"
            >
              <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-chart-2 mx-auto mb-2" />
              <div className="text-3xl sm:text-4xl font-bold text-chart-2">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-semibold">NZ Curriculum</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-background relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-6 py-2 text-sm" data-testid="badge-how-it-works">
              <CheckCircle className="w-4 h-4 mr-2" />
              Simple & Fun
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in just 3 easy steps and watch your child's confidence soar!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10 }}
            >
              <Card className="border-2 border-primary/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <CardContent className="p-8 text-center relative z-10">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-primary/40 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl font-bold text-primary">1</span>
                  </motion.div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-primary">Sign Up & Choose</h3>
                  <p className="text-muted-foreground leading-relaxed">Create your free account, select your year level, and pick your favorite virtual pet companion!</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10 }}
            >
              <Card className="border-2 border-accent/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
                <CardContent className="p-8 text-center relative z-10">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center border-2 border-accent/40 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl font-bold text-accent">2</span>
                  </motion.div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-accent">Practice & Learn</h3>
                  <p className="text-muted-foreground leading-relaxed">Answer AI-generated questions in maths or English. Get instant feedback and earn points for every question!</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <Card className="border-2 border-chart-3/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-chart-3/10 to-transparent pointer-events-none" />
                <CardContent className="p-8 text-center relative z-10">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-chart-3/30 to-chart-3/10 flex items-center justify-center border-2 border-chart-3/40 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl font-bold text-chart-3">3</span>
                  </motion.div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-chart-3/20 to-chart-3/10 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-chart-3" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-chart-3">Grow & Achieve</h3>
                  <p className="text-muted-foreground leading-relaxed">Level up your pet, unlock achievements, build streaks, and become a learning superstar!</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-6 py-2 text-sm" data-testid="badge-features">
              <Sparkles className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why Kids Love AkoRangi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything your child needs to excel in maths and English, all in one fun platform!
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-2 border-primary/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center mb-4"
                    animate={hoveredCard === 0 ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Bot className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-primary">AI-Powered Questions</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Unlimited practice questions generated by advanced AI, perfectly matched to your child's year level and the NZ curriculum!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-2 border-accent/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 flex items-center justify-center mb-4"
                    animate={hoveredCard === 1 ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <TrendingUp className="w-8 h-8 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-accent">Adaptive Difficulty</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Questions automatically adjust based on performance. Doing well? Level up! Need help? Get easier questions to build confidence!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-2 border-chart-2/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-chart-2/10 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-2/20 to-chart-2/10 border border-chart-2/30 flex items-center justify-center mb-4"
                    animate={hoveredCard === 2 ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Zap className="w-8 h-8 text-chart-2" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-chart-2">Instant Feedback</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get encouraging AI feedback immediately after each answer. Learn from mistakes with helpful explanations!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-2 border-chart-3/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-chart-3/10 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-3/20 to-chart-3/10 border border-chart-3/30 flex items-center justify-center mb-4"
                    animate={hoveredCard === 3 ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Trophy className="w-8 h-8 text-chart-3" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-chart-3">Points & Achievements</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Earn points for every correct answer, unlock 50+ achievements, and celebrate your progress with confetti animations!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredCard(4)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-2 border-destructive/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 border border-destructive/30 flex items-center justify-center mb-4"
                    animate={hoveredCard === 4 ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Flame className="w-8 h-8 text-destructive" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-destructive">Streaks & Motivation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Build daily streaks to stay motivated! The longer your streak, the more special rewards you unlock!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredCard(5)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-2 border-primary/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center mb-4"
                    animate={hoveredCard === 5 ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <BookOpen className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-primary">Story Mode</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Learn through interactive story adventures! Make choices, solve problems, and see how the story unfolds based on your answers!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Virtual Pets Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-6 py-2 text-sm" data-testid="badge-virtual-pets">
              <Heart className="w-4 h-4 mr-2 fill-current" />
              Adorable Companions
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
              Meet Your Virtual Pet Friends
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your favorite companion! Your pet grows as you learn, making every practice session more rewarding!
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {[
              { name: "Cat", icon: Cat, colorClass: "text-orange-500" },
              { name: "Dog", icon: Dog, colorClass: "text-amber-600" },
              { name: "Dragon", icon: Sparkles, colorClass: "text-purple-500" },
              { name: "Robot", icon: Bot, colorClass: "text-blue-500" },
              { name: "Owl", icon: Bird, colorClass: "text-indigo-500" },
              { name: "Fox", icon: Squirrel, colorClass: "text-red-500" }
            ].map((pet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                onMouseEnter={() => setHoveredPet(index)}
                onMouseLeave={() => setHoveredPet(null)}
              >
                <Card className="hover-elevate active-elevate-2 cursor-pointer border-2 border-primary/20 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="mb-3"
                      animate={hoveredPet === index ? { y: [0, -10, 0] } : {}}
                      transition={{ duration: 0.5, repeat: hoveredPet === index ? Infinity : 0 }}
                    >
                      <pet.icon className={`w-16 h-16 mx-auto ${pet.colorClass}`} />
                    </motion.div>
                    <div className="text-sm font-semibold">{pet.name}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 via-accent/10 to-chart-3/10 rounded-2xl p-8 border-2 border-primary/20 shadow-xl"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Gift className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-2">Feed Your Pet</h4>
                <p className="text-sm text-muted-foreground">Use your earned points to keep your pet happy and healthy!</p>
              </div>
              <div>
                <Activity className="w-12 h-12 text-accent mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-2">Level Up Together</h4>
                <p className="text-sm text-muted-foreground">Your pet gains experience as you practice and grows with you!</p>
              </div>
              <div>
                <Crown className="w-12 h-12 text-chart-3 mx-auto mb-3 fill-chart-3" />
                <h4 className="font-bold text-lg mb-2">Unlock Rewards</h4>
                <p className="text-sm text-muted-foreground">Higher-level pets unlock exclusive achievements and bonuses!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subjects Section - Enhanced */}
      <section id="subjects" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-6 py-2 text-sm" data-testid="badge-subjects">
              <GraduationCap className="w-4 h-4 mr-2" />
              NZ Curriculum Aligned
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Master Core Subjects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive practice covering all key topics for Years 1-8
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03, rotate: -1 }}
            >
              <Card className="border-2 border-primary/40 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent pointer-events-none" />
                <CardContent className="p-10 text-center relative z-10">
                  <motion.div
                    className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center border-2 border-primary/30 shadow-xl"
                    whileHover={{ rotate: [0, -15, 15, 0], scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Calculator className="w-16 h-16 text-primary" />
                  </motion.div>
                  <h3 className="text-4xl font-bold mb-4 text-primary">Mathematics</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    Master all key maths topics with AI-powered practice and instant feedback
                  </p>
                  <div className="space-y-3 mb-6">
                    {[
                      "Addition & Subtraction",
                      "Multiplication & Division",
                      "Fractions & Decimals",
                      "Geometry & Measurement",
                      "Problem Solving"
                    ].map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 justify-center">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-2 bg-primary/20 px-5 py-3 rounded-full border-2 border-primary/30">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold text-primary">Years 1-8 Aligned</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03, rotate: 1 }}
            >
              <Card className="border-2 border-accent/40 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent pointer-events-none" />
                <CardContent className="p-10 text-center relative z-10">
                  <motion.div
                    className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center border-2 border-accent/30 shadow-xl"
                    whileHover={{ rotate: [0, -15, 15, 0], scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  >
                    <BookText className="w-16 h-16 text-accent" />
                  </motion.div>
                  <h3 className="text-4xl font-bold mb-4 text-accent">English</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    Build strong literacy skills through engaging reading and writing practice
                  </p>
                  <div className="space-y-3 mb-6">
                    {[
                      "Reading Comprehension",
                      "Vocabulary Building",
                      "Grammar & Punctuation",
                      "Spelling Mastery",
                      "Creative Writing"
                    ].map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 justify-center">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        <span className="text-sm font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-2 bg-accent/20 px-5 py-3 rounded-full border-2 border-accent/30">
                    <Target className="w-5 h-5 text-accent" />
                    <span className="text-sm font-bold text-accent">Years 1-8 Aligned</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Parents & Teachers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-background relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-6 py-2 text-sm" data-testid="badge-parents-teachers">
              <Users className="w-4 h-4 mr-2" />
              For Parents & Teachers
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
              Monitor Progress & Support Learning
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to track student progress, identify strengths, and support growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="border-2 border-primary/30 hover-elevate active-elevate-2 h-full shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                    <BarChart className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-primary">Detailed Analytics</h3>
                  <p className="text-muted-foreground leading-relaxed">Track progress across subjects, view accuracy trends, monitor streaks, and see adaptive difficulty adjustments in real-time.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <Card className="border-2 border-accent/30 hover-elevate active-elevate-2 h-full shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border-2 border-accent/30">
                    <Users className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-accent">Multi-Student Dashboard</h3>
                  <p className="text-muted-foreground leading-relaxed">Link multiple students to your account and monitor all their progress from one convenient parent/teacher dashboard.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8 }}
            >
              <Card className="border-2 border-chart-3/30 hover-elevate active-elevate-2 h-full shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-chart-3/20 to-chart-3/10 flex items-center justify-center border-2 border-chart-3/30">
                    <Shield className="w-10 h-10 text-chart-3" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-chart-3">Safe & Secure</h3>
                  <p className="text-muted-foreground leading-relaxed">Student data is protected with enterprise-grade security. Approval-based linking system ensures privacy and safety.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 via-accent/10 to-chart-3/10 rounded-2xl p-8 sm:p-12 text-center border-2 border-primary/20 shadow-xl"
          >
            <Smile className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">100% Free for Everyone</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              No subscriptions, no hidden fees, no credit card required. We believe every Kiwi kid 
              deserves access to quality educational tools!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Unlimited Practice
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                All Features Included
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                No Time Limits
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-chart-3/20 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shadow-2xl"
          >
            <Sparkles className="w-12 h-12 text-primary" />
          </motion.div>
          <h2 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
            Ready to Start Your Learning Adventure?
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of Kiwi kids mastering maths and English while having fun every day!
          </p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8"
          >
            <Button
              size="lg"
              className="text-xl shadow-2xl bg-gradient-to-r from-primary to-accent text-white"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-get-started"
            >
              <Rocket className="w-7 h-7 mr-3" />
              Get Started Now - It's Free!
              <Sparkles className="w-6 h-6 ml-3" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Start in 30 Seconds</span>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
