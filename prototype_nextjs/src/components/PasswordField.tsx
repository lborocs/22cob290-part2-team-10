import { forwardRef, useState } from 'react';

import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import PolicyTooltip from '~/components/PolicyTooltip';

export type PasswordFieldProps = TextFieldProps & {
  policyTooltip?: boolean
};

/**
 * A convenience wrapper around `TextField` for password input.
 *
 * Features:
 * - Toggle password visibility capability
 * - Password policy tooltip
 *
 * Defaults:
 * - label of `Password`
 * - autoComplete of `current-password`
 */
export default forwardRef(function PasswordField({
  label = 'Password',
  autoComplete = 'current-password',
  policyTooltip,
  InputProps,
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
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" variant="middle" flexItem />}
            >
              {policyTooltip && <PolicyTooltip />}
              <Tooltip title={showPassword ? 'Hide password' : 'Show password'} describeChild>
                <IconButton
                  onClick={togglePassword}
                  edge="end"
                  sx={(theme) => {
                    const inputColor = theme.vars.palette[props.color ?? 'primary'].main;

                    return {
                      color: showPassword ? inputColor : 'inherit',
                      '&:hover': {
                        color: showPassword ? 'inherit' : inputColor,
                      },
                    };
                  }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Tooltip>
            </Stack>
          </InputAdornment>
        ),
        ...InputProps,
      }}
      ref={ref}
      {...props}
    />
  );
});
