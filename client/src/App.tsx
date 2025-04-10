import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Plans from "@/pages/plans";
import Goals from "@/pages/goals";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/plans" component={Plans} />
      <Route path="/goals" component={Goals} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
