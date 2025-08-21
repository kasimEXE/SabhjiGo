import { Switch, Route } from "wouter";
import Landing from "./pages/Landing";
import VendorDashboard from "./pages/VendorDashboard";
import VendorInventory from "./pages/VendorInventory";
import CustomerHome from "./pages/CustomerHome";
import ShareView from "./pages/ShareView";
import NotFound from "./pages/not-found";

function Router({ user }) {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/vendor" component={VendorDashboard} />
      <Route path="/vendor/inventory" component={VendorInventory} />
      <Route path="/customer" component={CustomerHome} />
      <Route path="/share/:code" component={ShareView} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Router;
