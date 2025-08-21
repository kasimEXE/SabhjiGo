# SabhjiGo - Fresh Vegetables for Your Society

A Progressive Web App connecting apartment societies with street vegetable vendors in Pune. Built with React, Firebase, and offline-first architecture.

## 🚀 Features

- **Phone & Email Authentication** - Secure sign-in with Firebase Auth
- **Real-time Vendor Tracking** - Track vegetable vendors serving your society
- **Inventory Management** - Vendors can update prices and availability in real-time
- **Offline Support** - Works even with poor connectivity using IndexedDB persistence
- **PWA Capabilities** - Install on mobile devices for native app experience
- **Privacy Controls** - Granular consent management for SMS and location sharing
- **Route Sharing** - Public sharing of vendor routes with society members

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **PWA**: Service Worker, Web App Manifest
- **Testing**: Firebase Rules Unit Testing
- **State Management**: React Query for server state
- **Routing**: Wouter (lightweight React router)

## 📋 Prerequisites

- Node.js 16+ 
- Firebase project with Firestore and Authentication enabled
- Modern web browser with PWA support

## 🔧 Setup Instructions

### 1. Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable Authentication with Phone and Email providers:
   - Go to Authentication > Sign-in method
   - Enable "Phone" and "Email/Password" providers
   - Add your development domain to authorized domains
3. Enable Firestore Database:
   - Go to Firestore Database > Create database
   - Start in test mode (security rules will be deployed later)
4. Get your Firebase configuration:
   - Go to Project Settings > General > Your apps
   - Add a web app and copy the config values

### 2. Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd sabhji-go
