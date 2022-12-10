import { forwardRef, useState } from 'react';
import type { FormControlProps } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

import PolicyTooltip from '~/components/PolicyTooltip';

export interface FloatingPasswordFieldProps extends FormControlProps {
  name: string
  label?: string
  controlId: string
  autoComplete?: string
  placeholder?: string
  feedback?: React.ReactNode
  feedbackTooltip?: boolean
  onlyFeedbackOutline?: boolean
  policyTooltip?: boolean
}

/**
 * A floating-label version of `PasswordField`
 */
export default forwardRef(function FloatingPasswordField({
  name,
  label = 'Password',
  controlId,
  autoComplete = 'current-password',
  placeholder = 'Enter password',
  feedback,
  feedbackTooltip = false,
  onlyFeedbackOutline = false,
  policyTooltip = false,
  ...props
}: FloatingPasswordFieldProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <FloatingLabel
        controlId={controlId}
        label="Password"
        className={`${feedbackTooltip ? 'position-relative' : ''}`}
      >
        <Form.Control
          type={showPassword ? 'text' : 'password'}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          ref={ref}
          required
          {...props}
        />
        <Form.Control.Feedback
          type="invalid"
          tooltip={feedbackTooltip}
          className={onlyFeedbackOutline ? 'd-none' : ''}
        >
          {feedback}
        </Form.Control.Feedback>
      </FloatingLabel>
      {policyTooltip && (
        <PolicyTooltip />
      )}
      <Button
        variant="outline-secondary"
        onClick={() => setShowPassword((show) => !show)}
        className="d-flex align-items-center"
      >
        {showPassword ? <EyeSlashFill /> : <EyeFill />}
      </Button>
    </InputGroup>
  );
});
