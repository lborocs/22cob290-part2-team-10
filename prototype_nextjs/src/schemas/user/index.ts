import { z } from 'zod';

/* common schemas */

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 64;

// https://stackoverflow.com/q/1559751
export const LOWERCASE_REGEX = /(.*[a-z])/;
export const UPPERCASE_REGEX = /(.*[A-Z])/;
export const NUMBER_REGEX = /(.*\d)/;
export const SPECIAL_SYMBOL_REGEX = /(.*\W)/;

// formik-validator-zod will show the error in order: last-defined -> first-defined

export const EmailSchema = z.string()
  .endsWith('@make-it-all.co.uk', 'Invalid Make-It-All email')
  .email('Not an email')
  ;

export const PasswordSchema = z.string()
  .regex(SPECIAL_SYMBOL_REGEX, 'No special symbol')
  .regex(NUMBER_REGEX, 'No number')
  .regex(UPPERCASE_REGEX, 'No uppercase letter')
  .regex(LOWERCASE_REGEX, 'No lowercase letter')
  .max(MAX_PASSWORD_LENGTH, 'Too long')
  .min(MIN_PASSWORD_LENGTH, 'Too short')
  ;

// TODO: max length?
// name regex: https://stackoverflow.com/a/36733683
export function nameSchema(name: string) {
  return z.string()
    .regex(/^[a-z]+$/i, `${name} is alphabetic only`)
    .min(1, `${name} is required`);
}