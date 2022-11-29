import { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import RoundedRect from '~/components/RoundedRect';

export type SignInToastProps = {
  showModal: boolean
};

export default function SignInToast({ showModal }: SignInToastProps) {
  const [show, setShow] = useState(showModal);

  return (
    <ToastContainer className="p-3" position="top-center">
      <Toast
        show={show}
        onClose={() => setShow(false)}
      >
        <Toast.Header>
          <RoundedRect fill="#ffc107" />
          <strong className="me-auto">Sign in</strong>
          {/* <small>11 mins ago</small> */}
        </Toast.Header>
        <Toast.Body>
          You need to sign in first.
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
