# Firebase Setup Instructions - CRITICAL

## Current Issue: auth/admin-restricted-operation

The error `auth/admin-restricted-operation` means Firebase Authentication is not properly configured in your Firebase Console. **This is required to test the app.**

## Quick Fix Steps (5 minutes):

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/
Select your project: `${VITE_FIREBASE_PROJECT_ID}`

### 2. Enable Authentication Methods
Navigate to **Authentication > Sign-in method** and enable:

**For Demo Mode (Required):**
- Click **Anonymous** → **Enable** → **Save**

**For Full Testing (Recommended):**
- Click **Email/Password** → **Enable** → **Save** 
- Click **Phone** → **Enable** → **Save**

### 3. Add Your Replit Domain
In **Authentication > Settings > Authorized domains**, click **Add domain** and add:
```
your-repl-url-here.replit.dev
```
(Replace with your actual Replit URL from the address bar)

### 4. Create Firestore Database
Go to **Firestore Database** → **Create database**
- Choose **Start in test mode** 
- Select your preferred region
- Click **Done**

## Expected Result
After these steps:
- ✅ Demo Mode buttons will work
- ✅ Email/Phone authentication will work  
- ✅ Firebase Test will show all green checkmarks
- ✅ App can store/retrieve data properly

## If Still Having Issues
1. Double-check the project ID matches your environment variable
2. Verify the domain is exactly as shown in your browser
3. Wait 1-2 minutes after enabling services for changes to propagate

The app is fully built and ready - it just needs Firebase services enabled to test authentication flows.