import { useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";

function DemoAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInDemo = async (role = 'customer') => {
    setLoading(true);
    setError("");
    
    try {
      // Sign in anonymously for demo purposes
      const result = await signInAnonymously(auth);
      
      // Set display name to indicate demo mode
      const displayName = role === 'vendor' ? 'Demo Vendor' : 'Demo Customer';
      
      console.log('Demo sign-in successful:', displayName);
      
      // User will be automatically redirected by AuthGate
    } catch (error) {
      if (error.code === 'auth/configuration-not-found') {
        setError("Demo mode requires Anonymous Authentication to be enabled in Firebase Console.");
      } else {
        setError("Demo sign-in failed: " + error.message);
      }
      console.error("Demo auth error:", error);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg border-2 border-blue-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-play text-blue-500 text-xl"></i>
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-gray-900">Demo Mode</h3>
        <p className="text-gray-600">Try SabhjiGo without setting up authentication</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-red-500 text-xs mt-1">
            Enable Anonymous Authentication in Firebase Console to use demo mode
          </p>
        </div>
      )}

      <div className="space-y-3">
        <button 
          onClick={() => signInDemo('customer')}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Try as Customer'}
        </button>

        <button 
          onClick={() => signInDemo('vendor')}
          disabled={loading}
          className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Try as Vendor'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Demo Features:</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Browse all app pages</li>
          <li>• Test privacy settings</li>
          <li>• Try society selection</li>
          <li>• View inventory management</li>
          <li>• Test offline functionality</li>
        </ul>
      </div>
    </div>
  );
}

export default DemoAuth;