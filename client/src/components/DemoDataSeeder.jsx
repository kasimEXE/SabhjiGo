import { useState } from "react";
import { createVendor } from "../data/vendors";
import { setInventory } from "../data/inventories";

function DemoDataSeeder() {
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const sampleVendors = [
    {
      id: 'vendor-ramesh',
      name: 'Ramesh Fresh Vegetables',
      description: 'Fresh vegetables and fruits delivered daily',
      phone: '+91-9876543210',
      societiesServed: ['sunshine-apartments', 'green-valley', 'royal-residency'],
      status: 'active'
    },
    {
      id: 'vendor-priya',
      name: 'Priya Organic Store',
      description: 'Organic vegetables and seasonal fruits',
      phone: '+91-9876543211',
      societiesServed: ['blueridge-towers', 'emerald-heights', 'sunshine-apartments'],
      status: 'active'
    },
    {
      id: 'vendor-kumar',
      name: 'Kumar Vegetable Cart',
      description: 'Traditional vegetable vendor with fresh daily stock',
      phone: '+91-9876543212',
      societiesServed: ['royal-residency', 'green-valley'],
      status: 'active'
    }
  ];

  const sampleInventoryItems = [
    { id: 'onion', name: 'Onion', price: 30, unit: 'kg', quantity: 50, available: true },
    { id: 'tomato', name: 'Tomato', price: 40, unit: 'kg', quantity: 30, available: true },
    { id: 'potato', name: 'Potato', price: 25, unit: 'kg', quantity: 60, available: true },
    { id: 'carrot', name: 'Carrot', price: 45, unit: 'kg', quantity: 20, available: true },
    { id: 'beans', name: 'French Beans', price: 60, unit: 'kg', quantity: 15, available: true },
    { id: 'spinach', name: 'Spinach', price: 35, unit: 'bunch', quantity: 25, available: true },
    { id: 'coriander', name: 'Coriander', price: 20, unit: 'bunch', quantity: 30, available: true },
    { id: 'capsicum', name: 'Capsicum', price: 55, unit: 'kg', quantity: 12, available: true },
    { id: 'brinjal', name: 'Brinjal', price: 35, unit: 'kg', quantity: 18, available: true },
    { id: 'apple', name: 'Apple', price: 150, unit: 'kg', quantity: 10, available: true },
    { id: 'banana', name: 'Banana', price: 50, unit: 'dozen', quantity: 20, available: true },
    { id: 'mango', name: 'Mango', price: 120, unit: 'kg', quantity: 8, available: true }
  ];

  const seedDemoData = async () => {
    setSeeding(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Create vendors and their inventories
      for (const vendor of sampleVendors) {
        try {
          // Try to create vendor (will succeed if doesn't exist)
          await createVendor(vendor);
          console.log(`Created vendor: ${vendor.name}`);
        } catch (error) {
          console.log(`Vendor ${vendor.name} may already exist`);
        }

        // Create today's inventory for each vendor
        const vendorItems = sampleInventoryItems.map(item => ({
          ...item,
          quantity: Math.floor(Math.random() * item.quantity) + 5, // Random quantity
          price: item.price + Math.floor(Math.random() * 20) - 10 // Price variation
        }));

        try {
          await setInventory(vendor.id, today, {
            items: vendorItems,
            totalItems: vendorItems.length,
            lastUpdated: new Date().toISOString()
          });
          console.log(`Created inventory for: ${vendor.name}`);
        } catch (error) {
          console.error(`Error creating inventory for ${vendor.name}:`, error);
        }
      }

      setSeeded(true);
      console.log('Demo data seeding completed!');
    } catch (error) {
      console.error('Error seeding demo data:', error);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-medium text-blue-900 mb-2">Demo Data Setup</h3>
      <p className="text-blue-800 text-sm mb-3">
        To see vendors and inventories in action, seed some demo data.
      </p>
      <button
        onClick={seedDemoData}
        disabled={seeding || seeded}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {seeding ? 'Seeding...' : seeded ? 'Demo Data Ready!' : 'Seed Demo Data'}
      </button>
      {seeded && (
        <p className="text-green-700 text-sm mt-2">
          ✓ Demo vendors and inventories have been created. Select a society to see them!
        </p>
      )}
    </div>
  );
}

export default DemoDataSeeder;