import { CUTOFF_HOUR, DELIVERY_SLOTS } from './constants.js';

/**
 * Calculate delivery date based on cutoff time
 * Orders after 6PM go to +2 days
 */
export function calculateDeliveryDate(orderTime = new Date()) {
  const orderDate = new Date(orderTime);
  const orderHour = orderDate.getHours();
  
  if (orderHour >= CUTOFF_HOUR) { // If order is placed after cutoff, add 2 days
    orderDate.setDate(orderDate.getDate() + 2);
  } else {
    orderDate.setDate(orderDate.getDate() + 1); // Otherwise, next day delivery
  }
  
  return orderDate.toISOString().split('T')[0]; // Return YYYY-MM-DD
}

/**
 * Validate if a delivery slot is valid
 */
export function isValidDeliverySlot(slot) {
  return Object.keys(DELIVERY_SLOTS).includes(slot.toUpperCase());
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

/**
 * Get current time in format HH:MM:SS
 */
export function getCurrentTime() {
  return new Date().toTimeString().split(' ')[0];
}

/**
 * Check if current time is after cutoff
 */
export function isAfterCutoff() {
  const now = new Date();
  return now.getHours() >= CUTOFF_HOUR;
}
