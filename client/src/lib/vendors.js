import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function listVendorsForSocieties(societyIds = []) {
  if (!societyIds.length) return [];
  
  try {
    const q = query(
      collection(db, 'vendors'),
      where('societies', 'array-contains-any', societyIds),
      where('active', '==', true)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
}

export async function getVendorById(vendorId) {
  try {
    const ref = doc(db, 'vendors', vendorId);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return null;
  }
}