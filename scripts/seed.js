#!/usr/bin/env node

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { societies, vendors, getTodayRoute, getTodayInventory, getGroupShares } from "./seedData.js";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

// Check if document exists (for idempotency)
async function documentExists(collection, docId) {
  try {
    const docRef = doc(db, collection, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    log.error(`Error checking document ${collection}/${docId}: ${error.message}`);
    return false;
  }
}

// Seed societies
async function seedSocieties() {
  log.header('\n🏘️  Seeding Societies...');
  
  for (const society of societies) {
    try {
      const exists = await documentExists('societies', society.id);
      
      if (exists) {
        log.warning(`Society '${society.name}' already exists, skipping`);
        continue;
      }

      const societyData = {
        ...society,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'societies', society.id), societyData);
      log.success(`Created society: ${society.name} (${society.area})`);
    } catch (error) {
      log.error(`Failed to create society ${society.name}: ${error.message}`);
    }
  }
}

// Seed vendors
async function seedVendors() {
  log.header('\n🚚 Seeding Vendors...');
  
  for (const vendor of vendors) {
    try {
      const exists = await documentExists('vendors', vendor.id);
      
      if (exists) {
        log.warning(`Vendor '${vendor.name}' already exists, skipping`);
        continue;
      }

      const vendorData = {
        ...vendor,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'vendors', vendor.id), vendorData);
      log.success(`Created vendor: ${vendor.name} (serves ${vendor.societiesServed.length} societies)`);
    } catch (error) {
      log.error(`Failed to create vendor ${vendor.name}: ${error.message}`);
    }
  }
}

// Seed routes
async function seedRoutes() {
  log.header('\n🛣️  Seeding Today\'s Routes...');
  
  for (const vendor of vendors) {
    try {
      const route = getTodayRoute(vendor.id, societies);
      const exists = await documentExists('routes', route.id);
      
      if (exists) {
        log.warning(`Route for ${vendor.name} today already exists, skipping`);
        continue;
      }

      const routeData = {
        ...route,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'routes', route.id), routeData);
      log.success(`Created route for ${vendor.name}: ${route.waypoints.length} waypoints, status: ${route.status}`);
    } catch (error) {
      log.error(`Failed to create route for ${vendor.name}: ${error.message}`);
    }
  }
}

// Seed inventories
async function seedInventories() {
  log.header('\n📦 Seeding Today\'s Inventories...');
  
  for (const vendor of vendors) {
    try {
      const inventory = getTodayInventory(vendor.id);
      const exists = await documentExists('inventories', inventory.id);
      
      if (exists) {
        log.warning(`Inventory for ${vendor.name} today already exists, skipping`);
        continue;
      }

      const inventoryData = {
        ...inventory,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'inventories', inventory.id), inventoryData);
      const availableItems = inventory.items.filter(item => item.available).length;
      log.success(`Created inventory for ${vendor.name}: ${inventory.items.length} total items, ${availableItems} available`);
    } catch (error) {
      log.error(`Failed to create inventory for ${vendor.name}: ${error.message}`);
    }
  }
}

// Seed group shares
async function seedGroupShares() {
  log.header('\n🔗 Seeding Group Shares...');
  
  const shares = getGroupShares();
  
  for (const share of shares) {
    try {
      const exists = await documentExists('groupShares', share.id);
      
      if (exists) {
        log.warning(`Group share '${share.shareCode}' already exists, skipping`);
        continue;
      }

      const shareData = {
        ...share,
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'groupShares', share.id), shareData);
      log.success(`Created group share: ${share.shareCode} (expires in 24h)`);
    } catch (error) {
      log.error(`Failed to create group share ${share.shareCode}: ${error.message}`);
    }
  }
}

// Main seeding function
async function seedAll() {
  log.header('🌱 SabhjiGo Database Seeding Started');
  log.info(`Project: ${process.env.VITE_FIREBASE_PROJECT_ID}`);
  log.info(`Environment: ${process.env.VITE_ENV || 'development'}`);
  
  try {
    await seedSocieties();
    await seedVendors();
    await seedRoutes();
    await seedInventories();
    await seedGroupShares();
    
    log.header('\n🎉 Seeding completed successfully!');
    log.info('You can now:');
    log.info('• Browse vendors by society in the customer view');
    log.info('• View today\'s routes and inventories in vendor dashboards');
    log.info('• Test the public ShareView with code: demo-share-123');
    
  } catch (error) {
    log.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

// Check for required environment variables
function checkEnvironment() {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    log.error('Missing required environment variables:');
    missing.forEach(key => log.error(`  - ${key}`));
    log.info('Please set these in your Replit Secrets or .env file');
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === '--help' || command === '-h') {
  console.log(`
${colors.bold}SabhjiGo Database Seeder${colors.reset}

Usage:
  npm run seed              # Seed all data
  npm run seed:societies    # Seed only societies
  npm run seed:vendors      # Seed only vendors
  npm run seed:routes       # Seed only routes
  npm run seed:inventories  # Seed only inventories
  npm run seed:shares       # Seed only group shares

Options:
  --help, -h               # Show this help
  
Environment Variables Required:
  VITE_FIREBASE_API_KEY
  VITE_FIREBASE_PROJECT_ID
  VITE_FIREBASE_APP_ID
  VITE_FIREBASE_MESSAGING_SENDER_ID (optional)
`);
  process.exit(0);
}

// Run appropriate seeding function
checkEnvironment();

switch (command) {
  case 'societies':
    seedSocieties().then(() => process.exit(0));
    break;
  case 'vendors':
    seedVendors().then(() => process.exit(0));
    break;
  case 'routes':
    seedRoutes().then(() => process.exit(0));
    break;
  case 'inventories':
    seedInventories().then(() => process.exit(0));
    break;
  case 'shares':
    seedGroupShares().then(() => process.exit(0));
    break;
  default:
    seedAll().then(() => process.exit(0));
}