import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

function LocalDevMode() {
  const [selectedRole, setSelectedRole] = useState('customer');
  const user = useContext(UserContext);

  const enterDevMode = () => {
    // Create a mock user object for development testing
    const mockUser = {
      uid: `dev_${selectedRole}_${Date.now()}`,
      role: selectedRole,
      phone: selectedRole === 'customer' ? '+919876543210' : '+919123456789',
      email: `${selectedRole}@dev.local`,
      displayName: selectedRole === 'customer' ? 'Dev Customer' : 'Dev Vendor',
      societies: selectedRole === 'customer' ? ['society_001', 'society_002'] : ['society_003'],
      vendorId: selectedRole === 'vendor' ? `vendor_${Date.now()}` : null,
      consent: {
        sms: true,
        location: true,
        dataCollection: true
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDevMode: true
    };

    // Store in localStorage for development
    localStorage.setItem('dev_user', JSON.stringify(mockUser));
    
    // Trigger app refresh to pick up dev user
    window.location.reload();
  };

  const exitDevMode = () => {
    localStorage.removeItem('dev_user');
    window.location.reload();
  };

  // Check if already in dev mode
  const isInDevMode = localStorage.getItem('dev_user');

  if (isInDevMode) {
    const devUser = JSON.parse(isInDevMode);
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border-2 border-purple-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-code text-purple-500 text-xl"></i>
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-gray-900">Development Mode Active</h3>
          <p className="text-gray-600">Testing as: {devUser.displayName} ({devUser.role})</p>
        </div>

        <div className="bg-purple-100 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-purple-900 mb-2">Current Test User:</h4>
          <ul className="text-purple-800 text-sm space-y-1">
            <li>• Role: {devUser.role}</li>
            <li>• Email: {devUser.email}</li>
            <li>• Phone: {devUser.phone}</li>
            <li>• Societies: {devUser.societies.join(', ')}</li>
          </ul>
        </div>

        <button 
          onClick={exitDevMode}
          className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
        >
          Exit Development Mode
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg border-2 border-orange-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-wrench text-orange-500 text-xl"></i>
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-gray-900">Local Development Mode</h3>
        <p className="text-gray-600">Test app features without Firebase setup</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Test as:</label>
        <select 
          value={selectedRole} 
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="customer">Customer (Browse vendors & inventory)</option>
          <option value="vendor">Vendor (Manage routes & inventory)</option>
          <option value="admin">Admin (Full platform access)</option>
        </select>
      </div>

      <button 
        onClick={enterDevMode}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors mb-4"
      >
        Enter Development Mode
      </button>

      <div className="bg-orange-100 rounded-lg p-4">
        <h4 className="font-medium text-orange-900 mb-2">Development Features:</h4>
        <ul className="text-orange-800 text-sm space-y-1">
          <li>• Full app navigation without authentication</li>
          <li>• Mock data for vendors, societies, and inventory</li>
          <li>• Test privacy settings and user preferences</li>
          <li>• Local storage simulation (no Firebase required)</li>
          <li>• All UI components and flows functional</li>
        </ul>
      </div>
    </div>
  );
}

export default LocalDevMode;