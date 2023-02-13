import { forwardRef } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

/*
The NameField component accepts NameFieldProps, which is an alias for the
TextFieldProps from the @mui/material/TextField library. This allows the
NameField component to accept all the same props as the TextField component.
*/

export type NameFieldProps = TextFieldProps;

/*
The NameField component is defined using the forwardRef function from the
React library, which allows it to pass a reference to the underlying input
element to a parent component. The component returns a TextField component
with some default values set, including the autoComplete being set to username,
the label being set to Name, the required prop being set to true, and the margin
prop being set to normal.
*/

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
