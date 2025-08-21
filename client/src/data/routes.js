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
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

// Get routes for a vendor
export const getVendorRoutes = async (vendorId, limitCount = 10) => {
  try {
    const routesRef = collection(db, 'routes');
    const q = query(
      routesRef, 
      where('vendorId', '==', vendorId), 
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting vendor routes:', error);
    throw error;
  }
};

// Get route by ID
export const getRoute = async (routeId) => {
  try {
    const routeRef = doc(db, 'routes', routeId);
    const routeDoc = await getDoc(routeRef);
    return routeDoc.exists() ? { id: routeDoc.id, ...routeDoc.data() } : null;
  } catch (error) {
    console.error('Error getting route:', error);
    throw error;
  }
};

// Get today's routes for a vendor
export const getTodayRoute = async (vendorId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const routesRef = collection(db, 'routes');
    const q = query(
      routesRef, 
      where('vendorId', '==', vendorId), 
      where('date', '==', today)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.length > 0 ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null;
  } catch (error) {
    console.error('Error getting today route:', error);
    throw error;
  }
};

// Create new route
export const createRoute = async (routeData) => {
  try {
    const routesRef = collection(db, 'routes');
    const docRef = await addDoc(routesRef, {
      ...routeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

// Update route
export const updateRoute = async (routeId, routeData) => {
  try {
    const routeRef = doc(db, 'routes', routeId);
    await updateDoc(routeRef, {
      ...routeData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating route:', error);
    throw error;
  }
};

// Update route status
export const updateRouteStatus = async (routeId, status) => {
  try {
    const routeRef = doc(db, 'routes', routeId);
    await updateDoc(routeRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating route status:', error);
    throw error;
  }
};

// Update route location
export const updateRouteLocation = async (routeId, location) => {
  try {
    const routeRef = doc(db, 'routes', routeId);
    await updateDoc(routeRef, {
      lastLocation: {
        ...location,
        ts: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating route location:', error);
    throw error;
  }
};

// Get group share
export const getGroupShare = async (shareCode) => {
  try {
    const shareRef = doc(db, 'groupShares', shareCode);
    const shareDoc = await getDoc(shareRef);
    return shareDoc.exists() ? { id: shareDoc.id, ...shareDoc.data() } : null;
  } catch (error) {
    console.error('Error getting group share:', error);
    throw error;
  }
};

// Create group share
export const createGroupShare = async (shareCode, routeId) => {
  try {
    const shareRef = doc(db, 'groupShares', shareCode);
    await updateDoc(shareRef, {
      routeId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating group share:', error);
    throw error;
  }
};
