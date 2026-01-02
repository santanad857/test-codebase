/**
 * Subscription management service
 * Another consumer of PaymentProcessor
 */

// Import through named re-export from core
import { PaymentProcessor, PaymentConfig } from '../core';
import { globalEmitter } from '../core/event-emitter';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  nextBillingDate: Date;
  status: 'active' | 'cancelled' | 'expired';
}

export class SubscriptionManager {
  private processor: PaymentProcessor;
  
  constructor(config: PaymentConfig) {
    // CALL SITE: PaymentProcessor constructor
    this.processor = new PaymentProcessor(config);
  }
  
  /**
   * Renew a subscription by charging the user
   * CALLS: PaymentProcessor.processPayment
   */
  async renewSubscription(subscription: Subscription): Promise<string> {
    // CALL SITE: PaymentProcessor.processPayment
    const transactionId = await this.processor.processPayment(
      subscription.amount,
      subscription.currency
    );
    
    globalEmitter.emit('subscription:renewed', {
      subscriptionId: subscription.id,
      transactionId
    });
    
    return transactionId;
  }
  
  /**
   * Cancel subscription and optionally refund
   * CALLS: PaymentProcessor.refundPayment (conditional)
   */
  async cancelSubscription(
    subscription: Subscription,
    transactionId: string,
    shouldRefund: boolean
  ): Promise<void> {
    if (shouldRefund) {
      // CALL SITE: PaymentProcessor.refundPayment
      await this.processor.refundPayment(transactionId, subscription.amount);
    }
    
    globalEmitter.emit('subscription:cancelled', {
      subscriptionId: subscription.id
    });
  }
  
  /**
   * Upgrade subscription to a new plan
   * CALLS: PaymentProcessor.processPayment for difference
   */
  async upgradeSubscription(
    subscription: Subscription,
    newAmount: number
  ): Promise<string> {
    const proratedAmount = newAmount - subscription.amount;
    
    if (proratedAmount > 0) {
      // CALL SITE: PaymentProcessor.processPayment
      return await this.processor.processPayment(proratedAmount, subscription.currency);
    }
    
    return 'no_charge';
  }
}
