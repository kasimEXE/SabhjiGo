# Firebase Setup Instructions

The authentication errors show that Firebase Authentication providers need to be enabled in your Firebase Console. Here's how to fix this:

## 1. Enable Authentication Providers

Go to your Firebase Console: https://console.firebase.google.com/

### Email/Password Authentication:
1. Navigate to **Authentication > Sign-in method**
2. Click on **Email/Password** 
3. Click **Enable**
4. Save the changes

### Phone Authentication:
1. Still in **Authentication > Sign-in method**
2. Click on **Phone**
3. Click **Enable**
4. You'll need to add your phone number for testing
5. Save the changes

## 2. Add Authorized Domains

In **Authentication > Settings > Authorized domains**:
- Add your Replit domain (something like `your-repl-name.repl.co`)
- Add `localhost` for local development
- The format should be like: `47c069a6-8d9b-462c-b628-e9bdf0ea65d1-00-ewo5hxkbm1ky.kirk.replit.dev`

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll deploy security rules later)
4. Select your preferred region
5. Click **Done**

## 4. Deploy Security Rules (Optional for now)

The security rules are already written in `firestore.rules`. You can deploy them later with:
```bash
firebase deploy --only firestore:rules
```

## 5. Test Authentication

After completing these steps, try:
- Email signup/login
- Phone number authentication (you'll need to add test numbers in Firebase Console)

The current errors will be resolved once these Firebase services are properly configured.