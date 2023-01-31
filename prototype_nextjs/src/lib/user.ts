import bcrypt from 'bcrypt';

const saltRounds = 10; // DO NOT INCREASE, 20 rounds takes ~1 min

/**
 * Hashes the provided password using bcrypt.
 *
 * @param raw
 * @returns The hashed password
 */
export const hashPassword = (raw: string) => bcrypt.hash(raw, saltRounds);

/**
 * @param password
 * @param hash The hashed password
 * @returns
 */
export const isCorrectPassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);
