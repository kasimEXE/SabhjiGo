import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function RequireAuth({ children, redirectTo = "/auth" }) {
  const user = useContext(UserContext);
  
  if (!user) {
    // Redirect to auth page or show loading
    window.location.href = redirectTo;
    return null;
  }
  
  return children;
}