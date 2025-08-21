import { useState, useEffect } from "react";

function AuthStatusBanner() {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i className="fas fa-info text-sm"></i>
          </div>
          <div>
            <p className="font-medium">Firebase Authentication Setup Required</p>
            <p className="text-blue-100 text-sm">
              Enable Anonymous Authentication in Firebase Console for demo mode, or use Local Development Mode to test all features
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a 
            href="https://console.firebase.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Open Firebase Console
          </a>
          <button 
            onClick={() => setShowBanner(false)}
            className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthStatusBanner;