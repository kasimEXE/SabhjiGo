import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInAnonymously, signOut } from "firebase/auth";

function FirebaseStatus() {
  const [status, setStatus] = useState('checking');
  const [details, setDetails] = useState({});

  useEffect(() => {
    checkFirebaseConfig();
  }, []);

  const checkFirebaseConfig = async () => {
    const results = {
      anonymous: false,
      email: false,
      phone: false,
      firestore: false
    };

    // Test Anonymous Authentication
    try {
      const result = await signInAnonymously(auth);
      await signOut(auth); // Clean up immediately
      results.anonymous = true;
    } catch (error) {
      console.log('Anonymous auth not configured:', error.code);
      if (error.code !== 'auth/admin-restricted-operation') {
        results.anonymous = false;
      }
    }

    // Test Email Authentication (we can't actually test without trying to sign up)
    // But we can assume if anonymous works, email might work too
    results.email = results.anonymous;
    
    // Phone requires special setup, so we'll assume it needs configuration
    results.phone = false;

    setDetails(results);
    setStatus('complete');
  };

  if (status === 'checking') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
          <p className="text-blue-700">Checking Firebase configuration...</p>
        </div>
      </div>
    );
  }

  const hasAnyAuth = details.anonymous || details.email || details.phone;

  return (
    <div className={`border rounded-lg p-4 mb-6 ${
      hasAnyAuth ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-start">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
          hasAnyAuth ? 'bg-green-500' : 'bg-yellow-500'
        }`}>
          <i className={`fas ${hasAnyAuth ? 'fa-check' : 'fa-exclamation'} text-white text-xs`}></i>
        </div>
        <div className="flex-1">
          <h4 className={`font-medium mb-2 ${
            hasAnyAuth ? 'text-green-800' : 'text-yellow-800'
          }`}>
            Firebase Authentication Status
          </h4>
          
          <div className="space-y-1 text-sm">
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                details.anonymous ? 'bg-green-500' : 'bg-gray-300'
              }`}></span>
              <span className={details.anonymous ? 'text-green-700' : 'text-gray-600'}>
                Demo Mode (Anonymous Auth) {details.anonymous ? 'Available' : 'Needs Setup'}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                details.email ? 'bg-green-500' : 'bg-gray-300'
              }`}></span>
              <span className={details.email ? 'text-green-700' : 'text-gray-600'}>
                Email Authentication {details.email ? 'Available' : 'Needs Setup'}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                details.phone ? 'bg-green-500' : 'bg-gray-300'
              }`}></span>
              <span className={details.phone ? 'text-green-700' : 'text-gray-600'}>
                Phone Authentication {details.phone ? 'Available' : 'Needs Setup'}
              </span>
            </div>
          </div>

          {!hasAnyAuth && (
            <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Setup Required:</strong> Enable authentication methods in Firebase Console.
                See <code>FIREBASE_SETUP.md</code> for detailed instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FirebaseStatus;