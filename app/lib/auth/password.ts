import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Hashes a password with a randomly generated salt
 */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return {
    hash: derivedKey.toString('hex'),
    salt
  };
}

/**
 * Verifies a password against a hash and salt
 */
export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  try {
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return hash === derivedKey.toString('hex');
  } catch (err) {
    return false;
  }
}
