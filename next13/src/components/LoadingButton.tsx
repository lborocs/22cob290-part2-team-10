import { forwardRef } from 'react';
import Button, { type ButtonProps } from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

type LoadingButtonProps = ButtonProps & {
  isLoading: boolean
  children: React.ReactNode
}

export default forwardRef(function LoadingButton({
  isLoading,
  children,
  ...props
}: LoadingButtonProps, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element {
  return (
    <Button
      disabled={props.disabled || isLoading}
      onClick={!isLoading ? props.onClick : undefined}
      ref={ref}
      {...props}
    >
      {isLoading && (
        <>
          <Spinner
            as='span'
            animation='border'
            role='status'
            size='sm'
          />
          {' '}
        </>
      )}
      {children}
    </Button>
  );
});
