import { createContext, useState, useEffect } from "react";
import { watchUser } from "../lib/auth";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for development mode user first
    const devUser = localStorage.getItem('dev_user');
    if (devUser) {
      setUser(JSON.parse(devUser));
      setLoading(false);
      return;
    }

    const unsubscribe = watchUser((userData) => {
      setUser(userData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SabhjiGo...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}