import { useState } from "react";
import { signInAnonymously, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { validateFirebaseConfig } from "../utils/configValidator";

function FirebaseDebugger() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const results = {};

    // Step 1: Configuration Check
    console.log("🔧 Checking Firebase configuration...");
    const configValidation = validateFirebaseConfig();
    results.config = configValidation;
    
    // Step 2: Show current config values (safe display)
    results.configDisplay = {
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "❌ Missing",
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Present" : "❌ Missing",
      appId: import.meta.env.VITE_FIREBASE_APP_ID ? "✅ Present" : "❌ Missing", 
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? "✅ Present" : "❌ Missing"
    };

    if (!configValidation.isValid) {
      setTestResults(results);
      setLoading(false);
      return;
    }

    // Step 3: Test Firebase App Initialization
    try {
      console.log("🔥 Testing Firebase app initialization...");
      results.firebaseApp = {
        success: true,
        message: "Firebase app initialized successfully"
      };
    } catch (error) {
      results.firebaseApp = {
        success: false,
        message: error.message,
        code: error.code
      };
      setTestResults(results);
      setLoading(false);
      return;
    }

    // Step 4: Test Anonymous Authentication
    try {
      console.log("🔐 Testing Anonymous Authentication...");
      const userCredential = await signInAnonymously(auth);
      results.auth = {
        success: true,
        message: `Authentication successful`,
        uid: userCredential.user.uid
      };

      // Step 5: Test Firestore Connection with simple write
      try {
        console.log("💾 Testing Firestore connection...");
        const testDocRef = doc(db, 'debug', 'connection-test');
        await setDoc(testDocRef, {
          test: true,
          timestamp: Date.now(),
          message: "Connection test"
        });
        
        results.firestore = {
          success: true,
          message: "Firestore write successful - connection working!"
        };

        // Step 6: Test user document creation (the actual goal)
        try {
          console.log("👤 Testing user document creation...");
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          const userData = {
            uid: userCredential.user.uid,
            role: 'customer',
            phone: userCredential.user.phoneNumber || null,
            email: userCredential.user.email || null,
            displayName: 'Debug Test User',
            societies: [],
            vendorId: null,
            consent: {
              sms: false,
              location: false,
              dataCollection: true,
              updatedAt: Date.now()
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
          };

          await setDoc(userDocRef, userData);
          results.userDoc = {
            success: true,
            message: "User document created successfully!",
            documentPath: `users/${userCredential.user.uid}`,
            userData: userData
          };

        } catch (userDocError) {
          results.userDoc = {
            success: false,
            message: userDocError.message,
            code: userDocError.code
          };
        }

      } catch (firestoreError) {
        results.firestore = {
          success: false,
          message: firestoreError.message,
          code: firestoreError.code
        };
      }

      // Clean up
      await signOut(auth);

    } catch (authError) {
      results.auth = {
        success: false,
        message: authError.message,
        code: authError.code
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="bg-white border rounded-lg p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Firebase Connection Diagnostics</h3>
      
      <button
        onClick={runDiagnostics}
        disabled={loading}
        className="mb-6 bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
        data-testid="button-run-diagnostics"
      >
        {loading ? '🔍 Running Diagnostics...' : '🔍 Run Full Diagnostics'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-6">
          
          {/* Configuration Status */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-medium mb-3">📋 Configuration Status</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Project ID:</strong> {testResults.configDisplay?.projectId}
              </div>
              <div>
                <strong>API Key:</strong> {testResults.configDisplay?.apiKey}
              </div>
              <div>
                <strong>App ID:</strong> {testResults.configDisplay?.appId}
              </div>
              <div>
                <strong>Messaging Sender:</strong> {testResults.configDisplay?.messagingSenderId}
              </div>
            </div>
            
            {testResults.config && !testResults.config.isValid && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 font-medium">Configuration Errors:</p>
                <ul className="text-red-600 text-sm mt-1">
                  {testResults.config.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Step by step results */}
          {testResults.firebaseApp && (
            <div className={`p-4 rounded-lg border ${
              testResults.firebaseApp.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h4 className="font-medium mb-2">
                {testResults.firebaseApp.success ? '✅' : '❌'} Firebase App Initialization
              </h4>
              <p className="text-sm">{testResults.firebaseApp.message}</p>
            </div>
          )}

          {testResults.auth && (
            <div className={`p-4 rounded-lg border ${
              testResults.auth.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h4 className="font-medium mb-2">
                {testResults.auth.success ? '✅' : '❌'} Anonymous Authentication
              </h4>
              <p className="text-sm">{testResults.auth.message}</p>
              {testResults.auth.code && (
                <p className="text-xs text-gray-500 mt-1">Error code: {testResults.auth.code}</p>
              )}
            </div>
          )}

          {testResults.firestore && (
            <div className={`p-4 rounded-lg border ${
              testResults.firestore.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h4 className="font-medium mb-2">
                {testResults.firestore.success ? '✅' : '❌'} Firestore Connection
              </h4>
              <p className="text-sm">{testResults.firestore.message}</p>
              {testResults.firestore.code && (
                <p className="text-xs text-gray-500 mt-1">Error code: {testResults.firestore.code}</p>
              )}
            </div>
          )}

          {testResults.userDoc && (
            <div className={`p-4 rounded-lg border ${
              testResults.userDoc.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h4 className="font-medium mb-2">
                {testResults.userDoc.success ? '✅' : '❌'} User Document Creation
              </h4>
              <p className="text-sm">{testResults.userDoc.message}</p>
              {testResults.userDoc.documentPath && (
                <p className="text-xs text-gray-600 mt-1">Path: {testResults.userDoc.documentPath}</p>
              )}
              {testResults.userDoc.success && testResults.userDoc.userData && (
                <details className="mt-3">
                  <summary className="text-sm font-medium cursor-pointer">View Document Structure</summary>
                  <pre className="mt-2 p-3 bg-white border rounded text-xs overflow-auto" data-testid="text-document-structure">
                    {JSON.stringify(testResults.userDoc.userData, null, 2)}
                  </pre>
                </details>
              )}
              {testResults.userDoc.code && (
                <p className="text-xs text-gray-500 mt-1">Error code: {testResults.userDoc.code}</p>
              )}
            </div>
          )}

          {/* Troubleshooting Guide */}
          {testResults.firestore && !testResults.firestore.success && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">🔧 Troubleshooting Steps</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>1. Verify your Firebase project exists and is active</li>
                <li>2. Check that Firestore database is created (Go to Firebase Console → Firestore Database)</li>
                <li>3. Ensure Firestore is in "Test mode" or rules allow access</li>
                <li>4. Confirm your domain is added to Firebase authorized domains</li>
                <li>5. Verify all environment variables are correctly set</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FirebaseDebugger;