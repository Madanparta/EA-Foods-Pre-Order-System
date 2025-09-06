const idempotencyKeys = new Map();
const IDEMPOTENCY_KEY_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Check if a request is a duplicate using idempotency key
export function checkIdempotency(key) {
  if (!key) return false;
  
  // Clean up expired keys
  const now = Date.now();
  for (const [k, v] of idempotencyKeys.entries()) {
    if (now - v.timestamp > IDEMPOTENCY_KEY_TTL) {
      idempotencyKeys.delete(k);
    }
  }
  
  return idempotencyKeys.has(key);
}

// Store an idempotency key
export function storeIdempotencyKey(key, response) {
  if (!key) return;
  
  idempotencyKeys.set(key, {
    response,
    timestamp: Date.now()
  });
}

// Get response from idempotency key
export function getIdempotencyResponse(key) {
  return idempotencyKeys.get(key)?.response;
}
