import { useCallback, useMemo, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { Formik, type FormikProps } from 'formik';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import {
  type TextAvatar,
  getDefaultTextAvatar,
  getTextAvatarFromStore,
  updateTextAvatarStore,
  updateTextAvatarCss,
} from '~/lib/textAvatar';
import ActionedSplitButton, { type Option } from '~/components/ActionedSplitButton';
import CircularColorInput from '~/components/CircularColorInput';
import TextAvatarComponent from '~/components/TextAvatar';
import StyledCloseButtonDialog from '~/components/StyledCloseButtonDialog';

import styles from '~/styles/profile/TextAvatarEditor.module.css';

const StyledMenuItemContent = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  width: '100%',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(3.5),
  height: theme.spacing(3.5),
  fontSize: '0.9rem',
})) as typeof Avatar;

/**
 * Component providing functionality for the user to change the colours of their text avatar.
 */
export default function TextAvatarEditor() {
  const [showDialog, setShowDialog] = useState(false);

  const systemDefault = useMemo(() => getDefaultTextAvatar(), []);

  // default as in default values for the form (what is currently set in store)
  const [defaultTextAvatar, setDefaultTextAvatar] = useState<TextAvatar>(null as unknown as TextAvatar);

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
    updateTextAvatarCss(defaultTextAvatar);
    handleClose();
  }, [defaultTextAvatar]);

  const handleSubmit: React.ComponentProps<typeof Formik<TextAvatar>>['onSubmit']
    = useCallback(
      async (values, { resetForm }) => {
        const success = await updateTextAvatarStore(values);

        if (success) {
          setDefaultTextAvatar(values);

          toast.success('Saved.', {
            position: 'bottom-center',
          });
          handleClose();
        } else { // shouldn't happen
          toast.error('Please try again', {
            position: 'bottom-center',
          });
        }

        resetForm({ values });
        updateTextAvatarCss(values);
      },
      []
    );

  const resetButtonOptions = useMemo<Option[]>(() => (
    [
      {
        actionButtonContent: (
          <>
            <Box
              display={{ xs: 'none', sm: 'inline' }}
              component="span"
            >
              Reset to previous
            </Box>
            <Box
              display={{ xs: 'inline', sm: 'none' }}
              component="span"
            >
              Previous
            </Box>
          </>
        ),
        menuItemContent: (
          <StyledMenuItemContent>
            Reset to previous
            <StyledAvatar
              sx={{
                bgcolor: defaultTextAvatar['avatar-bg'],
                color: defaultTextAvatar['avatar-fg'],
              }}
            >
              A
            </StyledAvatar>
          </StyledMenuItemContent>
        ),
        actionButtonProps: {
          form: 'text-avatar-form',
          type: 'reset',
        },
      },
      {
        actionButtonContent: (
          <>
            <Box
              display={{ xs: 'none', sm: 'inline' }}
              component="span"
            >
              Reset to default
            </Box>
            <Box
              display={{ xs: 'inline', sm: 'none' }}
              component="span"
            >
              Default
            </Box>
          </>
        ),
        menuItemContent: (
          <StyledMenuItemContent>
            Reset to default
            <StyledAvatar
              sx={{
                bgcolor: systemDefault['avatar-bg'],
                color: systemDefault['avatar-fg'],
              }}
            >
              A
            </StyledAvatar>
          </StyledMenuItemContent>
        ),
        action: resetToSystemDefault,
      },
    ]
  ), [defaultTextAvatar, systemDefault, resetToSystemDefault]);

  return (
    <div>
      {/* TODO?: on hover show like a pencil to signify that it's editable */}
      <TextAvatarComponent
        className={styles.textAvatar}
        size="120px"
        style={{
          fontSize: '3em',
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
            initialValues={defaultTextAvatar}
            onSubmit={handleSubmit}
            onReset={() => {
              updateTextAvatarCss(defaultTextAvatar);
            }}
            validate={(values) => { // basically onChange
              updateTextAvatarCss(values);
            }}
            innerRef={formikRef}
            enableReinitialize
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
                  spacing={1}
                  component="form"
                  id="text-avatar-form"
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
                      id="avatar-bg"
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
                      id="avatar-fg"
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
          <ActionedSplitButton
            options={resetButtonOptions}
            variant="contained"
            color="warning"
            size="small"
            disabled={isSaving}
            sx={{ marginLeft: 1 }}
            disableElevation
            dropDownButtonProps={{
              'aria-label': 'select reset strategy',
              sx: {
                paddingX: 0.5,
                minWidth: '0 !important',
              },
            }}
            menuItemProps={{
              dense: true,
              selected: false,
            }}
          />
          <LoadingButton
            type="submit"
            form="text-avatar-form"
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
