/**
 * Login controller - handles user authentication
 */

import { AuthService, User, AuthToken } from '../core/auth-service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export class LoginController {
  private authService: AuthService;
  
  constructor(secretKey: string) {
    this.authService = new AuthService(secretKey);
  }
  
  /**
   * Handle login request
   * CALLS: AuthService.validate, AuthService.generateToken
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    // CALL SITE: AuthService.validate
    const user = await this.authService.validate(request.email, request.password);
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }
    
    // CALL SITE: AuthService.generateToken
    const tokenData = this.authService.generateToken(user);
    
    return {
      success: true,
      token: tokenData.token,
      user
    };
  }
}
