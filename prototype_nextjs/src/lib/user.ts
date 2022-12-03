import bcrypt from 'bcrypt';

const saltRounds = 10; // DO NOT INCREASE, 20 rounds takes ~1 min

/**
 * Hashes the given password using bcrypt.
 *
 * @param raw
 * @returns The hashed password
 */
export async function hashPassword(raw: string): Promise<string> {
  return await bcrypt.hash(raw, saltRounds);
}
