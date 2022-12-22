import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import toast from 'react-hot-toast';
import { z } from 'zod';

import LoadingButton from '~/components/LoadingButton';
import PasswordField from '~/components/PasswordField';
import useUserStore from '~/store/userStore';
import ChangePasswordSchema from '~/schemas/user/changePassword';
import type { RequestSchema as ChangePwPayload, ResponseSchema as ChangePwResponse } from '~/pages/api/user/change-password';

import styles from '~/styles/Profile.module.css';

type ChangePwFormData = {
  currentPassword: string
  newPassword: string
  confirm: string
};

/**
 * Component providing functionality for the user to change their password.
 *
 * It is a separate component to the rest of the `profile` page to cause less re-renders:
 *  - When the state representing the modal's open status (`showModal`) changes, the
 *     entire page would re-render as the `state` was global to the page.
 *  - Now, the `state` is local to just this component so only this component re-renders
 */
export default function ChangePasswordSection() {
  const theme = useTheme();

  const [showModal, setShowModal] = useState(false);

  const [changingPw, setChangingPw] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const email = useUserStore((state) => state.user.email);

  const onHide = () => setShowModal(false);

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
        toast.success('Password changed.', {
          position: 'bottom-center',
        });
        onHide();
      } else {
        setFieldError('currentPassword', 'Incorrect password');
      }
    };

  return (
    <div>
      <h3>Change Password</h3>
      <Button
        variant={theme.palette.mode === 'dark' ? 'light' : 'dark'}
        onClick={() => setShowModal(true)}
        className={styles.button}
      >
        Change
      </Button>

      <Modal
        show={showModal}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Change Password</Modal.Title>
          <CloseButton variant={theme.palette.mode === 'dark' ? 'white' : undefined} />
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
              isValid,
              dirty,
            }) => {
              // FIXME?: not meant to be using useState things here, but it works so idk what to do
              setChangingPw(isSubmitting);
              if (dirty) setIsValid(isValid);

              return (
                <Form
                  id="change-pw-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <input
                    type="hidden"
                    autoComplete="username"
                    name="email"
                    defaultValue={email}
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
            disabled={!isValid}
            style={{
              width: '7em',
            }}
          >
            Change
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
