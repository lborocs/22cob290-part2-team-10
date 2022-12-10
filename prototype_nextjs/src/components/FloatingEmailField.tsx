import { forwardRef } from 'react';
import type { FormControlProps } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

export interface FloatingEmailFieldProps extends FormControlProps {
  name: string
  controlId: string
  feedback?: React.ReactNode
  feedbackTooltip?: boolean
  onlyFeedbackOutline?: boolean // feedback is the outline on the input + a feedback message, sometimes we only want the outline
}

/**
 * A reusable form input field for the user's email.
 *
 * - Customisable as it's a `forwardRef` component
 * - Correct `autocomplete` of `username`
 * - Easier API for providing form feedback
 */
export default forwardRef(function FloatingEmailField({
  name,
  controlId,
  feedback,
  feedbackTooltip = false,
  onlyFeedbackOutline = false,
  ...props
}: FloatingEmailFieldProps, ref: React.ForwardedRef<HTMLInputElement>) {
  return (
    <div className={feedbackTooltip ? 'position-relative' : ''}>
      <FloatingLabel
        controlId={controlId}
        label="Email address"
      >
        <Form.Control
          type="email"
          autoComplete="username"
          name={name}
          placeholder="Enter email"
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
    </div>
  );
});
