import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { type FormikConfig, Formik } from 'formik';
import toast from 'react-hot-toast';
import useSWR, { useSWRConfig } from 'swr';

import useUserStore from '~/store/userStore';
import { getInitials } from '~/utils';
import {
  type TextAvatar,
  getDefaultTextAvatar,
  getMyTextAvatarFromStore,
  updateTextAvatarStore,
} from '~/lib/textAvatar';
import CircularColorInput from '~/components/CircularColorInput';
import TextAvatarResetButton from '~/components/profile/avatar/TextAvatarResetButton';

export type TextAvatarEditorProps = {
  actionsPortalRef: React.RefObject<HTMLElement>;
  handleClose: () => void;
};

/**
 * Component providing functionality for the user to change the colours of their text avatar.
 */
export default function TextAvatarEditor({
  actionsPortalRef,
  handleClose,
}: TextAvatarEditorProps) {
  const formId = useId();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const name = useUserStore((state) => state.user.name);
  const userId = useUserStore((state) => state.user.id);

  const { mutate } = useSWRConfig();

  // The system default text avatar is the text avatar that is used when the user
  // first visits the website.
  const systemDefault = useMemo(getDefaultTextAvatar, []);

  // default as in default values for the form (what is currently set in store)
  // maybe initial is a better name? don't think so
  // Initial is a MUCH better name
  const [initialTextAvatar, setInitialTextAvatar] = useState<TextAvatar>();

  // tbh this could just be a useEffect(..., []) but :shrug:
  const { data: fetchedInitialTextAvatar } = useSWR(
    'initialTextAvatar',
    getMyTextAvatarFromStore
  );
  useEffect(() => {
    setInitialTextAvatar(fetchedInitialTextAvatar);
  }, [fetchedInitialTextAvatar]);

  const handleSubmit: FormikConfig<TextAvatar>['onSubmit'] = useCallback(
    async (values, { resetForm }) => {
      async function updateTextAvatar() {
        const success = await updateTextAvatarStore(values);

        if (success) {
          setInitialTextAvatar(values);
        } else {
          // shouldn't happen
          throw new Error();
        }
      }

      await toast.promise(
        updateTextAvatar(),
        {
          loading: 'Saving...',
          success: 'Saved',
          error: 'Please try again',
        },
        {
          position: 'bottom-center',
        }
      );

      resetForm({ values });
      mutate(['textAvatar', userId], values);
    },
    [mutate, userId]
  );

  return (
    <Formik
      initialValues={
        initialTextAvatar ?? {
          // This shouldn't ever be shown, it's just here because initialTextAvatar is set
          // after the component is mounted, and thus is initially undefined
          'avatar-bg': '#000000',
          'avatar-fg': '#ffffff',
        }
      }
      onSubmit={handleSubmit}
      enableReinitialize // initialTextAvatar is set after the component is mounted
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        isSubmitting,
        setValues,
      }) => (
        <Stack>
          <Avatar
            sx={(theme) => ({
              width: theme.spacing(10),
              height: theme.spacing(10),
              fontSize: '2rem',
              marginX: 'auto',
              bgcolor: values['avatar-bg'],
              color: values['avatar-fg'],
            })}
            component="span"
          >
            {getInitials(name)}
          </Avatar>

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

            {mounted && (
              <Portal container={actionsPortalRef.current}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  disableElevation
                >
                  Close
                </Button>

                <TextAvatarResetButton
                  formId={formId}
                  initialTextAvatar={initialTextAvatar}
                  systemDefaultTextAvatar={systemDefault}
                  resetToSystemDefault={() => setValues(systemDefault)}
                  disabled={isSubmitting}
                />

                <LoadingButton
                  type="submit"
                  form={formId}
                  variant="contained"
                  color="contrast"
                  size="small"
                  loading={isSubmitting}
                  disableElevation
                >
                  Save
                </LoadingButton>
              </Portal>
            )}
          </Stack>
        </Stack>
      )}
    </Formik>
  );
}
