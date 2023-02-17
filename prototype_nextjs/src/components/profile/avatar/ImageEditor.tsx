import { useEffect, useId, useState } from 'react';
import { signIn } from 'next-auth/react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { type FormikConfig, Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import toast from 'react-hot-toast';

import ChangeImageSchema from '~/schemas/user/changeImage';
import useUserStore from '~/store/userStore';
import type {
  RequestSchema,
  ResponseSchema,
} from '~/pages/api/user/change-image';
import { getInitials } from '~/utils';

export type ImageEditorProps = {
  actionsPortalRef: React.RefObject<HTMLElement>;
  handleClose: () => void;
};

/**
 * Component providing functionality for the user to change their avatar image.
 */
export default function ImageEditor({
  actionsPortalRef,
  handleClose,
}: ImageEditorProps) {
  const formId = useId();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { image: userImage, name } = useUserStore((state) => state.user);
  const setImage = useUserStore((state) => state.setImage);

  const [previewImage, setPreviewImage] = useState(userImage);

  const handleSubmit: FormikConfig<RequestSchema>['onSubmit'] = async (
    formData
  ) => {
    async function updateImage() {
      const { data } = await axios.post<ResponseSchema>(
        '/api/user/change-image',
        formData
      );

      if (data.success) {
        /**
         * Workaround to update the user's image in the cookie/session stored on the client when they
         *  change their image.
         *
         * Without this: when changing pages, their old image will still be displayed until they sign out
         *  and sign back in
         *
         * @see [...nextauth].ts
         */
        await signIn('credentials', {
          refetchUser: true,
          redirect: false,
        });

        setImage(formData.image);
      } else {
        // shouldn't happen
        console.error(data);
        throw new Error();
      }
    }

    await toast.promise(updateImage(), {
      loading: 'Updating image...',
      success: 'Image updated successfully',
      error: 'Please try again',
    });
  };

  const handleReset = () => setPreviewImage(userImage);

  return (
    <Stack alignItems="center" gap={2}>
      <Tooltip
        title="If your initials show, then the image URL is empty or broken."
        followCursor
      >
        <Avatar
          src={previewImage ?? undefined}
          alt={name}
          sx={(theme) => ({
            width: theme.spacing(10),
            height: theme.spacing(10),
            fontSize: '2rem',
            cursor: 'help',
          })}
          component="span"
        >
          {getInitials(name)}
        </Avatar>
      </Tooltip>

      <Formik
        initialValues={{
          image: userImage ?? '',
        }}
        validate={withZodSchema(ChangeImageSchema)}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        {({
          values,
          errors,
          touched,
          initialValues,
          handleChange,
          handleSubmit,
          handleBlur,
          handleReset,
          isSubmitting,
          isValid,
        }) => (
          <Box
            width={1}
            component="form"
            id={formId}
            onSubmit={handleSubmit}
            onReset={handleReset}
          >
            <TextField
              label="Image"
              variant="outlined"
              type="url"
              name="image"
              value={values.image}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.image && !!errors.image}
              helperText={errors.image || 'Please enter the URL of your image'}
              fullWidth
            />

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
                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setPreviewImage(values.image);
                  }}
                  disableElevation
                >
                  Preview
                </Button>

                <Button
                  type="reset"
                  form={formId}
                  variant="contained"
                  size="small"
                  disabled={isSubmitting}
                  disableElevation
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  form={formId}
                  variant="contained"
                  color={
                    !values.image && initialValues.image ? 'error' : 'contrast'
                  }
                  size="small"
                  disabled={
                    isSubmitting ||
                    !isValid ||
                    values.image === initialValues.image
                  }
                  disableElevation
                >
                  Save
                  {/* If no image & there was an image, remove */}
                  {!values.image && initialValues.image && ' (Remove)'}
                </Button>
              </Portal>
            )}
          </Box>
        )}
      </Formik>
    </Stack>
  );
}
