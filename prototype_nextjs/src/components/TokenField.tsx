import { forwardRef } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

export type TokenFieldProps = TextFieldProps;

export default forwardRef(function TokenField(
  props: TokenFieldProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <TextField type="text" label="Invite Token" required ref={ref} {...props} />
  );
});
