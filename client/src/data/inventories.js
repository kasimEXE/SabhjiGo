import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

// Get inventory by vendor and date
export const getInventory = async (inventoryId) => {
  try {
    const inventoryRef = doc(db, 'inventories', inventoryId);
    const inventoryDoc = await getDoc(inventoryRef);
    return inventoryDoc.exists() ? { id: inventoryDoc.id, ...inventoryDoc.data() } : null;
  } catch (error) {
    console.error('Error getting inventory:', error);
    throw error;
  }
};

// Get vendor inventories
export const getVendorInventories = async (vendorId, limitCount = 10) => {
  try {
    const inventoriesRef = collection(db, 'inventories');
    const q = query(
      inventoriesRef, 
      where('vendorId', '==', vendorId), 
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting vendor inventories:', error);
    throw error;
  }
};

// Get today's inventory for vendor
export const getTodayInventory = async (vendorId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const inventoryId = `${vendorId}_${today}`;
    return await getInventory(inventoryId);
  } catch (error) {
    console.error('Error getting today inventory:', error);
    throw error;
  }
};

// Create or update inventory
export const setInventory = async (vendorId, date, inventoryData) => {
  try {
    const inventoryId = `${vendorId}_${date}`;
    const inventoryRef = doc(db, 'inventories', inventoryId);
    await setDoc(inventoryRef, {
      vendorId,
      date,
      ...inventoryData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return inventoryId;
  } catch (error) {
    console.error('Error setting inventory:', error);
    throw error;
  }
};

// Update inventory items
export const updateInventoryItems = async (inventoryId, items) => {
  try {
    const inventoryRef = doc(db, 'inventories', inventoryId);
    await updateDoc(inventoryRef, {
      items,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating inventory items:', error);
    throw error;
  }
};

// Update single inventory item
export const updateInventoryItem = async (inventoryId, itemIndex, itemData) => {
  try {
    const inventory = await getInventory(inventoryId);
    if (!inventory) throw new Error('Inventory not found');
    
    const updatedItems = [...inventory.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...itemData };
    
    await updateInventoryItems(inventoryId, updatedItems);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

// Add inventory item
export const addInventoryItem = async (inventoryId, itemData) => {
  try {
    const inventory = await getInventory(inventoryId);
    const currentItems = inventory?.items || [];
    const newItems = [...currentItems, itemData];
    
    await updateInventoryItems(inventoryId, newItems);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
};

// Remove inventory item
export const removeInventoryItem = async (inventoryId, itemIndex) => {
  try {
    const inventory = await getInventory(inventoryId);
    if (!inventory) throw new Error('Inventory not found');
    
    const updatedItems = inventory.items.filter((_, index) => index !== itemIndex);
    await updateInventoryItems(inventoryId, updatedItems);
  } catch (error) {
    console.error('Error removing inventory item:', error);
    throw error;
  }
};
