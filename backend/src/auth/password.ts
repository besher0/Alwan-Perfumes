import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export function hashPassword(value: string): string {
  const salt = randomBytes(16).toString('hex');
  return `scrypt:${salt}:${scryptSync(value, salt, 64).toString('hex')}`;
}

export function verifyPassword(value: string, saved: string): boolean {
  const [type, salt, expectedHex] = saved.split(':');
  if (type !== 'scrypt' || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, 'hex');
  if (expected.length !== 64) return false;
  const actual = scryptSync(value, salt, expected.length);
  return timingSafeEqual(actual, expected);
}
