import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import NavBar from "../components/NavBar";
import ConsentToggles from "../components/ConsentToggles";
import SocietySelector from "../components/SocietySelector";
import UserDocumentViewer from "../components/UserDocumentViewer";
import FirebaseDebugger from "../components/FirebaseDebugger";
import FirebaseSetupGuide from "../components/FirebaseSetupGuide";
import DemoDataSeeder from "../components/DemoDataSeeder";
import { getUserData } from "../data/users";
import { getVendorsBySociety } from "../data/vendors";
import { getInventory } from "../data/inventories";

function CustomerHome() {
  const [user] = useAuthState(auth);
  const [activeVendors, setActiveVendors] = useState([]);
  const [vendorInventories, setVendorInventories] = useState({});
  const [userSociety, setUserSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);

  // Fetch user society and vendors
  useEffect(() => {
    const fetchVendorsAndInventories = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get user's society
        const userData = await getUserData(user.uid);
        const societyId = userData?.societyId;
        setUserSociety(societyId);

        if (societyId) {
          // Fetch vendors serving this society
          const vendors = await getVendorsBySociety(societyId);
          setActiveVendors(vendors);

          // Fetch inventories for each vendor
          const inventories = {};
          for (const vendor of vendors) {
            try {
              const inventory = await getInventory(vendor.id);
              if (inventory && inventory.items) {
                inventories[vendor.id] = inventory;
              }
            } catch (error) {
              console.error(`Error fetching inventory for vendor ${vendor.id}:`, error);
            }
          }
          setVendorInventories(inventories);
        }
      } catch (error) {
        console.error('Error fetching vendors and inventories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorsAndInventories();
  }, [user]);

  // Add item to cart
  const addToCart = (vendorId, item, quantity = 1) => {
    setCart(prev => ({
      ...prev,
      [`${vendorId}-${item.id}`]: {
        vendorId,
        item,
        quantity: (prev[`${vendorId}-${item.id}`]?.quantity || 0) + quantity
      }
    }));
  };

  // Remove item from cart
  const removeFromCart = (vendorId, itemId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[`${vendorId}-${itemId}`];
      return newCart;
    });
  };

  // Update cart item quantity
  const updateCartQuantity = (vendorId, itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(vendorId, itemId);
      return;
    }
    setCart(prev => ({
      ...prev,
      [`${vendorId}-${itemId}`]: {
        ...prev[`${vendorId}-${itemId}`],
        quantity
      }
    }));
  };

  // Get cart total
  const getCartTotal = () => {
    return Object.values(cart).reduce((total, cartItem) => {
      return total + (cartItem.item.price * cartItem.quantity);
    }, 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, cartItem) => total + cartItem.quantity, 0);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.displayName || 'Customer'}!
              </h1>
              <p className="text-gray-600">Sunshine Apartments, Kothrud</p>
            </div>
            <div className="flex items-center space-x-4">
              <SocietySelector />
              <button className="p-2 text-gray-500 hover:text-green-500 transition-colors">
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>

          {/* Active Vendors and Filter */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Vendors Near You</h2>
              {activeVendors.length > 0 && (
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showAvailableOnly}
                      onChange={(e) => setShowAvailableOnly(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600">Available items only</span>
                  </label>
                  {getCartItemCount() > 0 && (
                    <button
                      onClick={() => setShowCart(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <i className="fas fa-shopping-cart"></i>
                      <span>Cart ({getCartItemCount()})</span>
                      <span>₹{getCartTotal()}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading vendors...</p>
              </div>
            ) : !userSociety ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-map-marker-alt text-4xl mb-4 text-gray-300"></i>
                <p>Please select your society to see available vendors.</p>
              </div>
            ) : activeVendors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-truck text-4xl mb-4 text-gray-300"></i>
                <p>No vendors are currently active in your area.</p>
                <p className="text-sm">Check back later or enable notifications to get alerts.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeVendors.map((vendor) => {
                  const inventory = vendorInventories[vendor.id];
                  const hasItems = inventory && inventory.items && inventory.items.length > 0;
                  const availableItems = hasItems ? inventory.items.filter(item => 
                    !showAvailableOnly || (item.quantity > 0 && item.available !== false)
                  ) : [];
                  
                  return (
                    <div key={vendor.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <i className="fas fa-truck text-white"></i>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                            <p className="text-gray-600 text-sm">{vendor.description || 'Fresh vegetables and fruits'}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                <i className="fas fa-circle text-green-500 text-xs mr-1"></i>
                                {vendor.status || 'Active'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Today's Inventory */}
                      {hasItems && availableItems.length > 0 ? (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Today's Fresh Items</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {availableItems.slice(0, 6).map((item, index) => (
                              <div key={`${vendor.id}-${item.id || item.name}-${index}`} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900">{item.name}</span>
                                  <span className="text-green-600 font-semibold">₹{item.price}/{item.unit}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">
                                    {item.quantity > 0 ? `${item.quantity} ${item.unit} left` : 'Out of stock'}
                                  </span>
                                  {item.quantity > 0 && (
                                    <button
                                      onClick={() => addToCart(vendor.id, item)}
                                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                                    >
                                      Add
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {availableItems.length > 6 && (
                            <button className="mt-3 text-green-600 text-sm hover:text-green-700">
                              View all {availableItems.length} items →
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-sm">No inventory available for today</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Cart Preview Modal */}
          {showCart && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  {Object.keys(cart).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <i className="fas fa-shopping-cart text-3xl mb-3 text-gray-300"></i>
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Object.values(cart).map((cartItem) => (
                        <div key={`${cartItem.vendorId}-${cartItem.item.id}`} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{cartItem.item.name}</h4>
                            <p className="text-sm text-gray-600">₹{cartItem.item.price}/{cartItem.item.unit}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartQuantity(cartItem.vendorId, cartItem.item.id, cartItem.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{cartItem.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(cartItem.vendorId, cartItem.item.id, cartItem.quantity + 1)}
                              className="w-6 h-6 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
                            >
                              +
                            </button>
                            <span className="ml-2 font-semibold text-gray-900">₹{cartItem.item.price * cartItem.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {Object.keys(cart).length > 0 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-gray-900">Total: ₹{getCartTotal()}</span>
                    </div>
                    <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                      Continue to Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          <ConsentToggles />
        </div>

        {/* Demo Data Seeder - Development Tool */}
        <div className="mb-8">
          <DemoDataSeeder />
        </div>
        
        {/* Firebase Setup Guide - Development Tool */}
        <div className="mb-8">
          <FirebaseSetupGuide />
        </div>

        {/* Firebase Diagnostics - Development Tool */}
        <div className="mb-8">
          <FirebaseDebugger />
        </div>

        {/* User Document Verification - Development Tool */}
        <div className="mb-8">
          <UserDocumentViewer />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-green-500 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Vendors</h3>
            <p className="text-gray-600 text-sm mb-4">Search for vendors in your area</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors">
              Search Now
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bell text-orange-500 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
            <p className="text-gray-600 text-sm mb-4">Manage your alert preferences</p>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors">
              Settings
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-history text-blue-500 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order History</h3>
            <p className="text-gray-600 text-sm mb-4">View your past purchases</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
              View History
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomerHome;
