/**
 * API Gateway - handles authentication middleware
 */

import { AuthService, User } from '../core/auth-service';

export interface ApiRequest {
  path: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}

export interface ApiResponse {
  statusCode: number;
  body: unknown;
}

export class ApiGateway {
  private authService: AuthService;
  private publicPaths: string[];
  
  constructor(secretKey: string, publicPaths: string[] = []) {
    this.authService = new AuthService(secretKey);
    this.publicPaths = publicPaths;
  }
  
  /**
   * Authenticate incoming requests
   * CALLS: AuthService.verifyToken, AuthService.validate
   */
  async authenticate(request: ApiRequest): Promise<User | null> {
    // Skip auth for public paths
    if (this.publicPaths.includes(request.path)) {
      return null;
    }
    
    const authHeader = request.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    
    // CALL SITE: AuthService.verifyToken
    return this.authService.verifyToken(token);
  }
  
  /**
   * Handle request with middleware
   */
  async handleRequest(
    request: ApiRequest,
    handler: (user: User | null) => Promise<ApiResponse>
  ): Promise<ApiResponse> {
    const user = await this.authenticate(request);
    
    if (!user && !this.publicPaths.includes(request.path)) {
      return {
        statusCode: 401,
        body: { error: 'Unauthorized' }
      };
    }
    
    return handler(user);
  }
}
