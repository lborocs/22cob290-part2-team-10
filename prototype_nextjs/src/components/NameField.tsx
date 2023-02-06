import { forwardRef } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

export type NameFieldProps = TextFieldProps;

export default forwardRef(function NameField(
  props: NameFieldProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <TextField
      autoComplete="username"
      label="Name"
      ref={ref}
      required
      margin="normal"
      {...props}
    />
  );
});
