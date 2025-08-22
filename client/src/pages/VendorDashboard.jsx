import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import NavBar from "../components/NavBar";
import RouteControls from "../components/RouteControls";
import { Link } from "wouter";
import { getTodayRoute } from "../data/routes";
import { useToast } from "../hooks/use-toast.ts";

function VendorDashboard() {
  const [user] = useAuthState(auth);
  const [todayRoute, setTodayRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [routeStats, setRouteStats] = useState({
    totalSocieties: 0,
    completed: 0,
    todaySales: 0
  });
  const { toast } = useToast();

  // Fetch today's route data
  useEffect(() => {
    const fetchTodayRoute = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Use demo vendor ID or derive from user
        const vendorId = user.uid.includes('demo') ? 'vendor-ramesh' : user.uid;
        const route = await getTodayRoute(vendorId);
        setTodayRoute(route);
        
        // Update stats based on route
        if (route) {
          const totalSocieties = route.waypoints?.length || 0;
          const completed = route.waypoints?.filter(w => w.status === 'completed').length || 0;
          setRouteStats({
            totalSocieties,
            completed,
            todaySales: Math.floor(Math.random() * 5000) + 1000 // Mock sales data
          });
        }
      } catch (error) {
        console.error('Error fetching today route:', error);
        toast({
          title: "Error",
          description: "Failed to load today's route data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayRoute();
  }, [user, toast]);

  const handleRouteUpdate = (updatedRoute) => {
    setTodayRoute(updatedRoute);
    // Update stats if needed
    if (updatedRoute.waypoints) {
      const completed = updatedRoute.waypoints.filter(w => w.status === 'completed').length;
      setRouteStats(prev => ({ ...prev, completed }));
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vendor Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.displayName || "Vendor Dashboard"}
                </h1>
                <p className="text-gray-600">Vehicle: Auto Rickshaw</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                onClick={() => {
                  if (todayRoute) {
                    const shareUrl = `${window.location.origin}/share/demo-share-123`;
                    navigator.clipboard.writeText(shareUrl);
                    toast({
                      title: "Share Link Copied",
                      description: "Route share link copied to clipboard",
                      variant: "success"
                    });
                  }
                }}
                data-testid="button-share-route"
              >
                <i className="fas fa-share-alt mr-2"></i>Share
              </button>
            </div>
          </div>

          {/* Route Statistics */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">{routeStats.totalSocieties}</div>
              <p className="text-gray-600">Societies Today</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">{routeStats.completed}</div>
              <p className="text-gray-600">Completed</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">₹{routeStats.todaySales}</div>
              <p className="text-gray-600">Today's Sales</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/vendor/inventory" className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-list text-green-500 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Inventory</h3>
                <p className="text-gray-600">Update prices and availability</p>
              </div>
            </div>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-route text-blue-500 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Route Planning</h3>
                <p className="text-gray-600">Plan your daily routes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Controls */}
        <div className="mb-8">
          <RouteControls 
            route={todayRoute} 
            onRouteUpdate={handleRouteUpdate}
            isVendor={true}
          />
        </div>

        {/* Today's Route Details */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Route</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-2 text-gray-600">Loading route...</span>
            </div>
          ) : todayRoute && todayRoute.waypoints ? (
            <div className="space-y-4">
              {todayRoute.waypoints.map((waypoint, index) => {
                const getWaypointColor = (status) => {
                  switch (status) {
                    case 'completed': return 'green';
                    case 'current': return 'orange';
                    case 'enroute': return 'blue';
                    default: return 'gray';
                  }
                };
                
                const color = getWaypointColor(waypoint.status);
                
                return (
                  <div key={index} className={`bg-gray-50 rounded-lg p-4 border-l-4 border-${color}-500`} data-testid={`waypoint-${waypoint.societyId}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center`}>
                          <i className={`fas ${waypoint.status === 'completed' ? 'fa-check' : waypoint.status === 'current' ? 'fa-truck' : 'fa-clock'} text-${color}-500 text-sm`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{waypoint.societyName}</p>
                          <p className="text-gray-600 text-sm">
                            {waypoint.status === 'completed' ? 'Completed' : 
                             waypoint.etaISO ? `ETA: ${new Date(waypoint.etaISO).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 
                             'Scheduled'} 
                            {waypoint.estimatedDuration && ` (${waypoint.estimatedDuration} min)`}
                          </p>
                        </div>
                      </div>
                      <span className={`bg-${color}-100 text-${color}-800 px-3 py-1 rounded-full text-xs font-medium capitalize`}>
                        {waypoint.status === 'current' ? 'En Route' : waypoint.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-route text-gray-400 text-xl"></i>
              </div>
              <p className="text-gray-600 mb-4">No route found for today</p>
              <p className="text-gray-500 text-sm">Use the Database Seeder to create sample route data</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default VendorDashboard;
