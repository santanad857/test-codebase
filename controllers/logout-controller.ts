/**
 * Logout controller - handles user logout
 */

import { AuthService } from '../core/auth-service';

export interface LogoutRequest {
  token: string;
}

export interface LogoutResponse {
  success: boolean;
}

export class LogoutController {
  private authService: AuthService;
  
  constructor(secretKey: string) {
    this.authService = new AuthService(secretKey);
  }
  
  /**
   * Handle logout request
   * CALLS: AuthService.revokeToken
   */
  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    // CALL SITE: AuthService.revokeToken
    this.authService.revokeToken(request.token);
    
    return { success: true };
  }
}
