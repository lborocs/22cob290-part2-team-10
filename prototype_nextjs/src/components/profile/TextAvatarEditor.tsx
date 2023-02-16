import { useCallback, useId, useMemo, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { type FormikConfig, type FormikProps, Formik } from 'formik';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import {
  type TextAvatar,
  getDefaultTextAvatar,
  getTextAvatarFromStore,
  updateTextAvatarStore,
  updateTextAvatarCss,
} from '~/lib/textAvatar';
import CircularColorInput from '~/components/CircularColorInput';
import TextAvatarComponent from '~/components/TextAvatar';
import StyledCloseButtonDialog from '~/components/StyledCloseButtonDialog';
import TextAvatarResetButton from '~/components/profile/TextAvatarResetButton';

import styles from '~/styles/profile/TextAvatarEditor.module.css';

/**
 * Component providing functionality for the user to change the colours of their text avatar.
 */
export default function TextAvatarEditor() {
  const formId = useId();

  const [showDialog, setShowDialog] = useState(false);

  // The system default text avatar is the text avatar that is used when the user
  // first visits the page.
  const systemDefault = useMemo(() => getDefaultTextAvatar(), []);

  // default as in default values for the form (what is currently set in store)
  // maybe initial is a better name? don't think so
  const [defaultTextAvatar, setDefaultTextAvatar] = useState<TextAvatar>();

  // can't use formikRef.current.isSubmitting because this component wouldn't re-render on submit (only the form would)
  // so the LoadingButton doesn't enter it's loading state - it won't visually change
  // but by setting isSaving in the Formik render function, this component will re-render on submit
  const [isSaving, setIsSaving] = useState(false);

  const formikRef = useRef<FormikProps<TextAvatar>>(null);

  // using SWR like useEffect(..., []) for async data fetching while loading component
  useSWR('defaultTextAvatar', async () => {
    const textAvatar = await getTextAvatarFromStore();

    setDefaultTextAvatar(textAvatar);
  });

  const handleOpen = () => setShowDialog(true);
  const handleClose = () => setShowDialog(false);

  // system default as in what they had before changing any settings
  const resetToSystemDefault = useCallback(() => {
    formikRef.current!.setValues(systemDefault);

    updateTextAvatarCss(systemDefault);
  }, [systemDefault]);

  const cancelAndClose = useCallback(() => {
    updateTextAvatarCss(defaultTextAvatar!);
    handleClose();
  }, [defaultTextAvatar]);

  const handleSubmit: FormikConfig<TextAvatar>['onSubmit'] = useCallback(
    async (values, { resetForm }) => {
      const success = await updateTextAvatarStore(values);

      if (success) {
        setDefaultTextAvatar(values);

        toast.success('Saved', {
          position: 'bottom-center',
        });
        handleClose();
      } else {
        // shouldn't happen
        toast.error('Please try again', {
          position: 'bottom-center',
        });
      }

      resetForm({ values });
      updateTextAvatarCss(values);
    },
    []
  );

  return (
    <div>
      {/* TODO?: on hover show like a pencil to signify that it's editable */}
      <TextAvatarComponent
        className={styles.textAvatar}
        size="120px"
        style={{
          fontSize: '3rem',
        }}
        onClick={handleOpen}
      />

      <StyledCloseButtonDialog
        open={showDialog}
        onClose={cancelAndClose}
        maxWidth="xs"
        fullWidth
        dialogTitle="Avatar"
      >
        <DialogContent dividers>
          <Formik
            initialValues={defaultTextAvatar!}
            onSubmit={handleSubmit}
            onReset={() => {
              updateTextAvatarCss(defaultTextAvatar!);
            }}
            validate={(values) => {
              // basically onChange
              updateTextAvatarCss(values);
            }}
            innerRef={formikRef}
            enableReinitialize // defaultTextAvatar is set after the component is mounted
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
              isSubmitting,
            }) => {
              setIsSaving(isSubmitting);

              return (
                <Stack
                  gap={1}
                  component="form"
                  id={formId}
                  onSubmit={handleSubmit}
                  onReset={handleReset}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <InputLabel
                      color="contrast"
                      htmlFor="avatar-bg"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Background colour
                    </InputLabel>
                    <CircularColorInput
                      name="avatar-bg"
                      value={values['avatar-bg']}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <InputLabel
                      htmlFor="avatar-fg"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Text colour
                    </InputLabel>
                    <CircularColorInput
                      name="avatar-fg"
                      value={values['avatar-fg']}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Stack>
                </Stack>
              );
            }}
          </Formik>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={cancelAndClose}
            disabled={isSaving}
            disableElevation
          >
            Close
          </Button>

          <TextAvatarResetButton
            formId={formId}
            defaultTextAvatar={defaultTextAvatar}
            systemDefaultTextAvatar={systemDefault}
            resetToSystemDefault={resetToSystemDefault}
            disabled={isSaving}
          />

          <LoadingButton
            type="submit"
            form={formId}
            variant="contained"
            color="success"
            size="small"
            loading={isSaving}
            disableElevation
          >
            Save
          </LoadingButton>
        </DialogActions>
      </StyledCloseButtonDialog>
    </div>
  );
}
