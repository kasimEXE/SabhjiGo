import { useState } from "react";
import { validateFirebaseConfig } from "../utils/configValidator";

function FirebaseSetupGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const config = validateFirebaseConfig();
  
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}`;
  
  const steps = [
    {
      title: "1. Verify Firebase Project",
      description: "First, let's make sure your Firebase project exists and is accessible",
      action: (
        <div className="space-y-3">
          <p className="text-sm">Your project ID: <code className="bg-gray-100 px-2 py-1 rounded">{projectId}</code></p>
          <a 
            href={consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <i className="fas fa-external-link-alt mr-2"></i>
            Open Your Firebase Project
          </a>
          <p className="text-xs text-gray-600">
            If this link doesn't work, your project ID might be incorrect.
          </p>
        </div>
      )
    },
    {
      title: "2. Create Firestore Database",
      description: "The main issue is likely that Firestore database doesn't exist yet",
      action: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-800 mb-2">⚠️ Critical Step</h5>
            <p className="text-yellow-700 text-sm">
              The "offline" errors indicate Firestore database isn't created or accessible.
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium">Follow these steps in Firebase Console:</p>
            <ol className="text-sm space-y-2 ml-4">
              <li>1. In the left sidebar, click <strong>"Firestore Database"</strong></li>
              <li>2. Click <strong>"Create database"</strong></li>
              <li>3. Choose <strong>"Start in test mode"</strong> (allows read/write access)</li>
              <li>4. Select your preferred region (closest to your users)</li>
              <li>5. Click <strong>"Done"</strong></li>
            </ol>
          </div>
          
          <a 
            href={`${consoleUrl}/firestore`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <i className="fas fa-database mr-2"></i>
            Go to Firestore Database
          </a>
        </div>
      )
    },
    {
      title: "3. Enable Authentication",
      description: "Set up authentication methods for user sign-in",
      action: (
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">Enable these authentication methods:</p>
            <ol className="text-sm space-y-2 ml-4">
              <li>1. Go to <strong>"Authentication"</strong> → <strong>"Sign-in method"</strong></li>
              <li>2. Enable <strong>"Anonymous"</strong> (for demo mode)</li>
              <li>3. Enable <strong>"Email/Password"</strong> (for user accounts)</li>
              <li>4. Optionally enable <strong>"Phone"</strong> (for SMS login)</li>
            </ol>
          </div>
          
          <a 
            href={`${consoleUrl}/authentication/users`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <i className="fas fa-key mr-2"></i>
            Go to Authentication
          </a>
        </div>
      )
    },
    {
      title: "4. Add Authorized Domain",
      description: "Allow your Replit app to access Firebase",
      action: (
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">Add your Replit domain:</p>
            <ol className="text-sm space-y-2 ml-4">
              <li>1. In Authentication, go to <strong>"Settings"</strong> tab</li>
              <li>2. Scroll to <strong>"Authorized domains"</strong></li>
              <li>3. Click <strong>"Add domain"</strong></li>
              <li>4. Add: <code className="bg-gray-100 px-2 py-1 rounded">{window.location.hostname}</code></li>
            </ol>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-sm">
              <strong>Your current domain:</strong> <code>{window.location.hostname}</code>
            </p>
          </div>
          
          <a 
            href={`${consoleUrl}/authentication/settings`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <i className="fas fa-globe mr-2"></i>
            Go to Auth Settings
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white border rounded-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-red-600 mb-2">🚨 Firebase Setup Required</h3>
        <p className="text-gray-600">
          Your app is getting "offline" errors because Firestore database needs to be set up.
        </p>
      </div>

      {/* Configuration Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Current Configuration Status:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Project ID: {projectId ? '✅' : '❌'}</div>
          <div>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅' : '❌'}</div>
          <div>App ID: {import.meta.env.VITE_FIREBASE_APP_ID ? '✅' : '❌'}</div>
          <div>Messaging Sender: {import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅' : '❌'}</div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentStep === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Step {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="border rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-3">{steps[currentStep].title}</h4>
        <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
        {steps[currentStep].action}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600"
        >
          Next
        </button>
      </div>

      {/* Quick Fix Summary */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h5 className="font-medium text-green-800 mb-2">🎯 Quick Fix Priority</h5>
        <p className="text-green-700 text-sm">
          <strong>Most Important:</strong> Step 2 (Create Firestore Database) will likely fix the "offline" errors.
          The database needs to exist before your app can connect to it.
        </p>
      </div>
    </div>
  );
}

export default FirebaseSetupGuide;