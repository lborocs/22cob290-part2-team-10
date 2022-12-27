import { useEffect } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth/next';
import { signIn } from 'next-auth/react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import toast from 'react-hot-toast';

import EmailField from '~/components/EmailField';
import PasswordField from '~/components/PasswordField';
import SignInSchema from '~/schemas/user/signIn';
import type { AppPage } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

import styles from '~/styles/SignIn.module.css';
import makeItAllLogo from '~/../public/make_it_all.png';

type SignInFormData = {
  email: string
  password: string
};

// https://youtube.com/watch?v=WJvmUKCYlN0&si=EnSIkaIECMiOmarE&t=184
// TODO: use moving(?) aurora gradient for bg behind paper
const SignInPage: AppPage = () => {
  const router = useRouter();

  // handle using this as signIn page for auth flow
  const { callbackUrl } = router.query;
  const nextUrl = callbackUrl as string | undefined ?? '/home';

  const handleSubmit: React.ComponentProps<typeof Formik<SignInFormData>>['onSubmit']
    = async ({ email, password }, { setFieldError }) => {
      // Unfocus the focused element so that an error from backend doesn't almost immediately
      // disappear if they submitted the form while focused on an element (i.e. pressed enter).
      // Because touched will immediately update to true when they unfocus from the element
      document.querySelector<HTMLInputElement>(':focus')?.blur();

      toast.dismiss('signInFailed');

      const resp = (await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: nextUrl,
      }))!;

      // unspecific signin feedback because spec letter says:
      // "We would like suitable aspects of data protection considered so the sys‐
      // tem cannot be exploited to target specific individual"
      if (resp.error) {
        // https://next-auth.js.org/configuration/pages#error-codes
        switch (resp.error) {
          case 'CredentialsSignin': // failed signin
            toast.error('Could not sign in, please check your credentials.', {
              id: 'signInFailed',
              position: 'top-center',
            });
            setFieldError('email', '');
            setFieldError('password', '');
            break;

          case 'AccessDenied': // left the company
            toast.dismiss();
            setFieldError('email', 'You no longer have access to this website');
            break;

          default: // shouldn't happen
            console.error(resp);
            setFieldError('email', resp.error);
            setFieldError('password', resp.error);
        }
      } else {
        toast.dismiss();
        router.push(resp.url!);
      }
    };

  useEffect(() => {
    if (callbackUrl) {
      // TODO: add close icon
      const toastId = toast.error((t) => (
        <span onClick={() => toast.dismiss(t.id)} style={{ cursor: 'pointer' }}>
          You need to sign in first.
        </span>
      ), {
        id: 'needToSignIn',
        duration: Infinity,
      });

      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [callbackUrl]);

  return (
    <main>
      <Head>
        <title>Sign In - Make-It-All</title>
      </Head>

      <Paper sx={(theme) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
        height: 'fit-content',
        bgcolor: theme.palette.mode === 'light' ? '#d3d3d3' : undefined,
        width: {
          xs: '85vw',
          sm: '70vw',
          md: '50vw',
          lg: '45vw',
          xl: '35vw',
        },
        padding: {
          xs: 3,
          md: 8,
        },
      })}>
        <Box marginBottom={2.5}>
          <Image
            className={styles.logo}
            src={makeItAllLogo}
            alt="Make-It-All Logo"
            priority
          />
        </Box>

        <Formik
          initialValues={{
            email: 'alice@make-it-all.co.uk',
            password: 'TestPassword123!',
          }}
          validate={withZodSchema(SignInSchema)}
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
          }) => (
            <form
              onSubmit={handleSubmit}
              className={styles.formGrid}
              noValidate
            >
              <div className={styles.inputGrid}>
                <EmailField
                  name="email"
                  variant="outlined"
                  size="small"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email !== undefined}
                  helperText={errors.email || 'Please enter your work email'}
                  required
                />
                <PasswordField
                  name="password"
                  variant="outlined"
                  size="small"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password !== undefined}
                  helperText={errors.password || 'Please enter your password'}
                  policyTooltip
                  required
                />
              </div>
              <div>
                <div className={styles.links}>
                  <Link href="/signup">
                    <Typography fontWeight={500} color="contrast.main">
                      Create Account
                    </Typography>
                  </Link>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={!isValid}
                    className={styles.signInBtn}
                  >
                    Sign in
                  </LoadingButton>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </Paper>
    </main>
  );
};

// The user does not need to be logged in to access the SignInPage
SignInPage.noAuth = true;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  // if signed in, redirect to home page or callbackUrl
  if (session && session.user) {
    const { callbackUrl } = context.query;

    return {
      redirect: {
        destination: callbackUrl ?? '/home',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default SignInPage;
