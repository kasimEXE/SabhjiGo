import { useState } from "react";
import NavBar from "../components/NavBar";
import PhoneSignIn from "../components/PhoneSignIn";
import EmailSignIn from "../components/EmailSignIn";
import DemoAuth from "../components/DemoAuth";
import FirebaseStatus from "../components/FirebaseStatus";

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 to-green-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Fresh Vegetables
                <span className="block text-orange-400">Delivered to Your Society</span>
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Connect with local vendors in Pune. Get fresh vegetables delivered directly to your apartment society with real-time tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-orange-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-lg">
                  Find Vendors Near You
                </button>
                <button className="bg-white/20 text-white px-8 py-4 rounded-lg font-medium hover:bg-white/30 transition-colors border border-white/30">
                  I'm a Vendor
                </button>
              </div>
            </div>
            
            {/* Phone Mockup */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-4 shadow-2xl max-w-sm mx-auto">
                <div className="bg-gray-50 rounded-2xl overflow-hidden">
                  <div className="bg-green-500 text-white p-4 text-center">
                    <h3 className="font-semibold">Today's Fresh Arrivals</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {['Carrots - ₹40/kg', 'Green Chillies - ₹60/kg', 'Spinach - ₹25/bundle'].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-leaf text-green-500"></i>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.split(' - ')[0]}</p>
                            <p className="text-xs text-gray-500">{item.split(' - ')[1]}</p>
                          </div>
                        </div>
                        <button className="bg-green-500 text-white px-3 py-1 rounded text-xs">Add</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How SabhjiGo Works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Simple, efficient, and designed for the modern apartment society lifestyle
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'map-marker-alt', title: 'Track Vendors', desc: 'See real-time location of vegetable vendors serving your society', color: 'green' },
              { icon: 'shopping-cart', title: 'Browse Inventory', desc: 'View fresh produce and prices updated in real-time by vendors', color: 'orange' },
              { icon: 'bell', title: 'Get Notified', desc: 'Receive alerts when vendors are approaching your society', color: 'blue' }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <i className={`fas fa-${feature.icon} text-${feature.color}-500 text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Get Started Today</h2>
            <p className="text-gray-600 text-lg">
              Sign up as a customer or vendor to start using SabhjiGo
            </p>
          </div>
          
          <FirebaseStatus />
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <PhoneSignIn />
            <EmailSignIn />
            <DemoAuth />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-leaf text-white text-sm"></i>
                </div>
                <span className="text-xl font-semibold">SabhjiGo</span>
              </div>
              <p className="text-gray-300">
                Connecting apartment societies with fresh vegetable vendors in Pune.
              </p>
            </div>
            
            {[
              { title: 'For Customers', links: ['Track Vendors', 'Browse Inventory', 'Get Notifications'] },
              { title: 'For Vendors', links: ['Start Selling', 'Manage Routes', 'Update Inventory'] },
              { title: 'Support', links: ['Help Center', 'Contact Us', 'Privacy Policy'] }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-gray-300">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 SabhjiGo. All rights reserved. Made for Pune apartment societies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
