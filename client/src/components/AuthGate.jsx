import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user document exists, create if not
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          // Check if this is demo mode with specific role
          const demoRole = localStorage.getItem('demo_user_role');
          
          if (!userDoc.exists()) {
            const userRole = demoRole || 'customer';
            
            // Bootstrap new user with default settings
            const userData = {
              role: userRole,
              phone: firebaseUser.phoneNumber || null,
              email: firebaseUser.email || null,
              displayName: firebaseUser.displayName || null,
              societyId: null,
              vendorId: null,
              consent: {
                sms: false,
                location: false,
                updatedAt: serverTimestamp()
              },
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            
            await setDoc(userRef, userData);
            console.log('User document created:', userData);
          } else if (demoRole && firebaseUser.isAnonymous) {
            // For demo mode (anonymous users), always update role if it's different
            const currentData = userDoc.data();
            if (currentData.role !== demoRole) {
              await setDoc(userRef, {
                ...currentData,
                role: demoRole,
                updatedAt: serverTimestamp()
              }, { merge: true });
              console.log(`Updated demo user role to: ${demoRole}`);
            }
          }
        } catch (error) {
          console.error('Error bootstrapping user:', error);
        }
      }
      
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SabhjiGo...</p>
        </div>
      </div>
    );
  }

  return children;
}

export default AuthGate;
