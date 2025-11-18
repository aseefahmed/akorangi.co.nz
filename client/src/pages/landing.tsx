import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Star, Trophy, Sparkles, Zap, Target, Flame, Award, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Landing() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
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
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-36 h-36 bg-chart-3/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 px-6 py-3 rounded-full mb-6 border border-primary/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary">AI-Powered Learning Magic</span>
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            </motion.div>
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent"
          >
            SmartLearn NZ
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold text-foreground mb-4 max-w-3xl mx-auto"
          >
            Learning Adventures for Kiwi Kids!
          </motion.p>
          
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Join the fun with personalized maths and English practice! Earn points, unlock achievements, and become a learning superstar!
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="text-lg px-10 py-6 text-white shadow-xl"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-start-learning"
              >
                <Rocket className="w-6 h-6 mr-2" />
                Start Learning Free
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 bg-background/80 backdrop-blur-sm shadow-lg border-2"
                data-testid="button-parent-login"
                onClick={() => window.location.href = "/api/login"}
              >
                <BookOpen className="w-6 h-6 mr-2" />
                Parent Login
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto"
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-2xl p-4 sm:p-6"
            >
              <Star className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-2 fill-primary" />
              <div className="text-2xl sm:text-4xl font-bold text-primary">5000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-semibold">Questions</div>
            </motion.div>
            <motion.div
              variants={floatVariants}
              animate="animate"
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 rounded-2xl p-4 sm:p-6"
            >
              <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-accent mx-auto mb-2 fill-accent" />
              <div className="text-2xl sm:text-4xl font-bold text-accent">50+</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-semibold">Achievements</div>
            </motion.div>
            <motion.div
              variants={floatVariants}
              animate="animate"
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-chart-3/20 to-chart-3/10 border border-chart-3/30 rounded-2xl p-4 sm:p-6"
            >
              <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-chart-3 mx-auto mb-2" />
              <div className="text-2xl sm:text-4xl font-bold text-chart-3">AI</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-semibold">Powered</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Why Kids Love SmartLearn
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Learning has never been this fun and engaging!
          </motion.p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-2 border-primary/30 hover-elevate active-elevate-2 h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 border border-primary/20"
                    animate={hoveredCard === 0 ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Brain className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-primary">AI-Powered Questions</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get unlimited practice questions generated by AI, perfectly matched to your
                    year level and the NZ curriculum!
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
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-2 border-accent/30 hover-elevate active-elevate-2 h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4 border border-accent/20"
                    animate={hoveredCard === 1 ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Trophy className="w-8 h-8 text-chart-3 fill-chart-3" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-accent">Gamified Learning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Earn points, unlock badges, build streaks, and celebrate achievements as you
                    master new skills!
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
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-2 border-chart-2/30 hover-elevate active-elevate-2 h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 to-transparent pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-2/20 to-chart-2/10 flex items-center justify-center mb-4 border border-chart-2/20"
                    animate={hoveredCard === 2 ? { rotate: 360 } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <Zap className="w-8 h-8 text-chart-2" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-chart-2">Instant Feedback</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get encouraging AI feedback immediately. Learn from mistakes with helpful
                    explanations and tips!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Practice Core Subjects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-lg text-muted-foreground mb-12"
          >
            Choose your subject and start your learning adventure!
          </motion.p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03, rotate: -1 }}
            >
              <Card className="border-2 border-primary/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none" />
                <CardContent className="p-8 text-center relative z-10">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-lg"
                    whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Brain className="w-14 h-14 text-primary" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4 text-primary">Maths</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Addition, subtraction, multiplication, division, fractions, decimals, and more!
                  </p>
                  <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Years 1-8</span>
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
              <Card className="border-2 border-accent/30 hover-elevate active-elevate-2 h-full relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent pointer-events-none" />
                <CardContent className="p-8 text-center relative z-10">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center border-2 border-accent/20 shadow-lg"
                    whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <BookOpen className="w-14 h-14 text-accent" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4 text-accent">English</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Reading comprehension, vocabulary, grammar, spelling, and creative writing!
                  </p>
                  <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                    <Target className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-accent">Years 1-8</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-chart-3/10 pointer-events-none" />
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
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Kiwi kids becoming learning superstars every day!
          </p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="text-xl px-12 py-7 shadow-2xl"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-get-started"
            >
              <Rocket className="w-6 h-6 mr-2" />
              Get Started Now
            </Button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            100% Free • No Credit Card Required • Start Learning in 30 Seconds
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}
