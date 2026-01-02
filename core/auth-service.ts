/**
 * Authentication service
 * Contains validate() method - different from PaymentProcessor.validateAmount()
 */

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
  user: User;
}

export class AuthService {
  private secretKey: string;
  
  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }
  
  /**
   * Validate user credentials
   * Called by: LoginController.login, ApiGateway.authenticate
   * NOTE: This is NOT PaymentProcessor.validateAmount - different validate
   */
  async validate(email: string, password: string): Promise<User | null> {
    // Validation logic
    if (email && password) {
      return { id: '1', email, role: 'user' };
    }
    return null;
  }
  
  /**
   * Generate authentication token
   * Called by: LoginController.login
   */
  generateToken(user: User): AuthToken {
    return {
      token: `token_${user.id}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600000),
      user
    };
  }
  
  /**
   * Verify an existing token
   * Called by: ApiGateway.authenticate, OrderService.checkout
   */
  verifyToken(token: string): User | null {
    // Token verification logic
    if (token.startsWith('token_')) {
      return { id: '1', email: 'test@test.com', role: 'user' };
    }
    return null;
  }
  
  /**
   * Revoke a user's token
   * Called by: LogoutController.logout
   */
  revokeToken(token: string): void {
    // Revoke logic
  }
}

export default AuthService;
