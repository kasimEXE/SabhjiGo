import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useLocation } from "wouter";

function NavBar() {
  const [user] = useAuthState(auth);
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navLinks = user ? [
    { href: '/customer', label: 'Home', icon: 'fa-home' },
    { href: '/vendor', label: 'Vendor', icon: 'fa-truck' },
    { href: '/vendor/inventory', label: 'Inventory', icon: 'fa-list' }
  ] : [
    { href: '/', label: 'Home', icon: 'fa-home' }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-leaf text-white text-sm"></i>
            </div>
            <span className="text-xl font-semibold text-gray-900">SabhjiGo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  location === link.href 
                    ? 'bg-green-100 text-green-600' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <i className={`fas ${link.icon} text-sm`}></i>
                <span>{link.label}</span>
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm">
                  {user.displayName || user.email || user.phoneNumber}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-gray-700`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    location === link.href 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={`fas ${link.icon}`}></i>
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {user ? (
                <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-4">
                  <div className="text-gray-600 text-sm mb-2">
                    {user.displayName || user.email || user.phoneNumber}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-4">
                  <button 
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
