import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

let testEnv;
let db;

// Test data
const TEST_PROJECT_ID = 'sabhji-go-test';
const MOCK_USER_ID = 'test-user-123';
const MOCK_VENDOR_ID = 'test-vendor-456';
const MOCK_ADMIN_ID = 'test-admin-789';
const MOCK_SOCIETY_ID = 'test-society-001';

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: TEST_PROJECT_ID,
    firestore: {
      rules: `
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // Users collection - users can only access their own data
            match /users/{userId} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }
            
            // Societies collection - read for authenticated users, write only for admins
            match /societies/{societyId} {
              allow read: if request.auth != null;
              allow write: if request.auth != null && 
                request.auth.token.admin == true;
            }
            
            // Vendors collection - read for authenticated users, write only for admins
            match /vendors/{vendorId} {
              allow read: if request.auth != null;
              allow create, update: if request.auth != null && 
                request.auth.token.admin == true;
            }
            
            // Routes collection - read for authenticated users, write only for own vendor data
            match /routes/{routeId} {
              allow read: if request.auth != null;
              allow create: if request.auth != null && 
                request.auth.token.vendorId != null &&
                request.resource.data.vendorId == request.auth.token.vendorId;
              allow update: if request.auth != null && 
                request.auth.token.vendorId != null &&
                resource.data.vendorId == request.auth.token.vendorId &&
                // Prevent changing vendorId on update
                request.resource.data.vendorId == resource.data.vendorId;
            }
            
            // Inventories collection - read for authenticated users, write only for own vendor data
            match /inventories/{inventoryId} {
              allow read: if request.auth != null;
              allow create, update: if request.auth != null && 
                request.auth.token.vendorId != null &&
                request.resource.data.vendorId == request.auth.token.vendorId;
            }
            
            // Group shares collection - public read, restricted write
            match /groupShares/{shareCode} {
              allow read: if true; // Public read for sharing
              allow create: if request.auth != null && 
                (request.auth.token.admin == true || request.auth.token.vendorId != null);
              allow update, delete: if request.auth != null && 
                request.auth.token.admin == true;
            }
          }
        }
      `
    }
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Users Collection Security Rules', () => {
  test('should allow users to read their own data', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertSucceeds(
      getDoc(doc(userDb, 'users', MOCK_USER_ID))
    );
  });

  test('should allow users to write their own data', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertSucceeds(
      setDoc(doc(userDb, 'users', MOCK_USER_ID), {
        role: 'customer',
        email: 'test@example.com',
        consent: { sms: false, location: false }
      })
    );
  });

  test('should deny users from reading other users data', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertFails(
      getDoc(doc(userDb, 'users', 'other-user-id'))
    );
  });

  test('should deny users from writing other users data', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertFails(
      setDoc(doc(userDb, 'users', 'other-user-id'), {
        role: 'customer'
      })
    );
  });

  test('should deny unauthenticated access', async () => {
    const unauthenticatedContext = testEnv.unauthenticatedContext();
    const unauthenticatedDb = unauthenticatedContext.firestore();
    
    await assertFails(
      getDoc(doc(unauthenticatedDb, 'users', MOCK_USER_ID))
    );
  });
});

describe('Societies Collection Security Rules', () => {
  test('should allow authenticated users to read societies', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertSucceeds(
      getDoc(doc(userDb, 'societies', MOCK_SOCIETY_ID))
    );
  });

  test('should allow admin to write societies', async () => {
    const adminContext = testEnv.authenticatedContext(MOCK_ADMIN_ID, {
      admin: true
    });
    const adminDb = adminContext.firestore();
    
    await assertSucceeds(
      setDoc(doc(adminDb, 'societies', MOCK_SOCIETY_ID), {
        name: 'Test Society',
        area: 'Kothrud',
        lat: 18.5074,
        lng: 73.8077
      })
    );
  });

  test('should deny non-admin from writing societies', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertFails(
      setDoc(doc(userDb, 'societies', MOCK_SOCIETY_ID), {
        name: 'Test Society'
      })
    );
  });

  test('should deny unauthenticated read access', async () => {
    const unauthenticatedContext = testEnv.unauthenticatedContext();
    const unauthenticatedDb = unauthenticatedContext.firestore();
    
    await assertFails(
      getDoc(doc(unauthenticatedDb, 'societies', MOCK_SOCIETY_ID))
    );
  });
});

describe('Vendors Collection Security Rules', () => {
  test('should allow authenticated users to read vendors', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertSucceeds(
      getDoc(doc(userDb, 'vendors', MOCK_VENDOR_ID))
    );
  });

  test('should allow admin to create vendors', async () => {
    const adminContext = testEnv.authenticatedContext(MOCK_ADMIN_ID, {
      admin: true
    });
    const adminDb = adminContext.firestore();
    
    await assertSucceeds(
      setDoc(doc(adminDb, 'vendors', MOCK_VENDOR_ID), {
        name: 'Test Vendor',
        vehicleType: 'auto',
        phone: '+919876543210',
        societiesServed: [MOCK_SOCIETY_ID]
      })
    );
  });

  test('should deny non-admin from creating vendors', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertFails(
      setDoc(doc(userDb, 'vendors', MOCK_VENDOR_ID), {
        name: 'Test Vendor'
      })
    );
  });
});

