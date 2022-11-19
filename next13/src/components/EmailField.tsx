import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function EmailField({
  controlId = 'email',
  feedback,
  setFeedback,
}: {
  controlId?: string
  feedback?: string
  setFeedback?: ReturnType<typeof useState<string>>[1]
}) {
  // initial value
  const [email, setEmail] = useState('@make-it-all.co.uk');

  return (
    <Form.Group as={Row} className="mb-3 position-relative" controlId={controlId}>
      <Form.Label column sm={3}>Email</Form.Label>
      <Col sm={9}>
        <Form.Control
          type="email"
          autoComplete="username"
          name="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFeedback?.(undefined);
          }}
          isInvalid={!!feedback}
          required
        />
        <Form.Control.Feedback type="invalid" tooltip>
          {feedback}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}
