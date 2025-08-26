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
          
          // Wait longer for user document to be updated if this is a demo login
          if (user.isAnonymous && demoRole) {
            console.log(`Routes: Waiting for demo role ${demoRole} to be updated in Firestore...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Try multiple times to get updated user data
            let userData = null;
            let attempts = 0;
            const maxAttempts = 5;
            
            while (attempts < maxAttempts) {
              userData = await getUserData(user.uid);
              console.log(`Routes: Attempt ${attempts + 1} - userData role: ${userData?.role}, demo role: ${demoRole}`);
              
              if (userData?.role === demoRole) {
                break; // Role has been updated successfully
              }
              
              attempts++;
              if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
            
            const role = userData?.role || demoRole;
            console.log('Routes: Final detected user role:', role, 'from userData:', userData?.role, 'demoRole:', demoRole);
            setUserRole(role);
          } else {
            const userData = await getUserData(user.uid);
            const role = userData?.role || 'customer';
            console.log('Routes: Normal user role:', role, 'from userData:', userData?.role);
            setUserRole(role);
          }
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
