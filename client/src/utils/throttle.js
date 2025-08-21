// Haversine distance calculation
export const haversine = (point1, point2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = point1.lat * Math.PI / 180;
  const φ2 = point2.lat * Math.PI / 180;
  const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
  const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

// Throttle location updates by time and distance
export const throttleByTimeAndDistance = (previousLocation, newLocation, minMs = 20000, minMeters = 30) => {
  if (!previousLocation) {
    return true; // Allow first location update
  }

  const now = Date.now();
  const timeDiff = now - previousLocation.timestamp;
  
  // Always allow update if minimum time has passed
  if (timeDiff >= minMs) {
    return true;
  }

  // Check distance if locations are available
  if (previousLocation.lat && previousLocation.lng && newLocation.lat && newLocation.lng) {
    const distance = haversine(
      { lat: previousLocation.lat, lng: previousLocation.lng },
      { lat: newLocation.lat, lng: newLocation.lng }
    );
    
    // Allow update if distance threshold is met
    if (distance >= minMeters) {
      return true;
    }
  }

  return false; // Throttle the update
};

// General purpose throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Debounce function for search inputs, etc.
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
