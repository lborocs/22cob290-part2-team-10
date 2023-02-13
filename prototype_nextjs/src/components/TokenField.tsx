import { forwardRef } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

export type TokenFieldProps = TextFieldProps;

/*
The component takes in props that are of type TextFieldProps and is also forward
referenced to provide access to the underlying HTML input element.
The component is used to create a text field with a specific label and type and is
used to receive the invite token.
*/

export default forwardRef(function TokenField( //The forwardRef() method is used so that the component can have access to the ref of the input element.
  props: TokenFieldProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <TextField type="text" label="Invite Token" required ref={ref} {...props} />
  );
});
