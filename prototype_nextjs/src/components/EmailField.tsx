import { forwardRef, type useState } from 'react';
import type { FormControlProps } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default forwardRef(function EmailField({
  name,
  controlId = 'email',
  feedback,
  feedbackTooltip = true,
  setFeedback,
  ...props
}: FormControlProps & {
  name: string
  controlId?: string
  feedback?: string
  feedbackTooltip?: boolean
  setFeedback?: ReturnType<typeof useState<string>>[1]
}, ref: React.ForwardedRef<HTMLInputElement>) {
  return (
    <Form.Group
      as={Row}
      className={`mb-3 ${feedbackTooltip ? 'position-relative' : ''}`}
      controlId={controlId}
    >
      <Form.Label column sm={3}>Email</Form.Label>
      <Col sm={9}>
        <Form.Control
          type="email"
          autoComplete="username"
          name={name}
          placeholder="Enter email"
          defaultValue="@make-it-all.co.uk"
          onChange={() => setFeedback?.(undefined)}
          isInvalid={!!feedback}
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
