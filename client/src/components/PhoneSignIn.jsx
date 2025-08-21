import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase";

function PhoneSignIn() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setLoading(true);
    setError("");

    try {
      setupRecaptcha();
      const formattedPhone = `+91${phoneNumber}`;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
    } catch (error) {
      let errorMessage = "Failed to send OTP. Please try again.";
      
      switch (error.code) {
        case 'auth/configuration-not-found':
          errorMessage = "Firebase Phone Authentication is not properly configured. Please check FIREBASE_SETUP.md";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many requests. Please try again later.";
          break;
        case 'auth/invalid-phone-number':
          errorMessage = "Please enter a valid phone number.";
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error("Error sending OTP:", error);
    }

    setLoading(false);
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || !verificationId) return;

    setLoading(true);
    setError("");

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      // User will be automatically redirected by AuthGate
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      console.error("Error verifying OTP:", error);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-phone text-green-500 text-xl"></i>
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-gray-900">Sign in with Phone</h3>
        <p className="text-gray-600">Quick and secure verification</p>
      </div>

      {!otpSent ? (
        <form onSubmit={sendOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">+91</span>
              </div>
              <input 
                type="tel" 
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
                maxLength="10"
              />
            </div>
          </div>

          <div id="recaptcha-container"></div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !phoneNumber}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOTP} className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-900">Enter Verification Code</h4>
            <p className="text-sm text-gray-600 mb-3">
              We sent a 6-digit code to +91{phoneNumber}
            </p>
            <input 
              type="text" 
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none mb-3"
              maxLength="6"
              required
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || !otp}
              className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <button 
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setError("");
              }}
              className="w-full mt-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              Change phone number
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PhoneSignIn;
