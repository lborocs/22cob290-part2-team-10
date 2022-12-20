import { forwardRef } from 'react';
import Button, { type ButtonProps } from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean
  loadingContent?: React.ReactNode
  children: React.ReactNode
}

// TODO: delete once profile stuff has been moved to MUI

/**
 * A reusable button that has a loading state.
 *
 * - Customisable as it's a `forwardRef` component
 * - Optionally different content while in loading state
 */
export default forwardRef(function LoadingButton({
  isLoading,
  loadingContent,
  children,
  disabled,
  ...props
}: LoadingButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) {
  return (
    <Button
      disabled={disabled || isLoading}
      onClick={!isLoading ? props.onClick : undefined}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            role="status"
            size="sm"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          {' '}
          {loadingContent ?? children}
        </>
      ) : children}
    </Button>
  );
});
