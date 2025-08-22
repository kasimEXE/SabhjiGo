import { useState } from "react";
import { updateRouteStatus, updateRouteLocation } from "../data/routes";
import { throttle } from "../utils/throttle";
import { useToast } from "../hooks/use-toast.ts";

// Mock location generator with jitter
const generateMockLocation = (baseLocation) => {
  const jitterRange = 0.001; // ~100m radius
  const lat = baseLocation?.lat || 18.5074;
  const lng = baseLocation?.lng || 73.8077;
  
  return {
    lat: lat + (Math.random() - 0.5) * jitterRange,
    lng: lng + (Math.random() - 0.5) * jitterRange,
    accuracy: Math.floor(Math.random() * 15) + 5 // 5-20m accuracy
  };
};

// Throttled location update (every 30 seconds)
const throttledLocationUpdate = throttle(async (routeId, location) => {
  try {
    await updateRouteLocation(routeId, location);
    console.log('Location updated:', location);
  } catch (error) {
    console.error('Failed to update location:', error);
  }
}, 30000);

// Valid status transitions
const STATUS_TRANSITIONS = {
  idle: ['enroute'],
  enroute: ['paused', 'completed'],
  paused: ['enroute', 'completed'],
  completed: [], // Terminal state
  active: ['enroute'], // Legacy status
};

function RouteControls({ route, onRouteUpdate, isVendor = false }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLocationUpdating, setIsLocationUpdating] = useState(false);
  const { toast } = useToast();

  if (!route) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-800 text-sm">
          <i className="fas fa-info-circle mr-2"></i>
          No route found for today. Create a route to start tracking.
        </p>
      </div>
    );
  }

  const currentStatus = route.status || 'idle';
  const canTransitionTo = STATUS_TRANSITIONS[currentStatus] || [];

  const handleStatusChange = async (newStatus) => {
    if (!canTransitionTo.includes(newStatus)) {
      toast({
        title: "Invalid Action",
        description: `Cannot change from ${currentStatus} to ${newStatus}`,
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateRouteStatus(route.id, newStatus);
      
      // Update local state
      if (onRouteUpdate) {
        onRouteUpdate({ ...route, status: newStatus });
      }

      toast({
        title: "Route Updated",
        description: `Status changed to ${newStatus}`,
        variant: "success"
      });

      // Start location tracking if route is active
      if (newStatus === 'enroute' && isVendor) {
        handleLocationUpdate();
      }

    } catch (error) {
      console.error('Error updating route status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update route status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLocationUpdate = async () => {
    if (!isVendor || currentStatus !== 'enroute') return;

    setIsLocationUpdating(true);
    try {
      const newLocation = generateMockLocation(route.lastLocation);
      
      // Use throttled update to prevent spam
      await throttledLocationUpdate(route.id, newLocation);
      
      // Update local state immediately for better UX
      if (onRouteUpdate) {
        onRouteUpdate({ 
          ...route, 
          lastLocation: { ...newLocation, ts: new Date() }
        });
      }

      toast({
        title: "Location Updated",
        description: `Position updated (±${newLocation.accuracy}m accuracy)`,
        variant: "success"
      });

    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Location Update Failed",
        description: "Failed to update location. Will retry automatically.",
        variant: "destructive"
      });
    } finally {
      setIsLocationUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'idle': return 'fa-clock';
      case 'enroute': return 'fa-route';
      case 'paused': return 'fa-pause';
      case 'completed': return 'fa-check-circle';
      case 'active': return 'fa-play'; // Legacy
      default: return 'fa-question';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'idle': return 'gray';
      case 'enroute': return 'green';
      case 'paused': return 'yellow';
      case 'completed': return 'blue';
      case 'active': return 'orange'; // Legacy
      default: return 'gray';
    }
  };

  const getActionButton = () => {
    if (!isVendor) return null;

    switch (currentStatus) {
      case 'idle':
      case 'active': // Legacy support
        return (
          <button
            onClick={() => handleStatusChange('enroute')}
            disabled={isUpdating}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            data-testid="button-start-route"
          >
            {isUpdating ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Starting...
              </span>
            ) : (
              <>
                <i className="fas fa-play mr-2"></i>Start Route
              </>
            )}
          </button>
        );

      case 'enroute':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange('paused')}
              disabled={isUpdating}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
              data-testid="button-pause-route"
            >
              <i className="fas fa-pause mr-2"></i>Pause
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={isUpdating}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              data-testid="button-complete-route"
            >
              <i className="fas fa-check mr-2"></i>Complete
            </button>
          </div>
        );

      case 'paused':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange('enroute')}
              disabled={isUpdating}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
              data-testid="button-resume-route"
            >
              <i className="fas fa-play mr-2"></i>Resume
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={isUpdating}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              data-testid="button-complete-route"
            >
              <i className="fas fa-check mr-2"></i>Complete
            </button>
          </div>
        );

      case 'completed':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              <i className="fas fa-check-circle mr-2"></i>
              Route completed successfully
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Route Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-${getStatusColor(currentStatus)}-100 rounded-full flex items-center justify-center`}>
            <i className={`fas ${getStatusIcon(currentStatus)} text-${getStatusColor(currentStatus)}-500`}></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Route Status</h3>
            <p className="text-gray-600 text-sm capitalize">{currentStatus}</p>
          </div>
        </div>
        
        {route.lastLocation && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Update</p>
            <p className="text-xs text-gray-400">
              {route.lastLocation.ts ? new Date(route.lastLocation.ts.toDate ? route.lastLocation.ts.toDate() : route.lastLocation.ts).toLocaleTimeString() : 'Unknown'}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {getActionButton()}
        
        {/* Location Update Button - Only for active routes */}
        {isVendor && currentStatus === 'enroute' && (
          <button
            onClick={handleLocationUpdate}
            disabled={isLocationUpdating}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            data-testid="button-update-location"
          >
            {isLocationUpdating ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Updating...
              </span>
            ) : (
              <>
                <i className="fas fa-map-marker-alt mr-2"></i>Update Location
              </>
            )}
          </button>
        )}
      </div>

      {/* Status Transition Help */}
      {isVendor && canTransitionTo.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Available actions: {canTransitionTo.map(status => 
              <span key={status} className="capitalize bg-gray-100 px-2 py-1 rounded ml-1">{status}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default RouteControls;