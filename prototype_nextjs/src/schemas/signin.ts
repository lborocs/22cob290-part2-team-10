import { z } from 'zod';

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 64;

// https://stackoverflow.com/q/1559751
export const LOWERCASE_REGEX = /(.*[a-z])/;
export const UPPERCASE_REGEX = /(.*[A-Z])/;
export const NUMBER_REGEX = /(.*\d)/;
export const SPECIAL_SYMBOL_REGEX = /(.*\W)/;

// formik-validator-zod will show the error in order: last-defined -> first-defined

export const emailSchema = z.string()
  .endsWith('@make-it-all.co.uk', 'Invalid Make-It-All email')
  .email('Not an email')
  ;

export const passwordSchema = z.string()
  .regex(SPECIAL_SYMBOL_REGEX, 'No special symbol')
  .regex(NUMBER_REGEX, 'No number')
  .regex(UPPERCASE_REGEX, 'No uppercase letter')
  .regex(LOWERCASE_REGEX, 'No lowercase letter')
  .max(MAX_PASSWORD_LENGTH, 'Too long')
  .min(MIN_PASSWORD_LENGTH, 'Too short')
  ;

const SignInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export default SignInSchema;

export type SignInCredentials = z.infer<typeof SignInSchema>;
