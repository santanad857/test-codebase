/**
 * Core payment processing module
 * PaymentProcessor is used throughout the codebase
 */

export interface PaymentConfig {
  apiKey: string;
  environment: 'sandbox' | 'production';
  timeout: number;
}

export class PaymentProcessor {
  private config: PaymentConfig;
  
  constructor(config: PaymentConfig) {
    this.config = config;
  }
  
  /**
   * Process a payment transaction
   * Called by: OrderService.checkout, SubscriptionManager.renewSubscription
   */
  async processPayment(amount: number, currency: string): Promise<string> {
    // Process payment logic
    const transactionId = this.generateTransactionId();
    await this.validateAmount(amount);
    return transactionId;
  }
  
  /**
   * Refund a previous transaction
   * Called by: OrderService.cancelOrder, RefundController.handleRefund
   */
  async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    await this.validateAmount(amount);
    return true;
  }
  
  private generateTransactionId(): string {
    return `txn_${Date.now()}`;
  }
  
  async validateAmount(amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error('Invalid amount');
    }
  }

  static createDefault(): PaymentProcessor {
    return new PaymentProcessor({
      apiKey: 'default',
      environment: 'sandbox',
      timeout: 30000
    });
  }
}

// Helper function - also exported
export function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}
