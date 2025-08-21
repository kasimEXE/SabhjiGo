# Complete Firebase Setup Guide for SabhjiGo

## Step 1: Access Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Find your project: Look for project with ID matching your current `VITE_FIREBASE_PROJECT_ID`
4. Click on your project to enter the dashboard

## Step 2: Get Configuration Values

### 2.1 Get Firebase Config Keys
1. In Firebase Console, click the **gear icon** (Settings) in the sidebar
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click on the **Web app** (if you see one) or **Add app** → **Web** if none exists
5. Copy these values from the `firebaseConfig` object:
   - `apiKey`
   - `projectId`
   - `appId` 
   - `messagingSenderId`

**Example config object looks like:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

## Step 3: Enable Authentication Methods

### 3.1 Navigate to Authentication
1. In sidebar, click **Authentication**
2. Click **Get started** if this is your first time
3. Click **Sign-in method** tab

### 3.2 Enable Anonymous Authentication (Required for Demo)
1. Click **Anonymous** in the providers list
2. Toggle **Enable** switch to ON
3. Click **Save**

### 3.3 Enable Email/Password Authentication
1. Click **Email/Password** in the providers list
2. Toggle **Enable** switch to ON (first option)
3. Leave "Email link" disabled for now
4. Click **Save**

### 3.4 Enable Phone Authentication
1. Click **Phone** in the providers list
2. Toggle **Enable** switch to ON
3. Add test phone numbers if needed:
   - Scroll down to **Phone numbers for testing**
   - Add your phone number with verification code (e.g., `+919876543210` → `123456`)
4. Click **Save**

## Step 4: Add Authorized Domains

### 4.1 Add Replit Domain
1. Still in **Authentication** section
2. Click **Settings** tab
3. Scroll to **Authorized domains**
4. Click **Add domain**
5. Add your current Replit URL: `47c069a6-8d9b-462c-b628-e9bdf0ea65d1-00-ewo5hxkbm1ky.kirk.replit.dev`
6. Click **Done**

## Step 5: Create Firestore Database

### 5.1 Set up Firestore
1. In sidebar, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (allows read/write for 30 days)
4. Select your preferred region (choose closest to your users)
5. Click **Done**

### 5.2 Verify Database Creation
- You should see an empty Firestore console
- The database will be automatically configured for your app

## Step 6: Configure Environment Variables

### 6.1 Create .env.local File
Using the values you copied from Step 2, fill in the template below:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012

# Environment Configuration  
VITE_ENV=development

# App Configuration
VITE_APP_NAME=SabhjiGo
VITE_APP_VERSION=1.0.0
VITE_SUPPORT_EMAIL=support@sabhji.go

# PWA Configuration
VITE_PWA_CACHE_VERSION=v1
VITE_OFFLINE_ENABLED=true

# Development Configuration
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug

# Feature Flags
VITE_ENABLE_MAPS=false
VITE_ENABLE_SMS=false
VITE_ENABLE_PUSH_NOTIFICATIONS=false
VITE_ENABLE_ANALYTICS=false

# Firebase Emulator Configuration
VITE_USE_EMULATOR=false
```

## Step 7: Restart Your App

1. Save the `.env.local` file
2. The Replit environment will automatically restart
3. Test authentication methods:
   - Try **Demo Mode** buttons
   - Test **Email signup/login**
   - Test **Phone authentication**

## Expected Results

After completing these steps, you should see:
- ✅ Firebase Test shows all green checkmarks
- ✅ Demo Mode buttons work without errors
- ✅ Email authentication allows signup/login
- ✅ Phone authentication sends real SMS codes
- ✅ All app pages accessible after authentication

## Troubleshooting

### Common Issues:
1. **Still getting auth errors**: Wait 2-3 minutes for changes to propagate
2. **Domain not authorized**: Double-check the exact Replit URL in authorized domains
3. **Phone auth not working**: Verify test phone numbers are added correctly
4. **Environment variables not loading**: Ensure `.env.local` is in the root directory

### Test Commands:
```bash
# Check if environment variables are loaded
echo $VITE_FIREBASE_PROJECT_ID

# Restart the development server
npm run dev
```

Need help with any specific step? I can walk through it in detail!