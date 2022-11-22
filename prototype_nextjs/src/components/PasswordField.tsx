import { forwardRef, useState } from 'react';
import type { FormControlProps } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import { EyeFill, EyeSlashFill, InfoCircleFill } from 'react-bootstrap-icons';

function PolicyTooltip() {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip>
          At least 1 uppercase<br />
          At least 1 lowercase<br />
          At least 1 number<br />
          At least 1 special symbol
        </Tooltip>
      }
    >
      {({ ref, ...triggerHandler }) => (
        <InputGroup.Text
          {...triggerHandler}
          ref={ref}
        >
          <InfoCircleFill />
        </InputGroup.Text>
      )}
    </OverlayTrigger>
  );
}

export default forwardRef(function PasswordField({
  name,
  label = 'Password',
  controlId,
  autoComplete = 'current-password',
  placeholder = 'Enter password',
  feedback,
  setFeedback,
  policyTooltip,
  ...props
}: FormControlProps & {
  name: string
  label?: string
  controlId: string
  autoComplete?: string
  placeholder?: string
  feedback?: string
  setFeedback?: ReturnType<typeof useState<string>>[1]
  policyTooltip?: boolean
}, ref: React.ForwardedRef<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form.Group as={Row} className="mb-3 position-relative" controlId={controlId}>
      <Form.Label column sm={3}>{label}</Form.Label>
      <Col sm={9}>
        <InputGroup hasValidation>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            name={name}
            autoComplete={autoComplete}
            placeholder={placeholder}
            isInvalid={!!feedback}
            onChange={() => setFeedback?.(undefined)}
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
          <Form.Control.Feedback type="invalid" tooltip>
            {feedback}
          </Form.Control.Feedback>
        </InputGroup>
      </Col>
    </Form.Group>
  );
});