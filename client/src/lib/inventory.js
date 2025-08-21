import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getInventory(vendorId) {
  try {
    const ref = doc(db, 'inventories', `inv_${vendorId}`);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : { 
      vendorId, 
      items: [], 
      updatedAt: Date.now(),
      lastSync: Date.now()
    };
  } catch (error) {
    console.error('Error getting inventory:', error);
    throw error;
  }
}

export async function saveInventory(vendorId, items) {
  try {
    const ref = doc(db, 'inventories', `inv_${vendorId}`);
    await setDoc(ref, { 
      vendorId, 
      items, 
      updatedAt: Date.now(),
      lastSync: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving inventory:', error);
    throw error;
  }
}