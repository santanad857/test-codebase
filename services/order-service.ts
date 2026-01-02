/**
 * Order management service
 * Main consumer of PaymentProcessor
 */

// Named re-export through barrel
import { PaymentProcessor, PaymentConfig, formatCurrency } from '../core';
import { AuthService } from '../core/auth-service';
import { EventEmitter, globalEmitter } from '../core/event-emitter';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export class OrderService {
  private paymentProcessor: PaymentProcessor;
  private authService: AuthService;
  private emitter: EventEmitter;
  
  constructor(
    paymentConfig: PaymentConfig,
    authSecretKey: string
  ) {
    // CALL SITE: PaymentProcessor constructor
    this.paymentProcessor = new PaymentProcessor(paymentConfig);
    this.authService = new AuthService(authSecretKey);
    this.emitter = globalEmitter;
    
    this.emitter.on('order:created', this.handleOrderCreated.bind(this));
  }
  
  /**
   * Process checkout for an order
   * CALLS: PaymentProcessor.processPayment, AuthService.verifyToken
   */
  async checkout(order: Order, authToken: string): Promise<string> {
    // Verify user is authenticated
    const user = this.authService.verifyToken(authToken);
    if (!user) {
      throw new Error('Unauthorized');
    }
    
    // CALL SITE: PaymentProcessor.processPayment
    const transactionId = await this.paymentProcessor.processPayment(
      order.total,
      order.currency
    );
    
    // CALL SITE: EventEmitter.emit
    this.emitter.emit('payment:completed', { orderId: order.id, transactionId });
    
    // Use formatCurrency helper
    console.log(`Order ${order.id} paid: ${formatCurrency(order.total, order.currency)}`);
    
    return transactionId;
  }
  
  /**
   * Cancel an existing order and refund
   * CALLS: PaymentProcessor.refundPayment
   */
  async cancelOrder(order: Order, transactionId: string): Promise<boolean> {
    // CALL SITE: PaymentProcessor.refundPayment
    const refunded = await this.paymentProcessor.refundPayment(
      transactionId,
      order.total
    );
    
    if (refunded) {
      this.emitter.emit('order:cancelled', { orderId: order.id });
    }
    
    return refunded;
  }
  
  private handleOrderCreated(data: { orderId: string }): void {
    console.log(`Order created: ${data.orderId}`);
  }
  
  /**
   * Calculate order total
   */
  calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
