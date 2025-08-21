import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import NavBar from "../components/NavBar";
import { getInventory, updateInventoryItem } from "../data/inventories";

function VendorInventory() {
  const [user] = useAuthState(auth);
  const [inventory, setInventory] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load inventory from Firestore
    const loadInventory = async () => {
      if (user) {
        try {
          const today = new Date().toISOString().split('T')[0];
          const inventoryData = await getInventory(`${user.uid}_${today}`);
          if (inventoryData) {
            setInventory(inventoryData);
          }
        } catch (error) {
          console.error('Failed to load inventory:', error);
        }
      }
      setLoading(false);
    };
    
    loadInventory();
  }, [user]);

  const handlePriceUpdate = async (itemIndex, newPrice) => {
    // TODO: Update item price in Firestore
    const updatedItems = [...inventory.items];
    updatedItems[itemIndex].price = parseFloat(newPrice);
    setInventory({ ...inventory, items: updatedItems });
  };

  const handleAvailabilityToggle = async (itemIndex) => {
    // TODO: Update item availability in Firestore
    const updatedItems = [...inventory.items];
    updatedItems[itemIndex].available = !updatedItems[itemIndex].available;
    setInventory({ ...inventory, items: updatedItems });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Today's Inventory</h1>
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
              <i className="fas fa-plus mr-2"></i>Add Item
            </button>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Item</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Unit</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Price</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Available</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No inventory items found. Add your first item to get started.
                    </td>
                  </tr>
                ) : (
                  inventory.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-leaf text-green-500"></i>
                          </div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{item.unit}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span>₹</span>
                          <input 
                            type="number" 
                            value={item.price} 
                            onChange={(e) => handlePriceUpdate(index, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={item.available}
                            onChange={() => handleAvailabilityToggle(index)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-500 hover:text-blue-600">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="text-red-500 hover:text-red-600">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VendorInventory;
