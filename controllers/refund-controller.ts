/**
 * Refund controller - handles refund requests
 */

import { PaymentProcessor, PaymentConfig } from '../core';

export interface RefundRequest {
  transactionId: string;
  amount: number;
  reason: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  error?: string;
}

export class RefundController {
  private processor: PaymentProcessor;
  
  constructor(config: PaymentConfig) {
    // CALL SITE: PaymentProcessor constructor
    this.processor = new PaymentProcessor(config);
  }
  
  /**
   * Handle refund request from API
   * CALLS: PaymentProcessor.refundPayment
   */
  async handleRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      // CALL SITE: PaymentProcessor.refundPayment
      const success = await this.processor.refundPayment(
        request.transactionId,
        request.amount
      );
      
      if (success) {
        return {
          success: true,
          refundId: `ref_${Date.now()}`
        };
      }
      
      return {
        success: false,
        error: 'Refund failed'
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
  
  /**
   * Handle partial refund
   * CALLS: PaymentProcessor.refundPayment
   */
  async handlePartialRefund(
    transactionId: string,
    partialAmount: number
  ): Promise<RefundResponse> {
    // CALL SITE: PaymentProcessor.refundPayment
    const success = await this.processor.refundPayment(transactionId, partialAmount);
    
    return {
      success,
      refundId: success ? `ref_partial_${Date.now()}` : undefined
    };
  }
}
