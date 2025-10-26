// Authentication utilities
// Note: In production, use proper bcrypt library via Workers API

/**
 * Simple password hashing (DEMO ONLY - use bcrypt in production)
 * For production, integrate with Cloudflare Workers Crypto API or external auth service
 */
export async function hashPassword(password: string): Promise<string> {
  // This is a placeholder - in production use proper bcrypt
  // For now, we'll use a simple hash
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'skillswap_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `$demo$${hashHex}`;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computedHash = await hashPassword(password);
  return computedHash === hash;
}

/**
 * Generate a simple session token
 */
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Create JWT-like token (simplified for demo)
 * In production, use proper JWT library
 */
export function createAuthToken(userId: number, email: string): string {
  const payload = {
    userId,
    email,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  // Simple base64 encoding (not secure - use proper JWT in production)
  return btoa(JSON.stringify(payload));
}

/**
 * Verify and decode auth token
 */
export function verifyAuthToken(token: string): { userId: number; email: string } | null {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp < Date.now()) {
      return null; // Token expired
    }
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

/**
 * Extract user from Authorization header
 */
export function getUserFromAuth(authHeader: string | null): { userId: number; email: string } | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyAuthToken(token);
}
