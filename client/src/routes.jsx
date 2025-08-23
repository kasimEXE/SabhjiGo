import { Switch, Route, Redirect } from "wouter";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { getUserData } from "./data/users";
import Landing from "./pages/Landing";
import VendorDashboard from "./pages/VendorDashboard";
import VendorInventory from "./pages/VendorInventory";
import CustomerHome from "./pages/CustomerHome";
import ShareView from "./pages/ShareView";
import NotFound from "./pages/not-found";

// Protected route component
function ProtectedRoute({ component: Component, allowedRoles, ...props }) {
  const [user] = useAuthState(auth);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          setUserRole(userData?.role || 'customer');
        } catch (error) {
          console.error('Error loading user role:', error);
          setUserRole('customer');
        }
      }
      setLoading(false);
    };

    loadUserRole();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate home based on role
    const redirectPath = userRole === 'vendor' ? '/vendor' : '/customer';
    window.location.href = redirectPath;
    return null;
  }

  return <Component {...props} />;
}

function Router({ user }) {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/vendor">
        <ProtectedRoute component={VendorDashboard} allowedRoles={['vendor']} />
      </Route>
      <Route path="/vendor/inventory">
        <ProtectedRoute component={VendorInventory} allowedRoles={['vendor']} />
      </Route>
      <Route path="/customer">
        <ProtectedRoute component={CustomerHome} allowedRoles={['customer']} />
      </Route>
      <Route path="/share/:code" component={ShareView} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Router;