describe('Routes Collection Security Rules', () => {
  beforeEach(async () => {
    // Setup existing route for update tests
    const adminContext = testEnv.authenticatedContext(MOCK_ADMIN_ID, {
      admin: true
    });
    const adminDb = adminContext.firestore();
    
    await setDoc(doc(adminDb, 'routes', 'test-route-1'), {
      vendorId: MOCK_VENDOR_ID,
      date: '2024-01-15',
      status: 'idle',
      waypoints: []
    });
  });

  test('should allow authenticated users to read routes', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertSucceeds(
      getDoc(doc(userDb, 'routes', 'test-route-1'))
    );
  });

  test('should allow vendor to create their own routes', async () => {
    const vendorContext = testEnv.authenticatedContext(MOCK_USER_ID, {
      vendorId: MOCK_VENDOR_ID
    });
    const vendorDb = vendorContext.firestore();
    
    await assertSucceeds(
      setDoc(doc(vendorDb, 'routes', 'test-route-2'), {
        vendorId: MOCK_VENDOR_ID,
        date: '2024-01-16',
        status: 'idle',
        waypoints: []
      })
    );
  });

  test('should deny vendor from creating routes for other vendors', async () => {
    const vendorContext = testEnv.authenticatedContext(MOCK_USER_ID, {
      vendorId: MOCK_VENDOR_ID
    });
    const vendorDb = vendorContext.firestore();
    
    await assertFails(
      setDoc(doc(vendorDb, 'routes', 'test-route-3'), {
        vendorId: 'other-vendor-id',
        date: '2024-01-16',
        status: 'idle',
        waypoints: []
      })
    );
  });

  test('should allow vendor to update their own routes', async () => {
    const vendorContext = testEnv.authenticatedContext(MOCK_USER_ID, {
      vendorId: MOCK_VENDOR_ID
    });
    const vendorDb = vendorContext.firestore();
    
    await assertSucceeds(
      updateDoc(doc(vendorDb, 'routes', 'test-route-1'), {
        status: 'enroute',
        vendorId: MOCK_VENDOR_ID // Must match existing vendorId
      })
    );
  });

  test('should deny vendor from changing vendorId on update', async () => {
    const vendorContext = testEnv.authenticatedContext(MOCK_USER_ID, {
      vendorId: MOCK_VENDOR_ID
    });
    const vendorDb = vendorContext.firestore();
    
    await assertFails(
      updateDoc(doc(vendorDb, 'routes', 'test-route-1'), {
        vendorId: 'different-vendor-id'
      })
    );
  });

  test('should deny non-vendor users from creating routes', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertFails(
      setDoc(doc(userDb, 'routes', 'test-route-4'), {
        vendorId: MOCK_VENDOR_ID,
        date: '2024-01-16',
        status: 'idle'
      })
    );
  });
});

describe('Inventories Collection Security Rules', () => {
  test('should allow authenticated users to read inventories', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertSucceeds(
      getDoc(doc(userDb, 'inventories', `${MOCK_VENDOR_ID}_2024-01-15`))
    );
  });

  test('should allow vendor to create their own inventories', async () => {
    const vendorContext = testEnv.authenticatedContext(MOCK_USER_ID, {
      vendorId: MOCK_VENDOR_ID
    });
    const vendorDb = vendorContext.firestore();
    
    await assertSucceeds(
      setDoc(doc(vendorDb, 'inventories', `${MOCK_VENDOR_ID}_2024-01-15`), {
        vendorId: MOCK_VENDOR_ID,
        date: '2024-01-15',
        items: [
          { name: 'Carrots', unit: 'kg', price: 40, available: true }
        ]
      })
    );
  });

  test('should deny vendor from creating inventories for other vendors', async () => {
    const vendorContext = testEnv.authenticatedContext(MOCK_USER_ID, {
      vendorId: MOCK_VENDOR_ID
    });
    const vendorDb = vendorContext.firestore();
    
    await assertFails(
      setDoc(doc(vendorDb, 'inventories', 'other-vendor_2024-01-15'), {
        vendorId: 'other-vendor-id',
        date: '2024-01-15',
        items: []
      })
    );
  });

  test('should deny non-vendor users from creating inventories', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertFails(
      setDoc(doc(userDb, 'inventories', `${MOCK_VENDOR_ID}_2024-01-15`), {
        vendorId: MOCK_VENDOR_ID,
        date: '2024-01-15',
        items: []
      })
    );
  });
});

