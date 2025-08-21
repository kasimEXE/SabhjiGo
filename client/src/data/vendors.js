import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

// Get all vendors
export const getVendors = async () => {
  try {
    const vendorsRef = collection(db, 'vendors');
    const snapshot = await getDocs(vendorsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting vendors:', error);
    throw error;
  }
};

// Get vendor by ID
export const getVendor = async (vendorId) => {
  try {
    const vendorRef = doc(db, 'vendors', vendorId);
    const vendorDoc = await getDoc(vendorRef);
    return vendorDoc.exists() ? { id: vendorDoc.id, ...vendorDoc.data() } : null;
  } catch (error) {
    console.error('Error getting vendor:', error);
    throw error;
  }
};

// Get vendors serving a specific society
export const getVendorsBySociety = async (societyId) => {
  try {
    const vendorsRef = collection(db, 'vendors');
    const q = query(vendorsRef, where('societiesServed', 'array-contains', societyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting vendors by society:', error);
    throw error;
  }
};

// Create new vendor
export const createVendor = async (vendorData) => {
  try {
    const vendorsRef = collection(db, 'vendors');
    const docRef = await addDoc(vendorsRef, {
      ...vendorData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw error;
  }
};

// Update vendor
export const updateVendor = async (vendorId, vendorData) => {
  try {
    const vendorRef = doc(db, 'vendors', vendorId);
    await updateDoc(vendorRef, {
      ...vendorData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
};

// Update vendor active route
export const updateVendorRoute = async (vendorId, routeId) => {
  try {
    const vendorRef = doc(db, 'vendors', vendorId);
    await updateDoc(vendorRef, {
      activeRouteId: routeId,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating vendor route:', error);
    throw error;
  }
};
