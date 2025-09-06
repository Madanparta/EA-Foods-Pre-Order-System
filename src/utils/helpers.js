import { CUTOFF_HOUR, DELIVERY_SLOTS } from './constants.js';

export function calculateDeliveryDate(orderTime = new Date()) {
  const orderDate = new Date(orderTime);
  const orderHour = orderDate.getHours();
  
  if (orderHour >= CUTOFF_HOUR) {
    orderDate.setDate(orderDate.getDate() + 2);
  } else {
    orderDate.setDate(orderDate.getDate() + 1);
  }
  
  return orderDate.toISOString().split('T')[0];
}

export function isValidDeliverySlot(slot) {
  return Object.keys(DELIVERY_SLOTS).includes(slot.toUpperCase());
}

export function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

export function getCurrentTime() {
  return new Date().toTimeString().split(' ')[0];
}

export function isAfterCutoff() {
  const now = new Date();
  return now.getHours() >= CUTOFF_HOUR;
}
