import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function EmailSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // User will be automatically redirected by AuthGate
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password.";
          break;
        case 'auth/email-already-in-use':
          errorMessage = "An account already exists with this email.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/configuration-not-found':
          errorMessage = "Firebase Authentication is not properly configured. Please check the setup instructions in FIREBASE_SETUP.md";
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error("Email auth error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-envelope text-blue-500 text-xl"></i>
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-gray-900">
          {isSignUp ? 'Create Account' : 'Sign in with Email'}
        </h3>
        <p className="text-gray-600">Use your email address</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input 
            type="email" 
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
              minLength="6"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-500`}></i>
            </button>
          </div>
        </div>

        {!isSignUp && (
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <button type="button" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !email || !password}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>

        <div className="text-center">
          <span className="text-gray-600 text-sm">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-blue-500 hover:underline text-sm font-medium"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailSignIn;
