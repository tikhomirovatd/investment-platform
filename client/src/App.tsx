import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { MainLayout } from "@/layouts/MainLayout";
import Requests from "@/pages/Requests";
import Users from "@/pages/Users";
import Projects from "@/pages/Projects";
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();

  // Redirect to requests page if at root
  useEffect(() => {
    if (location === "/") {
      setLocation("/requests");
    }
  }, [location, setLocation]);

  return (
    <MainLayout>
      <Switch>
        <Route path="/requests" component={Requests} />
        <Route path="/users" component={Users} />
        <Route path="/projects" component={Projects} />
        <Route path="/" component={Requests} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  useEffect(() => {
    // Set up global event listener for notifications
    const handleNotification = (event: CustomEvent) => {
      // In a real app, this would update the context
      console.log("Notification:", event.detail);
    };

    window.addEventListener("notification", handleNotification as EventListener);
    return () => {
      window.removeEventListener("notification", handleNotification as EventListener);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
