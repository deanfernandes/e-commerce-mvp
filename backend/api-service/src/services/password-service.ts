import { hash, compare } from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password using bcrypt.
 *
 * @param {string} password - The plain-text password to hash.
 * @returns {Promise<string>} The bcrypt-hashed password.
 *
 * @example
 * const hashedPassword = await hashPassword("password123");
 */
export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

/**
 * Verifies if a plain-text password matches a hashed password.
 *
 * @param {string} plainTextPassword - The plain-text password input.
 * @param {string} hashedPassword - The bcrypt-hashed password to compare against.
 * @returns {Promise<boolean>} Returns true if the password is correct, false otherwise.
 *
 * @example
 * const match = await verifyPassword(password, user.password);
 */
export async function verifyPassword(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword);
}
