import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { ProtectedRoute } from "@/components/protected-route";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Practice from "@/pages/practice";
import ProgressPage from "@/pages/progress";
import ParentDashboard from "@/pages/parent-dashboard";
import Stories from "@/pages/stories";
import StoryDetail from "@/pages/story-detail";

function Router() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/practice">
          <ProtectedRoute>
            <Practice />
          </ProtectedRoute>
        </Route>
        <Route path="/practice/:subject">
          <ProtectedRoute>
            <Practice />
          </ProtectedRoute>
        </Route>
        <Route path="/progress">
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        </Route>
        <Route path="/parent-dashboard">
          <ProtectedRoute>
            <ParentDashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/stories">
          <ProtectedRoute>
            <Stories />
          </ProtectedRoute>
        </Route>
        <Route path="/stories/:id">
          <ProtectedRoute>
            <StoryDetail />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
