import { useId, useState } from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';
import axios from 'axios';
import { type FormikConfig, Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import toast from 'react-hot-toast';
import { z } from 'zod';

import PasswordField from '~/components/PasswordField';
import StyledCloseButtonDialog from '~/components/StyledCloseButtonDialog';
import useUserStore from '~/store/userStore';
import ChangePasswordSchema from '~/schemas/user/changePassword';
import type {
  RequestSchema as ChangePwPayload,
  ResponseSchema as ChangePwResponse,
} from '~/pages/api/user/change-password';

import styles from '~/styles/Profile.module.css';

const ChangePasswordFormSchema = ChangePasswordSchema.extend({
  confirm: z.string(), // matching `currentPassword` is sufficient validation
})
  .refine(
    ({ currentPassword, newPassword }) =>
      newPassword ? currentPassword !== newPassword : true,
    {
      message: 'Use a new password',
      path: ['newPassword'],
    }
  )
  .refine(({ newPassword, confirm }) => newPassword === confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type ChangePwFormData = {
  currentPassword: string;
  newPassword: string;
  confirm: string;
};

/**
 * Component providing functionality for the user to change their password.
 *
 * It is a separate component to the rest of the `profile` page to cause less re-renders:
 *  - When the state representing the modal's open status (`showDialog`) changes, the
 *     entire page would re-render as the `state` was global to the page.
 *  - Now, the `state` is local to just this component so only this component re-renders
 */
export default function ChangePasswordSection() {
  const formId = useId();

  const [showDialog, setShowDialog] = useState(false);

  const [changingPw, setChangingPw] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const email = useUserStore((state) => state.user.email);

  const handleOpen = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  const handleSubmit: FormikConfig<ChangePwFormData>['onSubmit'] = async (
    { currentPassword, newPassword },
    { setFieldError }
  ) => {
    // see pages/index#handleSubmit
    document.querySelector<HTMLInputElement>(':focus')?.blur();

    const payload: ChangePwPayload = {
      currentPassword,
      newPassword,
    };

    const { data } = await axios.post<ChangePwResponse>(
      '/api/user/change-password',
      payload
    );

    if (data.success) {
      toast.success('Password changed.', {
        position: 'bottom-center',
      });
      handleClose();
    } else {
      setFieldError('currentPassword', 'Incorrect password');
    }
  };

  return (
    <div>
      <Typography variant="h5" fontWeight={500} component="h2">
        Change Password
      </Typography>
      <Button
        variant="contained"
        color="contrast"
        onClick={handleOpen}
        className={styles.button}
      >
        Change
      </Button>

      <StyledCloseButtonDialog
        open={showDialog}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        dialogTitle="Change Password"
      >
        <DialogContent sx={{ paddingTop: 2, paddingBottom: 0 }} dividers>
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirm: '',
            }}
            validate={withZodSchema(ChangePasswordFormSchema)}
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
                <Stack
                  gap={1.5}
                  id={formId}
                  component="form"
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
                    label="Current Password"
                    placeholder="Enter current password"
                    value={values.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.currentPassword && !!errors.currentPassword}
                    helperText={
                      (touched.currentPassword && errors.currentPassword) || ' '
                    }
                    disabled={isSubmitting}
                    policyTooltip
                  />
                  <PasswordField
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.newPassword && !!errors.newPassword}
                    helperText={
                      (touched.newPassword && errors.newPassword) || ' '
                    }
                    disabled={isSubmitting}
                  />
                  <PasswordField
                    name="confirm"
                    label="Confirm Password"
                    placeholder="Enter new password again"
                    autoComplete="new-password"
                    value={values.confirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirm && !!errors.confirm}
                    helperText={(touched.confirm && errors.confirm) || ' '}
                    disabled={isSubmitting}
                  />
                </Stack>
              );
            }}
          </Formik>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<CloseIcon />}
            onClick={handleClose}
          >
            Close
          </Button>
          <LoadingButton
            type="submit"
            form={formId}
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<LockResetIcon />}
            loadingPosition="start"
            loading={changingPw}
            disabled={!isValid}
            disableElevation
          >
            Change
          </LoadingButton>
        </DialogActions>
      </StyledCloseButtonDialog>
    </div>
  );
}
