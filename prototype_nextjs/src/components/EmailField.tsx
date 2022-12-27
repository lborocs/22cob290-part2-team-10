import { forwardRef } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

export type EmailFieldProps = TextFieldProps;

/**
 * A convenience wrapper around `TextField` for email input.
 *
 * Defaults:
 * - type of `email`
 * - autoComplete of `username`
 * - label of `Email address`
 */
export default forwardRef(function EmailField(props: EmailFieldProps, ref: React.ForwardedRef<HTMLInputElement>) {
  return (
    <TextField
      type="email"
      autoComplete="username"
      label="Email address"
      ref={ref}
      {...props}
    />
  );
});
