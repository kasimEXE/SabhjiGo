// Seed data definitions for SabhjiGo
import { serverTimestamp } from "firebase/firestore";

export const societies = [
  {
    id: 'sunshine-apartments',
    name: 'Sunshine Apartments',
    area: 'Kothrud',
    address: 'Kothrud, Pune, Maharashtra 411038',
    lat: 18.5074,
    lng: 73.8077,
    totalUnits: 120,
    contactPerson: 'Amit Sharma',
    contactPhone: '+919876543210'
  },
  {
    id: 'green-valley',
    name: 'Green Valley Society',
    area: 'Baner',
    address: 'Baner, Pune, Maharashtra 411045',
    lat: 18.5679,
    lng: 73.7781,
    totalUnits: 85,
    contactPerson: 'Priya Patel',
    contactPhone: '+919123456789'
  },
  {
    id: 'royal-residency',
    name: 'Royal Residency',
    area: 'Wakad',
    address: 'Wakad, Pune, Maharashtra 411057',
    lat: 18.5975,
    lng: 73.7898,
    totalUnits: 200,
    contactPerson: 'Rajesh Kumar',
    contactPhone: '+919988776655'
  }
];

export const vendors = [
  {
    id: 'vendor-ramesh',
    name: 'Ramesh Vegetable Vendor',
    phone: '+919876543210',
    vehicleType: 'auto',
    vehicleNumber: 'MH 12 AB 1234',
    societiesServed: ['sunshine-apartments', 'green-valley'],
    startTime: '08:00',
    endTime: '18:00',
    experience: '15 years',
    speciality: 'Fresh organic vegetables',
    rating: 4.8,
    totalSales: 125000
  },
  {
    id: 'vendor-sunil',
    name: 'Sunil Fresh Vegetables',
    phone: '+919123456789',
    vehicleType: 'tempo',
    vehicleNumber: 'MH 12 CD 5678',
    societiesServed: ['green-valley', 'royal-residency'],
    startTime: '07:30',
    endTime: '17:30',
    experience: '10 years',
    speciality: 'Leafy greens and seasonal vegetables',
    rating: 4.6,
    totalSales: 98000
  }
];

export const getTodayRoute = (vendorId, societies) => {
  const today = new Date().toISOString().split('T')[0];
  
  if (vendorId === 'vendor-ramesh') {
    return {
      id: `${vendorId}_${today}`,
      vendorId,
      date: today,
      status: 'active',
      startTime: '08:30',
      waypoints: [
        {
          societyId: 'sunshine-apartments',
          societyName: 'Sunshine Apartments',
          orderIndex: 0,
          etaISO: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
          status: 'enroute',
          estimatedDuration: 30
        },
        {
          societyId: 'green-valley',
          societyName: 'Green Valley Society',
          orderIndex: 1,
          etaISO: new Date(Date.now() + 120 * 60 * 1000).toISOString(), // 2 hours from now
          status: 'pending',
          estimatedDuration: 45
        }
      ],
      lastLocation: {
        lat: 18.5074,
        lng: 73.8077,
        ts: serverTimestamp(),
        accuracy: 10
      }
    };
  } else {
    return {
      id: `${vendorId}_${today}`,
      vendorId,
      date: today,
      status: 'idle',
      startTime: '07:30',
      waypoints: [
        {
          societyId: 'green-valley',
          societyName: 'Green Valley Society',
          orderIndex: 0,
          etaISO: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
          status: 'pending',
          estimatedDuration: 40
        },
        {
          societyId: 'royal-residency',
          societyName: 'Royal Residency',
          orderIndex: 1,
          etaISO: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // 1.5 hours from now
          status: 'pending',
          estimatedDuration: 50
        }
      ],
      lastLocation: null
    };
  }
};

export const getTodayInventory = (vendorId) => {
  const today = new Date().toISOString().split('T')[0];
  
  if (vendorId === 'vendor-ramesh') {
    return {
      id: `${vendorId}_${today}`,
      vendorId,
      date: today,
      items: [
        { name: 'Tomatoes', unit: 'kg', price: 35, available: true, stock: 25 },
        { name: 'Onions', unit: 'kg', price: 30, available: true, stock: 40 },
        { name: 'Potatoes', unit: 'kg', price: 25, available: true, stock: 50 },
        { name: 'Carrots', unit: 'kg', price: 40, available: true, stock: 15 },
        { name: 'Green Chillies', unit: 'kg', price: 60, available: true, stock: 8 },
        { name: 'Spinach', unit: 'bundle', price: 25, available: true, stock: 20 },
        { name: 'Coriander', unit: 'bundle', price: 15, available: true, stock: 30 },
        { name: 'Cauliflower', unit: 'piece', price: 45, available: true, stock: 12 },
        { name: 'Cabbage', unit: 'piece', price: 35, available: true, stock: 18 },
        { name: 'Capsicum', unit: 'kg', price: 50, available: true, stock: 10 },
        { name: 'Cucumber', unit: 'kg', price: 25, available: true, stock: 20 },
        { name: 'Bottle Gourd', unit: 'piece', price: 40, available: false, stock: 0 },
        { name: 'Okra (Bhindi)', unit: 'kg', price: 45, available: true, stock: 12 },
        { name: 'Brinjal', unit: 'kg', price: 35, available: true, stock: 15 },
        { name: 'Ginger', unit: 'kg', price: 80, available: true, stock: 5 }
      ]
    };
  } else {
    return {
      id: `${vendorId}_${today}`,
      vendorId,
      date: today,
      items: [
        { name: 'Tomatoes', unit: 'kg', price: 38, available: true, stock: 30 },
        { name: 'Onions', unit: 'kg', price: 32, available: true, stock: 35 },
        { name: 'Potatoes', unit: 'kg', price: 28, available: true, stock: 45 },
        { name: 'Lady Finger', unit: 'kg', price: 42, available: true, stock: 18 },
        { name: 'Green Beans', unit: 'kg', price: 55, available: true, stock: 12 },
        { name: 'Methi (Fenugreek)', unit: 'bundle', price: 20, available: true, stock: 25 },
        { name: 'Mint Leaves', unit: 'bundle', price: 15, available: true, stock: 15 },
        { name: 'Radish', unit: 'kg', price: 30, available: true, stock: 20 },
        { name: 'Beetroot', unit: 'kg', price: 40, available: true, stock: 15 },
        { name: 'Sweet Potato', unit: 'kg', price: 35, available: true, stock: 25 },
        { name: 'Drumsticks', unit: 'kg', price: 65, available: true, stock: 8 },
        { name: 'Cluster Beans', unit: 'kg', price: 48, available: false, stock: 0 },
        { name: 'Ridge Gourd', unit: 'piece', price: 25, available: true, stock: 20 },
        { name: 'Snake Gourd', unit: 'piece', price: 30, available: true, stock: 15 },
        { name: 'Garlic', unit: 'kg', price: 120, available: true, stock: 8 }
      ]
    };
  }
};

export const getGroupShares = () => [
  {
    id: 'demo-share-123',
    routeId: 'vendor-ramesh_' + new Date().toISOString().split('T')[0],
    shareCode: 'demo-share-123',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    createdBy: 'vendor-ramesh',
    title: 'Ramesh Vegetables - Today\'s Route',
    description: 'Track our fresh vegetable delivery to Sunshine Apartments and Green Valley'
  }
];