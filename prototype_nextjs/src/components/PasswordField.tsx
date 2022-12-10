import { forwardRef, useState } from 'react';
import type { FormControlProps } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

import PolicyTooltip from '~/components/PolicyTooltip';

export interface PasswordFieldProps extends FormControlProps {
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
 * A reusable form input field for the user's password.
 *
 * - Customisable as it's a `forwardRef` component
 * - Correct `autocomplete` of `current-password`
 * - Easier API for providing form feedback
 * - (Opt-in) Provides a tooltip for displaying the password policy
 */
export default forwardRef(function PasswordField({
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
}: PasswordFieldProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form.Group
      as={Row}
      className={feedbackTooltip ? 'position-relative' : ''}
      controlId={controlId}
    >
      <Form.Label column sm={3}>{label}</Form.Label>
      <Col sm={9}>
        <InputGroup hasValidation>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            name={name}
            autoComplete={autoComplete}
            placeholder={placeholder}
            ref={ref}
            required
            {...props}
          />
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
          <Form.Control.Feedback
            type="invalid"
            tooltip={feedbackTooltip}
            className={onlyFeedbackOutline ? 'd-none' : ''}
          >
            {feedback}
          </Form.Control.Feedback>
        </InputGroup>
      </Col>
    </Form.Group>
  );
});
