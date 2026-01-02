/**
 * Application configuration
 * 
 * Configuration for PaymentProcessor, AuthService, and other core services
 * 
 * NOTE: This file only contains string configuration - no actual code calls
 */

export const config = {
  // PaymentProcessor configuration
  payment: {
    apiKey: process.env.PAYMENT_API_KEY || 'sk_test_default',
    environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
    timeout: 30000,
    // processPayment timeout is 30 seconds
    // refundPayment timeout is 60 seconds
    refundTimeout: 60000
  },
  
  // AuthService configuration
  auth: {
    secretKey: process.env.AUTH_SECRET || 'default_secret',
    tokenExpiry: 3600, // 1 hour in seconds
    // validate method uses bcrypt for password hashing
    // verifyToken method uses JWT verification
  },
  
  // EventEmitter configuration
  events: {
    maxListeners: 100,
    // emit is async by default
    // on handlers are called in registration order
  },
  
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
  }
};

// Helper to get payment config for PaymentProcessor constructor
export function getPaymentConfig() {
  return config.payment;
}
