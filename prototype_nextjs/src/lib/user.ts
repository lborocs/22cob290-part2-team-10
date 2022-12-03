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
 * Checks if the
 * If the user with provided `id` does not exist, returns `null`.
 *
 * Else returns whether the provided `password` is correct for the user with the provided `id` or not.
 *
 */

/**
 * Checks if the provided `password` was used to as source for encryption
 * of the provided `hash`.
 *
 * @todo //TODO: reword this comment - sounds terrible
 *
 * @param password
 * @param hash
 * @returns
 */
export const isCorrectPassword = (password: string, hash: string) => bcrypt.compare(password, hash);