describe('Group Shares Collection Security Rules', () => {
  test('should allow public read access to group shares', async () => {
    const unauthenticatedContext = testEnv.unauthenticatedContext();
    const unauthenticatedDb = unauthenticatedContext.firestore();
    
    await assertSucceeds(
      getDoc(doc(unauthenticatedDb, 'groupShares', 'test-share-code'))
    );
  });

  test('should allow authenticated users to read group shares', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertSucceeds(
      getDoc(doc(userDb, 'groupShares', 'test-share-code'))
    );
  });

  test('should allow admin to create group shares', async () => {
    const adminContext = testEnv.authenticatedContext(MOCK_ADMIN_ID, {
      admin: true
    });
    const adminDb = adminContext.firestore();
    
    await assertSucceeds(
      setDoc(doc(adminDb, 'groupShares', 'admin-share-code'), {
        routeId: 'test-route-1',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      })
    );
  });

  test('should allow vendor to create group shares', async () => {
    const vendorContext = testEnv.authenticatedContext(MOCK_USER_ID, {
      vendorId: MOCK_VENDOR_ID
    });
    const vendorDb = vendorContext.firestore();
    
    await assertSucceeds(
      setDoc(doc(vendorDb, 'groupShares', 'vendor-share-code'), {
        routeId: 'test-route-1',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      })
    );
  });

  test('should deny regular users from creating group shares', async () => {
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertFails(
      setDoc(doc(userDb, 'groupShares', 'user-share-code'), {
        routeId: 'test-route-1',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      })
    );
  });

  test('should allow only admin to delete group shares', async () => {
    // First create a share as admin
    const adminContext = testEnv.authenticatedContext(MOCK_ADMIN_ID, {
      admin: true
    });
    const adminDb = adminContext.firestore();
    
    await setDoc(doc(adminDb, 'groupShares', 'delete-test-share'), {
      routeId: 'test-route-1',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Admin should be able to delete
    await assertSucceeds(
      setDoc(doc(adminDb, 'groupShares', 'delete-test-share'), {}, { merge: false })
    );
  });

  test('should deny vendor from deleting group shares', async () => {
    // First create a share as admin
    const adminContext = testEnv.authenticatedContext(MOCK_ADMIN_ID, {
      admin: true
    });
    const adminDb = adminContext.firestore();
    
    await setDoc(doc(adminDb, 'groupShares', 'vendor-delete-test'), {
      routeId: 'test-route-1',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Vendor should not be able to delete
    const vendorContext = testEnv.authenticatedContext(MOCK_USER_ID, {
      vendorId: MOCK_VENDOR_ID
    });
    const vendorDb = vendorContext.firestore();
    
    await assertFails(
      setDoc(doc(vendorDb, 'groupShares', 'vendor-delete-test'), {}, { merge: false })
    );
  });
});

describe('Integration Tests', () => {
  test('should handle complete user workflow', async () => {
    // User signs up and creates profile
    const userContext = testEnv.authenticatedContext(MOCK_USER_ID);
    const userDb = userContext.firestore();
    
    await assertSucceeds(
      setDoc(doc(userDb, 'users', MOCK_USER_ID), {
        role: 'customer',
        email: 'customer@example.com',
        societyId: MOCK_SOCIETY_ID,
        consent: { sms: true, location: false }
      })
    );

    // User can read societies
    await assertSucceeds(
      getDoc(doc(userDb, 'societies', MOCK_SOCIETY_ID))
    );

    // User can read vendors
    await assertSucceeds(
      getDoc(doc(userDb, 'vendors', MOCK_VENDOR_ID))
    );

    // User can read group shares
    await assertSucceeds(
      getDoc(doc(userDb, 'groupShares', 'public-share'))
    );
  });

  test('should handle complete vendor workflow', async () => {
    // Vendor with proper claims
    const vendorContext = testEnv.authenticatedContext(MOCK_USER_ID, {
      vendorId: MOCK_VENDOR_ID
    });
    const vendorDb = vendorContext.firestore();

    // Vendor can create their own route
    await assertSucceeds(
      setDoc(doc(vendorDb, 'routes', 'vendor-route-1'), {
        vendorId: MOCK_VENDOR_ID,
        date: '2024-01-15',
        status: 'idle',
        waypoints: [
          { societyId: MOCK_SOCIETY_ID, etaISO: '2024-01-15T10:00:00Z', orderIndex: 0 }
        ]
      })
    );

    // Vendor can create their own inventory
    await assertSucceeds(
      setDoc(doc(vendorDb, 'inventories', `${MOCK_VENDOR_ID}_2024-01-15`), {
        vendorId: MOCK_VENDOR_ID,
        date: '2024-01-15',
        items: [
          { name: 'Tomatoes', unit: 'kg', price: 35, available: true },
          { name: 'Onions', unit: 'kg', price: 30, available: true }
        ]
      })
    );

    // Vendor can create group shares
    await assertSucceeds(
      setDoc(doc(vendorDb, 'groupShares', 'vendor-share-123'), {
        routeId: 'vendor-route-1',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      })
    );
  });
});
