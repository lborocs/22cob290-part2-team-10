import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
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

export default function PasswordField({
  name,
  label = 'Password',
  controlId,
  autoComplete = 'current-password',
  placeholder = 'Enter password',
  feedback,
  setFeedback,
  policyTooltip,
}: {
  name: string
  label?: string
  controlId: string
  autoComplete?: string
  placeholder?: string
  feedback?: string
  setFeedback?: ReturnType<typeof useState<string>>[1]
  policyTooltip?: boolean
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form.Group as={Row} className="mb-3 position-relative" controlId={controlId}>
      <Form.Label column sm={3}>{label}</Form.Label>
      <Col sm={9}>
        <InputGroup className="has-validation">
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            name={name}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className={feedback ? 'is-invalid' : ''}
            onChange={() => setFeedback?.(undefined)}
            required
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
          <div className="invalid-tooltip">
            {feedback}
          </div>
        </InputGroup>
      </Col>
    </Form.Group>
  );
}
