import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export function watchUser(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return callback(null);

    try {
      const ref = doc(db, 'users', user.uid);
      let snap = await getDoc(ref);

      if (!snap.exists()) {
        const newUser = {
          uid: user.uid,
          role: 'customer',
          phone: user.phoneNumber || null,
          email: user.email || null,
          displayName: user.displayName || 'Anonymous User',
          societies: [],
          vendorId: null,
          consent: {
            sms: false,
            location: false,
            dataCollection: true
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await setDoc(ref, newUser, { merge: true });
        snap = await getDoc(ref);
      }

      callback({ ...snap.data() });
    } catch (error) {
      console.error('Error in watchUser:', error);
      callback(null);
    }
  });
}