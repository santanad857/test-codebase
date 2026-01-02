/**
 * Simple event emitter for application events
 */

type EventHandler<T = any> = (data: T) => void;

export class EventEmitter {
  private handlers: Map<string, EventHandler[]> = new Map();
  
  /**
   * Subscribe to an event
   * Called by: OrderService constructor, NotificationService.setup
   */
  on<T>(event: string, handler: EventHandler<T>): void {
    const existing = this.handlers.get(event) || [];
    existing.push(handler);
    this.handlers.set(event, existing);
  }
  
  /**
   * Emit an event to all subscribers
   * Called by: OrderService.checkout, PaymentWebhook.handleEvent
   */
  emit<T>(event: string, data: T): void {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
  
  /**
   * Remove event handler
   */
  off(event: string, handler: EventHandler): void {
    const existing = this.handlers.get(event) || [];
    this.handlers.set(event, existing.filter(h => h !== handler));
  }
}

// Singleton instance
export const globalEmitter = new EventEmitter();
