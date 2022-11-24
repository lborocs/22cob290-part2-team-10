import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import axios from 'axios';
import { useStore } from 'zustand';

import EmailField from '~/components/EmailField';
import LoadingButton from '~/components/LoadingButton';
import PasswordField from '~/components/PasswordField';
import RoundedRect from '~/components/RoundedRect';
import { useUserStore } from '~/store/userStore';
import { validatePassword } from '~/utils';
import type { RequestSchema as ChangePwPayload, ResponseSchema as ChangePwResponse } from '~/pages/api/user/change-password';

type ChangePwFormData = {
  currentPassword: string
  newPassword: string
  confirm: string
};

export default function ChangePasswordModal({ show, onHide }: {
  show: boolean
  onHide: () => void
}) {
  const [passwordFeedback, setPasswordFeedback] = useState<string>();
  const [newFeedback, setNewFeedback] = useState<string>();
  const [confirmFeedback, setConfirmFeedback] = useState<string>();

  const [badForm, setBadForm] = useState(false);

  const [changingPw, setChangingPw] = useState(false);
  const [pwChanged, setPwChanged] = useState(false);

  const userStore = useUserStore();
  const email = useStore(userStore, (state) => state.user.email);

  useEffect(() => {
    setBadForm(passwordFeedback !== undefined
      || newFeedback !== undefined
      || confirmFeedback !== undefined
    );
  }, [passwordFeedback, newFeedback, confirmFeedback]);

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (badForm) return;

    const { currentPassword, newPassword, confirm } = Object.fromEntries(new FormData(e.currentTarget)) as ChangePwFormData;

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

    setChangingPw(true);

    const payload: ChangePwPayload = {
      currentPassword,
      newPassword,
    };

    const { data } = await axios.post<ChangePwResponse>('/api/user/change-password', payload);

    if (data.success) {
      setPwChanged(true);
      onHide();
    } else setPasswordFeedback('Incorrect password');

    setChangingPw(false);
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
            <EmailField
              name="email"
              defaultValue={email}
              type="hidden"
            />
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
          <LoadingButton
            type="submit"
            form="change-pw-form"
            variant="primary"
            size="sm"
            isLoading={changingPw}
            loadingContent="Changing"
          >
            Change
          </LoadingButton>
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
