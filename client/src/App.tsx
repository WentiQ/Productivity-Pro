import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Events from "@/pages/events";
import Pomodoro from "@/pages/pomodoro";
import Notes from "@/pages/notes";
import Water from "@/pages/water";
import Habits from "@/pages/habits";
import Blocker from "@/pages/blocker";
import Analytics from "@/pages/analytics";
import Tools from "@/pages/tools";
import TimePass from "@/pages/timepass";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/events" component={Events} />
      <Route path="/pomodoro" component={Pomodoro} />
      <Route path="/notes" component={Notes} />
      <Route path="/water" component={Water} />
      <Route path="/habits" component={Habits} />
      <Route path="/blocker" component={Blocker} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/tools" component={Tools} />
      <Route path="/timepass" component={TimePass} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-background dark:bg-gray-900">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            <Header setSidebarOpen={setSidebarOpen} />
            
            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              <Router />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
