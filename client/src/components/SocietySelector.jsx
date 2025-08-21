import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { updateUserSociety } from "../data/users";

function SocietySelector() {
  const [user] = useAuthState(auth);
  const [selectedSociety, setSelectedSociety] = useState("");
  const [updating, setUpdating] = useState(false);

  // Static society options for Phase 1
  const societies = [
    { id: 'sunshine-apartments', name: 'Sunshine Apartments' },
    { id: 'green-valley', name: 'Green Valley Society' },
    { id: 'royal-residency', name: 'Royal Residency' },
    { id: 'blueridge-towers', name: 'Blueridge Towers' },
    { id: 'emerald-heights', name: 'Emerald Heights' }
  ];

  // TODO: Load current society from Firestore
  useEffect(() => {
    // This would load user's current societyId from Firestore
    setSelectedSociety('sunshine-apartments'); // Default for demo
  }, [user]);

  const handleSocietyChange = async (societyId) => {
    if (!user || societyId === selectedSociety) return;

    setUpdating(true);
    try {
      setSelectedSociety(societyId);
      await updateUserSociety(user.uid, societyId);
      console.log('Society updated to:', societyId);
    } catch (error) {
      // Revert on error
      setSelectedSociety(selectedSociety);
      console.error('Error updating society:', error);
    }
    setUpdating(false);
  };

  return (
    <div className="relative">
      <select 
        value={selectedSociety}
        onChange={(e) => handleSocietyChange(e.target.value)}
        disabled={updating}
        className="px-4 py-2 pr-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Select Society</option>
        {societies.map((society) => (
          <option key={society.id} value={society.id}>
            {society.name}
          </option>
        ))}
      </select>
      
      {updating && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
        </div>
      )}
    </div>
  );
}

export default SocietySelector;
