import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import Router from "./routes";

function App() {
  const user = useContext(UserContext);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router user={user} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
