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
          // For demo mode, check localStorage first for immediate role
          const demoRole = localStorage.getItem('demo_user_role');
          
          // Wait a bit for user document to be created/updated if this is a fresh login
          if (user.isAnonymous && demoRole) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
          const userData = await getUserData(user.uid);
          const role = userData?.role || demoRole || 'customer';
          console.log('Detected user role:', role, 'from userData:', userData?.role, 'demoRole:', demoRole);
          setUserRole(role);
        } catch (error) {
          console.error('Error loading user role:', error);
          // Fallback to demo role or customer
          const demoRole = localStorage.getItem('demo_user_role');
          setUserRole(demoRole || 'customer');
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
    console.log(`Redirecting user with role '${userRole}' to ${redirectPath}`);
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
