/**
 * Payment webhook handler - processes external payment events
 */

import { globalEmitter } from '../core/event-emitter';
import { PaymentProcessor } from '../core';

export interface WebhookEvent {
  type: 'payment.completed' | 'payment.failed' | 'refund.completed';
  data: {
    transactionId: string;
    amount: number;
    currency: string;
  };
}

export class PaymentWebhook {
  /**
   * Handle incoming webhook event
   * CALLS: EventEmitter.emit
   */
  async handleEvent(event: WebhookEvent): Promise<void> {
    switch (event.type) {
      case 'payment.completed':
        // CALL SITE: EventEmitter.emit
        globalEmitter.emit('external:payment:completed', event.data);
        break;
        
      case 'payment.failed':
        globalEmitter.emit('external:payment:failed', event.data);
        break;
        
      case 'refund.completed':
        globalEmitter.emit('external:refund:completed', event.data);
        break;
    }
  }
  
  /**
   * Verify webhook signature (placeholder)
   */
  verifySignature(payload: string, signature: string): boolean {
    // In real implementation, verify HMAC signature
    return signature.startsWith('sig_');
  }
}

// Factory function using static method
export function createDefaultProcessor(): PaymentProcessor {
  // CALL SITE: PaymentProcessor.createDefault (static method)
  return PaymentProcessor.createDefault();
}
