import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import axios from 'axios';

import PasswordField from '~/components/PasswordField';
import RoundedRect from '~/components/RoundedRect';
import EmailField from '~/components/EmailField';
import { validatePassword } from '~/utils';
import type { RequestSchema as ChangePwPayload, ResponseSchema as ChangePwResponse } from '~/pages/api/user/change-password';

type ChangePwFormData = {
  email: string
  currentPassword: string
  newPassword: string
  confirm: string
};

export default function ChangePasswordModal({ email, show, onHide }: {
  email: string
  show: boolean
  onHide: () => void
}) {
  const [passwordFeedback, setPasswordFeedback] = useState<string>();
  const [newFeedback, setNewFeedback] = useState<string>();
  const [confirmFeedback, setConfirmFeedback] = useState<string>();

  const [badForm, setBadForm] = useState(false);

  const [pwChanged, setPwChanged] = useState(false);

  useEffect(() => {
    setBadForm(passwordFeedback !== undefined
      || newFeedback !== undefined
      || confirmFeedback !== undefined
    );
  }, [passwordFeedback, newFeedback, confirmFeedback]);

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (badForm) return;

    const formData = Object.fromEntries(new FormData(e.currentTarget)) as ChangePwFormData;
    const { currentPassword, newPassword, confirm } = formData;

    let _badForm = false;

    let pwError = validatePassword(currentPassword);
    if (pwError) {
      _badForm = true;
      setPasswordFeedback(pwError);
    }

    pwError = validatePassword(newPassword);
    if (pwError) {
      _badForm = true;
      setNewFeedback(pwError);
    } else if (currentPassword === newPassword) {
      _badForm = true;
      setNewFeedback('Use a new password');
    }

    if (newPassword !== confirm) {
      _badForm = true;
      setConfirmFeedback('Passwords do not match');
    }

    setBadForm(_badForm);
    if (_badForm) return;

    const payload: ChangePwPayload = {
      currentPassword,
      newPassword,
    };

    const { data } = await axios.post<ChangePwResponse>('/api/user/change-password', payload);

    if (data.success) {
      setPwChanged(true);
      onHide();
    } else setPasswordFeedback('Incorrect password');
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            id="change-pw-form"
            onSubmit={changePassword}
          >
            {/* Email (hidden) */}
            <div className="d-none">
              <EmailField
                name="email"
                value={email}
              />
            </div>
            <PasswordField
              name="currentPassword"
              controlId="currentPassword"
              label="Current Password"
              placeholder="Enter current password"
              feedback={passwordFeedback}
              setFeedback={setPasswordFeedback}
              policyTooltip
            />
            <PasswordField
              name="newPassword"
              controlId="newPassword"
              label="New Password"
              placeholder="Enter new password"
              autoComplete="new-password"
              feedback={newFeedback}
              setFeedback={setNewFeedback}
            />
            <PasswordField
              name="confirm"
              controlId="confirm"
              label="Confirm Password"
              placeholder="Enter new password again"
              autoComplete="new-password"
              feedback={confirmFeedback}
              setFeedback={setConfirmFeedback}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={onHide}>
            Close
          </Button>
          <Button
            type="submit"
            form="change-pw-form"
            variant="primary"
            size="sm"
          >
            Change
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer className="p-3" position="bottom-end">
        <Toast
          show={pwChanged}
          onClose={() => setPwChanged(false)}
          autohide
        >
          <Toast.Header>
            <RoundedRect fill="#198754" />
            <strong className="me-auto">Success</strong>
            <small>Now</small>
          </Toast.Header>
          <Toast.Body>
            Password changed.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
