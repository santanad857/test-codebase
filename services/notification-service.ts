/**
 * Notification service for sending alerts
 */

import { EventEmitter, globalEmitter } from '../core/event-emitter';
import { formatCurrency } from '../core';

export interface NotificationConfig {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

export class NotificationService {
  private config: NotificationConfig;
  private emitter: EventEmitter;
  
  constructor(config: NotificationConfig) {
    this.config = config;
    this.emitter = globalEmitter;
  }
  
  /**
   * Set up event listeners
   * CALLS: EventEmitter.on
   */
  setup(): void {
    // CALL SITE: EventEmitter.on
    this.emitter.on('payment:completed', this.handlePaymentCompleted.bind(this));
    this.emitter.on('subscription:renewed', this.handleSubscriptionRenewed.bind(this));
    this.emitter.on('order:cancelled', this.handleOrderCancelled.bind(this));
  }
  
  private handlePaymentCompleted(data: { orderId: string; transactionId: string }): void {
    this.sendEmail(`Payment completed for order ${data.orderId}`);
  }
  
  private handleSubscriptionRenewed(data: { subscriptionId: string }): void {
    this.sendEmail(`Subscription ${data.subscriptionId} renewed`);
  }
  
  private handleOrderCancelled(data: { orderId: string }): void {
    this.sendEmail(`Order ${data.orderId} was cancelled`);
  }
  
  /**
   * Send email notification
   */
  sendEmail(message: string): void {
    if (this.config.emailEnabled) {
      console.log(`EMAIL: ${message}`);
    }
  }
  
  /**
   * Send SMS notification  
   */
  sendSMS(phone: string, message: string): void {
    if (this.config.smsEnabled) {
      console.log(`SMS to ${phone}: ${message}`);
    }
  }
  
  /**
   * Format amount for notification
   * Uses the formatCurrency helper
   */
  formatAmount(amount: number, currency: string): string {
    return formatCurrency(amount, currency);
  }
}
