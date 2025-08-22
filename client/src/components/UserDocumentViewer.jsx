import { useState, useEffect, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../contexts/UserContext";

function UserDocumentViewer() {
  const user = useContext(UserContext);
  const [firestoreDoc, setFirestoreDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserDocument = async () => {
    if (!user?.uid) {
      setError("No user signed in");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Convert timestamps to readable format for display
        const displayData = {
          ...data,
          createdAt: data.createdAt ? 
            (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString()) 
            : null,
          updatedAt: data.updatedAt ? 
            (data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : new Date(data.updatedAt).toISOString()) 
            : null,
          consent: {
            ...data.consent,
            updatedAt: data.consent?.updatedAt ? 
              (data.consent.updatedAt.toDate ? data.consent.updatedAt.toDate().toISOString() : new Date(data.consent.updatedAt).toISOString()) 
              : null
          }
        };
        setFirestoreDoc(displayData);
      } else {
        setError("User document not found in Firestore");
      }
    } catch (err) {
      setError(`Error fetching document: ${err.message}`);
      console.error("Error fetching user document:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchUserDocument();
    }
  }, [user?.uid]);

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          User Document Verification
        </h3>
        <p className="text-yellow-700">
          Please sign in with email or phone to verify that a users/{'{'}uid{'}'} document is created automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Firestore User Document Verification</h3>
        <button
          onClick={fetchUserDocument}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          data-testid="button-refresh-document"
        >
          {loading ? 'Loading...' : 'Refresh Document'}
        </button>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          <strong>Current User UID:</strong> <code className="bg-white px-2 py-1 rounded">{user.uid}</code>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Document Path:</strong> <code className="bg-white px-2 py-1 rounded">users/{user.uid}</code>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {firestoreDoc && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">
              ✅ User Document Found in Firestore
            </h4>
            <p className="text-sm text-green-700">
              Document was automatically created when user signed in.
            </p>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-medium mb-3">Exact Firestore Document Structure:</h4>
            <pre className="bg-white border rounded p-4 text-sm overflow-auto" data-testid="text-document-structure">
              {JSON.stringify(firestoreDoc, null, 2)}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 mb-2">Required Fields Verification</h5>
              <ul className="text-sm space-y-1">
                <li className={`${firestoreDoc.role === 'customer' ? 'text-green-700' : 'text-red-700'}`}>
                  {firestoreDoc.role === 'customer' ? '✅' : '❌'} role: "{firestoreDoc.role}"
                </li>
                <li className={`${firestoreDoc.createdAt ? 'text-green-700' : 'text-red-700'}`}>
                  {firestoreDoc.createdAt ? '✅' : '❌'} createdAt: {firestoreDoc.createdAt ? 'present' : 'missing'}
                </li>
                <li className={`${firestoreDoc.updatedAt ? 'text-green-700' : 'text-red-700'}`}>
                  {firestoreDoc.updatedAt ? '✅' : '❌'} updatedAt: {firestoreDoc.updatedAt ? 'present' : 'missing'}
                </li>
                <li className={`${firestoreDoc.consent ? 'text-green-700' : 'text-red-700'}`}>
                  {firestoreDoc.consent ? '✅' : '❌'} consent: {firestoreDoc.consent ? 'object present' : 'missing'}
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="font-medium text-purple-800 mb-2">Consent Flags</h5>
              <ul className="text-sm space-y-1">
                <li>SMS: {firestoreDoc.consent?.sms ? '✅ true' : '❌ false'}</li>
                <li>Location: {firestoreDoc.consent?.location ? '✅ true' : '❌ false'}</li>
                {firestoreDoc.consent?.dataCollection !== undefined && (
                  <li>Data Collection: {firestoreDoc.consent.dataCollection ? '✅ true' : '❌ false'}</li>
                )}
                <li className="text-xs text-gray-600 mt-2">
                  Last Updated: {firestoreDoc.consent?.updatedAt || 'Not set'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDocumentViewer;