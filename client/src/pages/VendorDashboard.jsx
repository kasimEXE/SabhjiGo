import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import NavBar from "../components/NavBar";
import { Link } from "wouter";

function VendorDashboard() {
  const [user] = useAuthState(auth);
  const [routeStats, setRouteStats] = useState({
    totalSocieties: 0,
    completed: 0,
    todaySales: 0
  });

  // TODO: Fetch vendor data and route information from Firestore
  
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
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
                Start Route
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
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
          <Link href="/vendor/inventory">
            <a className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-list text-green-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Manage Inventory</h3>
                  <p className="text-gray-600">Update prices and availability</p>
                </div>
              </div>
            </a>
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

        {/* Today's Route */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Route</h2>
          <div className="space-y-4">
            {/* TODO: Replace with actual route data from Firestore */}
            {[
              { name: 'Sunshine Apartments', status: 'completed', time: '9:30 AM', color: 'green' },
              { name: 'Green Valley Society', status: 'current', time: '10:45 AM', color: 'orange' },
              { name: 'Royal Residency', status: 'pending', time: '11:30 AM', color: 'gray' }
            ].map((waypoint, index) => (
              <div key={index} className={`bg-gray-50 rounded-lg p-4 border-l-4 border-${waypoint.color}-500`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-${waypoint.color}-100 rounded-full flex items-center justify-center`}>
                      <i className={`fas ${waypoint.status === 'completed' ? 'fa-check' : waypoint.status === 'current' ? 'fa-truck' : 'fa-clock'} text-${waypoint.color}-500 text-sm`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{waypoint.name}</p>
                      <p className="text-gray-600 text-sm">
                        {waypoint.status === 'completed' ? `Completed at ${waypoint.time}` : 
                         waypoint.status === 'current' ? `ETA: ${waypoint.time}` : 
                         `Scheduled: ${waypoint.time}`}
                      </p>
                    </div>
                  </div>
                  <span className={`bg-${waypoint.color}-100 text-${waypoint.color}-800 px-3 py-1 rounded-full text-xs font-medium capitalize`}>
                    {waypoint.status === 'current' ? 'En Route' : waypoint.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default VendorDashboard;
