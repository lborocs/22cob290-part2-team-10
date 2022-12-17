import { forwardRef } from 'react';
import type { FormControlProps } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export interface FloatingTokenFieldProps extends FormControlProps {
  name: string
  controlId: string
  feedback?: React.ReactNode
  feedbackTooltip?: boolean
  onlyFeedbackOutline?: boolean // feedback is the outline on the input + a feedback message, sometimes we only want the outline
}

/**
 * A reusable form input field for a new user's token.
 *
 * - Customisable as it's a `forwardRef` component
 * - Easier API for providing form feedback
 */
export default forwardRef(function FloatingTokenField({
  name,
  controlId,
  feedback,
  feedbackTooltip = false,
  onlyFeedbackOutline = false,
  ...props
}: FloatingTokenFieldProps, ref: React.ForwardedRef<HTMLInputElement>) {
  return (
    <InputGroup>
      <FloatingLabel
        controlId={controlId}
        label="Invite Token"
        className={feedbackTooltip ? 'position-relative' : ''}
      >
        <Form.Control
          type="text"
          autoComplete="Invite Token"
          name={name}
          placeholder= "Invite Token"
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
    </InputGroup>
  );
});
