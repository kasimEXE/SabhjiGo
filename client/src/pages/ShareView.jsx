import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { getGroupShare } from "../data/routes";

function ShareView() {
  const [match, params] = useRoute("/share/:code");
  const [shareData, setShareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadShareData = async () => {
      if (!params?.code) return;
      
      try {
        const data = await getGroupShare(params.code);
        if (data) {
          setShareData(data);
        } else {
          setError('Share link not found or expired');
        }
      } catch (err) {
        setError('Failed to load shared route');
        console.error('Error loading share data:', err);
      }
      setLoading(false);
    };

    loadShareData();
  }, [params?.code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared route...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Share Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-leaf text-white text-sm"></i>
              </div>
              <span className="text-xl font-semibold text-gray-900">SabhjiGo</span>
            </div>
            <span className="text-sm text-gray-500">Shared Route</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-share-alt text-green-500 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {shareData?.vendorName || "Vendor Route"}
            </h1>
            <p className="text-gray-600">Live route shared by your society</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 mt-2">
              <i className="fas fa-circle text-green-500 text-xs mr-2"></i>
              Currently En Route
            </div>
          </div>

          {/* Route Progress */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Route Progress</h2>
            <div className="space-y-4">
              {/* TODO: Replace with actual route waypoints */}
              {[
                { name: 'Sunshine Apartments', status: 'completed', time: '9:30 AM' },
                { name: 'Green Valley Society', status: 'current', time: '10:45 AM' },
                { name: 'Royal Residency', status: 'pending', time: '11:30 AM' }
              ].map((waypoint, index) => (
                <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg border ${
                  waypoint.status === 'completed' ? 'bg-green-50 border-green-200' :
                  waypoint.status === 'current' ? 'bg-orange-50 border-orange-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    waypoint.status === 'completed' ? 'bg-green-500' :
                    waypoint.status === 'current' ? 'bg-orange-500' :
                    'bg-gray-300'
                  }`}>
                    <i className={`fas ${
                      waypoint.status === 'completed' ? 'fa-check' :
                      waypoint.status === 'current' ? 'fa-truck' :
                      'fa-clock'
                    } text-white text-sm`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{waypoint.name}</p>
                    <p className="text-gray-600 text-sm">
                      {waypoint.status === 'completed' ? `Visited at ${waypoint.time}` :
                       waypoint.status === 'current' ? `ETA: ${waypoint.time} (5 minutes away)` :
                       `Scheduled: ${waypoint.time}`}
                    </p>
                  </div>
                  <span className={`font-medium text-sm ${
                    waypoint.status === 'completed' ? 'text-green-600' :
                    waypoint.status === 'current' ? 'text-orange-600' :
                    'text-gray-500'
                  }`}>
                    {waypoint.status === 'current' ? 'Current Stop' : 
                     waypoint.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Items */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* TODO: Replace with actual inventory data */}
              {[
                { name: 'Carrots', price: '₹40/kg', icon: 'fa-carrot' },
                { name: 'Green Chillies', price: '₹60/kg', icon: 'fa-pepper-hot' },
                { name: 'Spinach', price: '₹25/bundle', icon: 'fa-seedling' },
                { name: 'Tomatoes', price: '₹35/kg', icon: 'fa-tomato' },
                { name: 'Onions', price: '₹30/kg', icon: 'fa-onion' },
                { name: 'Potatoes', price: '₹25/kg', icon: 'fa-potato' }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className={`fas ${item.icon || 'fa-leaf'} text-green-500`}></i>
                  </div>
                  <p className="font-medium text-sm text-gray-900">{item.name}</p>
                  <p className="text-gray-600 text-xs">{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Share Actions */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Share this route with your society members</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <i className="fas fa-copy mr-2"></i>Copy Link
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ShareView;
