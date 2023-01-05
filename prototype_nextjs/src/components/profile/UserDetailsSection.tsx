import { signIn } from 'next-auth/react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import BadgeIcon from '@mui/icons-material/Badge';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import type { Prisma } from '@prisma/client';
import toast from 'react-hot-toast';

import useUserStore from '~/store/userStore';
import ChangeNameSchema from '~/schemas/user/changeName';
import type { RequestSchema as ChangeNamePayload, ResponseSchema as ChangeNameResponse } from '~/pages/api/user/change-name';

import styles from '~/styles/Profile.module.css';

/**
 * The icon on the default chip looks too close to the left side when not using a rounded icon.
 */
const PaddedChip = styled(Chip)(({ theme }) => ({
  paddingLeft: theme.spacing(0.5),
}));

type Inviter = Prisma.UserGetPayload<{
  select: {
    email: true,
    name: true,
  },
}>;

export type UserDetailsSectionProps = {
  inviter: Inviter | null
};

type DetailsFormData = {
  name: string
};

/**
 * Lists user info (name, email, role).
 *
 * Provides functionality for the user to change their name.
 */
export default function UserDetailsSection({
  inviter,
}: UserDetailsSectionProps) {
  const setName = useUserStore((state) => state.setName);
  const { name, email, isManager } = useUserStore((state) => state.user);

  const handleSubmit: React.ComponentProps<typeof Formik<DetailsFormData>>['onSubmit']
    = async (values, { resetForm }) => {
      // see pages/index#handleSubmit
      document.querySelector<HTMLInputElement>(':focus')?.blur();

      const payload: ChangeNamePayload = values;

      const updateDetails = async () => {
        const { data } = await axios.post<ChangeNameResponse>('/api/user/change-name', payload);

        if (data.success) {
          const { name } = values;

          /**
           * Workaround to update the user's name in the cookie/session stored on the client when they
           *  change their name.
           *
           * Without this: when changing pages, their old name will still be displayed until they sign out
           *  and sign back in
           *
           * @see [...nextauth].ts
           */
          await signIn('credentials', {
            refetchUser: true,
            redirect: false,
          });

          setName(name);

          resetForm({ values });
        } else { // shouldn't happen
          console.error(data);
          throw new Error();
        }
      };

      await toast.promise(updateDetails(), {
        loading: 'Updating...',
        error: 'Please try again.',
        success: 'Details updated.',
      }, {
        position: 'bottom-center',
      });
    };

  return (
    <Stack gap={1}>
      {/* chip bar */}
      <Stack
        direction="row"
        flexWrap={{
          xs: 'nowrap',
          sm: 'wrap',
        }}
        overflow="auto"
        paddingX={1}
        columnGap={{
          xs: 0.75,
          md: 1,
        }}
        rowGap={1}
      >
        {inviter
          ? (
            <>
              <PaddedChip
                icon={<BadgeIcon />}
                label={
                  <Tooltip title="Role" describeChild>
                    <span>{isManager ? 'Manager' : 'Employee'}</span>
                  </Tooltip>
                }
              />
              <PaddedChip
                icon={<SendIcon />}
                label={
                  <>
                    Invited by:
                    {' '}
                    <Tooltip title={inviter.email}>
                      <Typography
                        variant="inherit"
                        color="primary"
                        fontWeight={600}
                        component="span"
                      >
                        {inviter.name}
                      </Typography>
                    </Tooltip>
                  </>
                }
              />
            </>
          )
          : (
            <Chip icon={<BadgeIcon />} label="Admin" />
          )}
      </Stack>
      {/* details form */}
      <Formik
        initialValues={{
          name,
        }}
        validate={withZodSchema(ChangeNameSchema)}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          dirty,
          isSubmitting,
        }) => (
          <Stack
            paddingTop={1}
            gap={2}
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <Stack gap={1}>
              <TextField
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name !== undefined}
                helperText={errors.name ?? 'Please enter your new name'}
                disabled={isSubmitting}
              />
              <TextField
                label="Email"
                disabled={isSubmitting}
                defaultValue={email}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Stack>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={!dirty || !isValid || isSubmitting}
              className={styles.button}
            >
              Update profile
            </Button>
          </Stack>
        )}
      </Formik>
    </Stack>
  );
}
