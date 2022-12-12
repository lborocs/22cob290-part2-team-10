/**
 * Common schemas relating to users
 */
import { z } from 'zod';

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 64;

// https://stackoverflow.com/q/1559751
export const LOWERCASE_REGEX = /(.*[a-z])/;
export const UPPERCASE_REGEX = /(.*[A-Z])/;
export const NUMBER_REGEX = /(.*\d)/;
export const SPECIAL_SYMBOL_REGEX = /(.*\W)/;

// formik-validator-zod will show the error in order: last-defined -> first-defined

/**
 * User email has to be a Make-It-All work email address.
 */
export const EmailSchema = z.string()
  .regex(/@make-it-all.co.uk$/i, 'Invalid Make-It-All email')
  .email('Not an email')
  ;

/**
 * Password has to conform to password policy:
 * - At least 12 characters long
 * - At most 64 characters long
 * - At least 1 uppercase
 * - At least 1 lowercase
 * - At least 1 number
 * - At least 1 special symbol
 */
export const PasswordSchema = z.string()
  .regex(SPECIAL_SYMBOL_REGEX, 'No special symbol')
  .regex(NUMBER_REGEX, 'No number')
  .regex(UPPERCASE_REGEX, 'No uppercase letter')
  .regex(LOWERCASE_REGEX, 'No lowercase letter')
  .max(MAX_PASSWORD_LENGTH, 'Too long')
  .min(MIN_PASSWORD_LENGTH, 'Too short')
  ;

// no trailing & leading spaces regex: https://stackoverflow.com/a/38935454
export function nameSchema() {
  return z.string()
    .regex(/^[a-z][a-z ]*[a-z]$/i, 'Invalid name')
    .min(1, 'Name is required');
}
