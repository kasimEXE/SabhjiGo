// Firebase Configuration Validator
export function validateFirebaseConfig() {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
  };

  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    config: config
  };

  // Check required fields
  const requiredFields = ['apiKey', 'projectId', 'appId', 'messagingSenderId'];
  
  requiredFields.forEach(field => {
    if (!config[field] || config[field].includes('paste_your_') || config[field].includes('your_')) {
      validation.isValid = false;
      validation.errors.push(`${field} is missing or contains placeholder text`);
    }
  });

  // Validate format
  if (config.apiKey && !config.apiKey.startsWith('AIza')) {
    validation.warnings.push('API Key should start with "AIza"');
  }

  if (config.appId && !config.appId.includes(':web:')) {
    validation.warnings.push('App ID should contain ":web:"');
  }

  if (config.messagingSenderId && config.messagingSenderId.length !== 12) {
    validation.warnings.push('Messaging Sender ID should be 12 digits');
  }

  return validation;
}

export function displayConfigStatus() {
  const validation = validateFirebaseConfig();
  
  console.group('🔥 Firebase Configuration Status');
  
  if (validation.isValid) {
    console.log('✅ Configuration is valid');
  } else {
    console.log('❌ Configuration has errors');
    validation.errors.forEach(error => console.error(`   • ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    validation.warnings.forEach(warning => console.warn(`   • ${warning}`));
  }

  console.log('📋 Current config:');
  console.table({
    'API Key': validation.config.apiKey ? `${validation.config.apiKey.substring(0, 10)}...` : 'Missing',
    'Project ID': validation.config.projectId || 'Missing',
    'App ID': validation.config.appId ? `${validation.config.appId.substring(0, 20)}...` : 'Missing',
    'Sender ID': validation.config.messagingSenderId || 'Missing'
  });
  
  console.groupEnd();
  
  return validation;
}