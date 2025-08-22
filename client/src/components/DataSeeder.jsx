import { useState } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { societies, vendors, getTodayRoute, getTodayInventory, getGroupShares } from "../../../scripts/seedData.js";

function DataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const addStatus = (message, type = 'info') => {
    setSeedingStatus(prev => [...prev, { message, type, timestamp: new Date() }]);
  };

  const clearStatus = () => {
    setSeedingStatus([]);
  };

  // Check if document exists
  async function documentExists(collection, docId) {
    try {
      const docRef = doc(db, collection, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      addStatus(`Error checking ${collection}/${docId}: ${error.message}`, 'error');
      return false;
    }
  }

  // Seed specific collection
  async function seedCollection(collectionName, items, getDataFn) {
    const results = { created: 0, skipped: 0, errors: 0 };

    for (const item of items) {
      try {
        const data = getDataFn ? getDataFn(item) : item;
        const docId = data.id;
        
        const exists = await documentExists(collectionName, docId);
        
        if (exists) {
          addStatus(`${collectionName}: '${data.name || docId}' already exists`, 'warning');
          results.skipped++;
          continue;
        }

        const docData = {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, collectionName, docId), docData);
        addStatus(`${collectionName}: Created '${data.name || docId}'`, 'success');
        results.created++;
      } catch (error) {
        addStatus(`${collectionName}: Failed to create item - ${error.message}`, 'error');
        results.errors++;
      }
    }

    return results;
  }

  // Main seeding function
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    clearStatus();
    addStatus('🌱 Starting database seeding...', 'info');

    try {
      // Seed societies
      addStatus('🏘️ Seeding societies...', 'info');
      const societyResults = await seedCollection('societies', societies);
      
      // Seed vendors
      addStatus('🚚 Seeding vendors...', 'info');
      const vendorResults = await seedCollection('vendors', vendors);
      
      // Seed routes
      addStatus('🛣️ Seeding today\'s routes...', 'info');
      const routes = vendors.map(vendor => getTodayRoute(vendor.id, societies));
      const routeResults = await seedCollection('routes', routes);
      
      // Seed inventories
      addStatus('📦 Seeding today\'s inventories...', 'info');
      const inventories = vendors.map(vendor => getTodayInventory(vendor.id));
      const inventoryResults = await seedCollection('inventories', inventories);
      
      // Seed group shares
      addStatus('🔗 Seeding group shares...', 'info');
      const shares = getGroupShares();
      const shareResults = await seedCollection('groupShares', shares);

      // Summary
      const totalCreated = societyResults.created + vendorResults.created + routeResults.created + inventoryResults.created + shareResults.created;
      const totalSkipped = societyResults.skipped + vendorResults.skipped + routeResults.skipped + inventoryResults.skipped + shareResults.skipped;
      const totalErrors = societyResults.errors + vendorResults.errors + routeResults.errors + inventoryResults.errors + shareResults.errors;

      addStatus(`🎉 Seeding completed! Created: ${totalCreated}, Skipped: ${totalSkipped}, Errors: ${totalErrors}`, 'success');
      
      if (totalCreated > 0) {
        addStatus('• You can now browse vendors by society in customer view', 'info');
        addStatus('• Check vendor dashboards for routes and inventories', 'info');
        addStatus('• Test ShareView with code: demo-share-123', 'info');
      }

    } catch (error) {
      addStatus(`❌ Seeding failed: ${error.message}`, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg border-2 border-indigo-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-database text-indigo-500 text-xl"></i>
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-gray-900">Database Seeder</h3>
        <p className="text-gray-600">Populate Firestore with realistic test data</p>
      </div>

      <div className="bg-indigo-100 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-indigo-900 mb-2">Will create:</h4>
        <ul className="text-indigo-800 text-sm space-y-1">
          <li>• 3 Societies (Sunshine Apartments, Green Valley, Royal Residency)</li>
          <li>• 2 Vendors with overlapping society coverage</li>
          <li>• Today's routes with 2-3 waypoints each</li>
          <li>• Fresh inventories (10-15 items per vendor)</li>
          <li>• Demo share link for public testing</li>
        </ul>
      </div>

      <button 
        onClick={handleSeedDatabase}
        disabled={isSeeding}
        className="w-full bg-indigo-500 text-white py-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isSeeding ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Seeding Database...
          </span>
        ) : (
          'Seed Database'
        )}
      </button>

      {seedingStatus.length > 0 && (
        <div className="border-t border-indigo-200 pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-indigo-700 font-medium mb-2"
          >
            <span>Seeding Log ({seedingStatus.length} entries)</span>
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </button>
          
          {isExpanded && (
            <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
              {seedingStatus.map((status, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm mb-1">
                  <span>{getStatusIcon(status.type)}</span>
                  <span className={getStatusColor(status.type)}>
                    {status.message}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={clearStatus}
            className="text-indigo-600 text-sm hover:underline mt-2"
          >
            Clear Log
          </button>
        </div>
      )}
    </div>
  );
}

export default DataSeeder;