import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import axios from 'axios';
import { Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { z } from 'zod';

import EmailField from '~/components/EmailField';
import LoadingButton from '~/components/LoadingButton';
import PasswordField from '~/components/PasswordField';
import RoundedRect from '~/components/RoundedRect';
import useUserStore from '~/store/userStore';
import ChangePasswordSchema from '~/schemas/api/user/changePassword';
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
  const [pwChanged, setPwChanged] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const email = useUserStore((state) => state.user.email);

  const handleSubmit: React.ComponentProps<typeof Formik<ChangePwFormData>>['onSubmit']
    = async (values, { setFieldError }) => {
      const { currentPassword, newPassword } = values;

      // see pages/index#handleSubmit
      document.querySelector<HTMLInputElement>(':focus')?.blur();

      const payload: ChangePwPayload = {
        currentPassword,
        newPassword,
      };

      const { data } = await axios.post<ChangePwResponse>('/api/user/change-password', payload);

      if (data.success) {
        setPwChanged(true);
        onHide();
      } else {
        setFieldError('currentPassword', 'Incorrect password');
      }
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
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirm: '',
            }}
            validate={withZodSchema(
              ChangePasswordSchema
                .extend({
                  confirm: z.string(), // no need to validate
                })
                .refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, {
                  message: 'Use a new password',
                  path: ['newPassword'],
                })
                .refine(({ newPassword, confirm }) => newPassword === confirm, {
                  message: 'Passwords do not match',
                  path: ['confirm'],
                })
            )}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => {
              setChangingPw(isSubmitting);

              return (
                <Form
                  id="change-pw-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <EmailField
                    name="email"
                    controlId="email"
                    defaultValue={email}
                    type="hidden"
                  />
                  <PasswordField
                    name="currentPassword"
                    controlId="currentPassword"
                    label="Current Password"
                    placeholder="Enter current password"
                    feedback={touched.currentPassword ? errors.currentPassword : undefined}
                    value={values.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.currentPassword && !!errors.currentPassword}
                    feedbackTooltip
                    policyTooltip
                  />
                  <PasswordField
                    name="newPassword"
                    controlId="newPassword"
                    label="New Password"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    feedback={touched.newPassword ? errors.newPassword : undefined}
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.newPassword && !!errors.newPassword}
                    feedbackTooltip
                  />
                  <PasswordField
                    name="confirm"
                    controlId="confirm"
                    label="Confirm Password"
                    placeholder="Enter new password again"
                    autoComplete="new-password"
                    feedback={touched.confirm ? errors.confirm : undefined}
                    value={values.confirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.confirm && !!errors.confirm}
                    feedbackTooltip
                  />
                </Form>
              );
            }}
          </Formik>
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
