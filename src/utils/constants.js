export const DELIVERY_SLOTS = {
  MORNING: { start: 8, end: 11, label: 'Morning (8-11)' },
  AFTERNOON: { start: 12, end: 15, label: 'Afternoon (12-3)' },
  EVENING: { start: 16, end: 19, label: 'Evening (4-7)' },
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  DELIVERED: 'DELIVERED',
};

export const USER_TYPES = {
  CUSTOMER: 'CUSTOMER',
  TSU: 'TSU',
  SR: 'SR',
  OPS_MANAGER: 'OPS_MANAGER',
};

export const CUTOFF_HOUR = parseInt(process.env.CUTOFF_HOUR) || 18;
