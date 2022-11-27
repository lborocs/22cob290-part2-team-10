import { forwardRef } from 'react';
import type { FormControlProps } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export interface EmailFieldProps extends FormControlProps {
  name: string
  controlId: string
  feedback?: React.ReactNode
  feedbackTooltip?: boolean
}

export default forwardRef(function EmailField({
  name,
  controlId,
  feedback,
  feedbackTooltip = false,
  ...props
}: EmailFieldProps, ref: React.ForwardedRef<HTMLInputElement>) {
  return (
    <Form.Group
      as={Row}
      className={`mb-3 ${feedbackTooltip ? 'position-relative' : ''} ${props.type === 'hidden' ? 'd-none' : ''}`}
      controlId={controlId}
    >
      <Form.Label column sm={3}>Email</Form.Label>
      <Col sm={9}>
        <Form.Control
          type="email"
          autoComplete="username"
          name={name}
          placeholder="Enter email"
          ref={ref}
          required
          {...props}
        />
        <Form.Control.Feedback type="invalid" tooltip={feedbackTooltip}>
          {feedback}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
});
