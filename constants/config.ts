// API Configuration
export const API_URL = 'https://korkemapp.onrender.com'; 

// Security Configuration
export const SECURITY_CONFIG = {
  // Token expiration check interval (in minutes)
  TOKEN_CHECK_INTERVAL: 5,
  
  // Maximum retry attempts for API calls
  MAX_RETRY_ATTEMPTS: 3,
  
  // Request timeout (in milliseconds)
  REQUEST_TIMEOUT: 10000,
  
  // Rate limiting for client-side requests
  RATE_LIMIT_DELAY: 1000,
};

// App Configuration
export const APP_CONFIG = {
  // App version
  VERSION: '1.0.0',
  
  // Supported languages
  SUPPORTED_LANGUAGES: ['en', 'ru', 'kz'],
  
  // Default language
  DEFAULT_LANGUAGE: 'en',
  
  // Cache expiration time (in hours)
  CACHE_EXPIRATION: 24,
}; 