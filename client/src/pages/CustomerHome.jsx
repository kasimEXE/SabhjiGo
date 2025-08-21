import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import NavBar from "../components/NavBar";
import ConsentToggles from "../components/ConsentToggles";
import SocietySelector from "../components/SocietySelector";

function CustomerHome() {
  const [user] = useAuthState(auth);
  const [activeVendors, setActiveVendors] = useState([]);

  // TODO: Fetch active vendors from Firestore
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.displayName || 'Customer'}!
              </h1>
              <p className="text-gray-600">Sunshine Apartments, Kothrud</p>
            </div>
            <div className="flex items-center space-x-4">
              <SocietySelector />
              <button className="p-2 text-gray-500 hover:text-green-500 transition-colors">
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>

          {/* Active Vendors */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendors Near You</h2>
            {activeVendors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-truck text-4xl mb-4 text-gray-300"></i>
                <p>No vendors are currently active in your area.</p>
                <p className="text-sm">Check back later or enable notifications to get alerts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* TODO: Replace with actual vendor data */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-truck text-white"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Vendor nearby (sample)</h3>
                        <p className="text-gray-600 text-sm">ETA: 15 minutes</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            <i className="fas fa-circle text-green-500 text-xs mr-1"></i>
                            En Route
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors">
                        View Inventory
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Settings */}
          <ConsentToggles />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-green-500 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Vendors</h3>
            <p className="text-gray-600 text-sm mb-4">Search for vendors in your area</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors">
              Search Now
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bell text-orange-500 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
            <p className="text-gray-600 text-sm mb-4">Manage your alert preferences</p>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors">
              Settings
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-history text-blue-500 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order History</h3>
            <p className="text-gray-600 text-sm mb-4">View your past purchases</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
              View History
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomerHome;
