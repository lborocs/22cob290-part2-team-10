import { forwardRef, useState } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import PolicyTooltip from '~/components/PolicyTooltip';

export type PasswordFieldProps = TextFieldProps & {
  policyTooltip?: boolean
};

/**
 * A reusable form input field for the user's password.
 *
 * - Customisable as it's a `forwardRef` component
 * - Correct `autocomplete` of `current-password`
 * - policyTooltip
 */
export default forwardRef(function PasswordField({
  label = 'Password',
  autoComplete = 'current-password',
  policyTooltip,
  ...props
}: PasswordFieldProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((show) => !show);

  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      label={label}
      autoComplete={autoComplete}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Box
              sx={{
                display: 'flex',
              }}
            >
              {policyTooltip && (
                <>
                  <PolicyTooltip />
                  <Divider orientation="vertical" variant="middle" flexItem />
                </>
              )}
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePassword}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Box>
          </InputAdornment>
        ),
      }}
      ref={ref}
      {...props}
    />
  );
});
