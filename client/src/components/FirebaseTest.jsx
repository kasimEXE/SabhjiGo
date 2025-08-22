import { useState } from "react";
import { signInAnonymously, signOut } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { validateFirebaseConfig } from "../utils/configValidator";

function FirebaseTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    // Test 0: Configuration Validation
    const configValidation = validateFirebaseConfig();
    results.configValidation = configValidation;

    if (!configValidation.isValid) {
      setTestResults(results);
      setLoading(false);
      return;
    }

    // Test 1: Anonymous Authentication
    try {
      const userCredential = await signInAnonymously(auth);
      results.anonymousAuth = {
        success: true,
        message: `Signed in as ${userCredential.user.uid}`,
        uid: userCredential.user.uid
      };
      
      // Test 2: Firestore Write (if auth works)
      try {
        const docRef = await addDoc(collection(db, 'test'), {
          message: 'Firebase test successful',
          timestamp: Date.now(),
          uid: userCredential.user.uid
        });
        results.firestoreWrite = {
          success: true,
          message: `Document written with ID: ${docRef.id}`
        };
        
        // Test 3: Firestore Read
        try {
          const querySnapshot = await getDocs(collection(db, 'test'));
          results.firestoreRead = {
            success: true,
            message: `Read ${querySnapshot.size} documents`
          };
        } catch (readError) {
          results.firestoreRead = {
            success: false,
            message: readError.message,
            code: readError.code
          };
        }
        
      } catch (writeError) {
        results.firestoreWrite = {
          success: false,
          message: writeError.message,
          code: writeError.code
        };
      }
      
      // Clean up - sign out
      await signOut(auth);
      
    } catch (authError) {
      results.anonymousAuth = {
        success: false,
        message: authError.message,
        code: authError.code
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="bg-white border rounded-lg p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Firebase Configuration Test</h3>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Firebase Tests'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          {testResults.configValidation && (
            <div className={`p-4 rounded-lg ${
              testResults.configValidation.isValid 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            } border`}>
              <h4 className="font-medium mb-2">
                <i className={`fas ${testResults.configValidation.isValid ? 'fa-check' : 'fa-times'} mr-2`}></i>
                Firebase Configuration
              </h4>
              {testResults.configValidation.isValid ? (
                <p className="text-sm text-green-700">All configuration values are properly set</p>
              ) : (
                <div className="text-sm">
                  {testResults.configValidation.errors.map((error, index) => (
                    <p key={index} className="text-red-700">• {error}</p>
                  ))}
                  <p className="text-red-600 mt-2 font-medium">
                    Please follow the setup guide to configure your Firebase environment variables.
                  </p>
                </div>
              )}
            </div>
          )}

          {testResults.anonymousAuth && (
            <div className={`p-4 rounded-lg ${
              testResults.anonymousAuth?.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            } border`}>
            <h4 className="font-medium mb-2">
              <i className={`fas ${testResults.anonymousAuth?.success ? 'fa-check' : 'fa-times'} mr-2`}></i>
              Anonymous Authentication
            </h4>
            <p className="text-sm">{testResults.anonymousAuth?.message}</p>
            {testResults.anonymousAuth?.code && (
              <p className="text-xs text-gray-500">Error code: {testResults.anonymousAuth.code}</p>
            )}
          </div>
          )}

          {testResults.firestoreWrite && (
            <div className={`p-4 rounded-lg ${
              testResults.firestoreWrite?.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            } border`}>
              <h4 className="font-medium mb-2">
                <i className={`fas ${testResults.firestoreWrite?.success ? 'fa-check' : 'fa-times'} mr-2`}></i>
                Firestore Write
              </h4>
              <p className="text-sm">{testResults.firestoreWrite?.message}</p>
              {testResults.firestoreWrite?.code && (
                <p className="text-xs text-gray-500">Error code: {testResults.firestoreWrite.code}</p>
              )}
            </div>
          )}

          {testResults.firestoreRead && (
            <div className={`p-4 rounded-lg ${
              testResults.firestoreRead?.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            } border`}>
              <h4 className="font-medium mb-2">
                <i className={`fas ${testResults.firestoreRead?.success ? 'fa-check' : 'fa-times'} mr-2`}></i>
                Firestore Read
              </h4>
              <p className="text-sm">{testResults.firestoreRead?.message}</p>
              {testResults.firestoreRead?.code && (
                <p className="text-xs text-gray-500">Error code: {testResults.firestoreRead.code}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FirebaseTest;