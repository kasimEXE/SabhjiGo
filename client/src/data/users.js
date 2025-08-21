import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// Get user data
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Update user data
export const updateUserData = async (uid, data) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

// Update user consent settings
export const updateUserConsent = async (uid, consentType, value) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      [`consent.${consentType}`]: value,
      'consent.updatedAt': serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user consent:', error);
    throw error;
  }
};

// Update user society
export const updateUserSociety = async (uid, societyId) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      societyId: societyId,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user society:', error);
    throw error;
  }
};

// Create or update user
export const setUserData = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error setting user data:', error);
    throw error;
  }
};
