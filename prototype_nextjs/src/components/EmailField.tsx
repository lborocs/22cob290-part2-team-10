import { forwardRef } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

export type EmailFieldProps = TextFieldProps;

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
