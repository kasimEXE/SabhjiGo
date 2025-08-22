import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { updateUserConsent, getUserData } from "../data/users";

function ConsentToggles() {
  const [user] = useAuthState(auth);
  const [consent, setConsent] = useState({
    sms: false,
    location: false
  });
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current consent settings from Firestore
  useEffect(() => {
    const loadUserConsent = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getUserData(user.uid);
        if (userData?.consent) {
          setConsent({
            sms: userData.consent.sms || false,
            location: userData.consent.location || false
          });
        }
      } catch (error) {
        console.error('Error loading user consent:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserConsent();
  }, [user]);

  const handleConsentChange = async (type, value) => {
    if (!user) return;

    setUpdating(true);
    try {
      const newConsent = { ...consent, [type]: value };
      setConsent(newConsent);
      
      await updateUserConsent(user.uid, type, value);
      console.log(`${type} consent updated to:`, value);
    } catch (error) {
      // Revert on error
      setConsent(consent);
      console.error('Error updating consent:', error);
    }
    setUpdating(false);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
        <i className="fas fa-shield-alt text-blue-500 mr-2"></i>
        Privacy Settings
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">SMS Notifications</p>
            <p className="text-gray-600 text-sm">Receive vendor arrival alerts via SMS</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={consent.sms}
              onChange={(e) => handleConsentChange('sms', e.target.checked)}
              disabled={updating}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Location Sharing</p>
            <p className="text-gray-600 text-sm">Share your location for better delivery accuracy</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={consent.location}
              onChange={(e) => handleConsentChange('location', e.target.checked)}
              disabled={updating}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>
      
      {(updating || loading) && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">
            {loading ? 'Loading preferences...' : 'Updating preferences...'}
          </span>
        </div>
      )}
    </div>
  );
}

export default ConsentToggles;
