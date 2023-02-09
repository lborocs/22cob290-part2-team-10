import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

// import { signUp } from 'next-auth/react';

import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import type { z } from 'zod';
import Link from 'next/link';
import Image, { type ImageLoader } from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { withZodSchema } from 'formik-validator-zod';
// import toast from 'react-hot-toast';

import SignUpSchema from '~/schemas/user/signup';
import type { AppPage } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import type { ResponseSchema as SignUpResponse } from '~/pages/api/user/signUp';
import { Formik, Field, Form, ErrorMessage } from 'formik';

// import FloatingNameField from '~/components/FloatingNameField';
// import FloatingTokenField from '~/components/FloatingTokenField';
// import FloatingEmailField from '~/components/FloatingEmailField';
// import FloatingPasswordField from '~/components/FloatingPasswordField';

import NameField from '~/components/NameField';
import EmailField from '~/components/EmailField';
import PasswordField from '~/components/PasswordField';
import TokenField from '~/components/TokenField';

// import LoadingButton from '~/components/LoadingButton';

// import SignInSchema from '~/schemas/user/signIn';

import styles from '~/styles/SignIn.module.css';

import makeItAllLogo from '~/../public/assets/make_it_all.png';

import darkBg from '~/../public/assets/signin/mesh-63.png';
import darkBgMobile from '~/../public/assets/signin/mesh-63-mobile.png';

const bgImageLoader: ImageLoader = ({ src, width, quality }) => {
  // approx width that should work on most phones and tablets
  if (width <= 2000) {
    // return 'https://www.shutterstock.com/image-photo/barcelona-feb-23-lionel-messi-600w-1900547713.jpg';
    return `/_next/image?url=${darkBgMobile.src}&w=${width}&q=${quality}`;
  }

  return `/_next/image?url=${darkBg.src}&w=${width}&q=${quality}`;
};

// signup?invite=${inviteToken}

type SignUpFormData = z.infer<typeof SignUpSchema>;

// TODO: SignupPage
// TODO: use Formik and SignUpSchema for client-side validation
const SignupPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ inviteToken }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as SignUpFormData;

    const { data } = await axios.post<SignUpResponse>(
      'api/user/signUp',
      formData
    );

    if (data.success) {
      toast.success('Accounted created!');

      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: '/home',
      });
    } else {
      switch (data.reason) {
        case 'ALREADY_EXISTS':
          toast.error('You already have an account!');
          break;

        case 'INVALID_TOKEN':
          toast.error('Your invite token is invalid!');
          break;

        case 'USED_TOKEN':
          toast.error('Your invite token has already been used!');
          break;

        default: // should never happen
          console.error(data);
          toast.error('Sign up failed, please try again later.');
      }
    }
  };

  return (
    <Box
      position="relative"
      height="100vh"
      component="main"
      sx={(theme) => ({
        [theme.getColorSchemeSelector('light')]: {
          bgcolor: theme.vars.palette.makeItAllGrey.main,
        },
      })}
    >
      <Head>
        <title>Sign Up - Make-It-All</title>
      </Head>

      <Box
        position="absolute"
        width={1}
        height={1}
        sx={(theme) => ({
          display: 'none',
          [theme.getColorSchemeSelector('dark')]: {
            display: 'block',
          },
        })}
      >
        <Image
          src={darkBg}
          alt="dark background gradient"
          quality={100}
          sizes="100vw"
          priority
          fill
          style={{
            objectFit: 'cover',
          }}
          loader={bgImageLoader}
        />
      </Box>

      <Paper
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          height: 'fit-content',
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
          borderRadius: 3,
          [theme.getColorSchemeSelector('light')]: {
            bgcolor: theme.vars.palette.makeItAllGrey.main,
            boxShadow: 3,
          },
        })}
      >
        <Box marginBottom={2.5}>
          <Image
            className={styles.logo}
            src={makeItAllLogo}
            alt="Make-It-All Logo"
            quality={100}
            priority
          />
        </Box>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validate={withZodSchema(SignUpSchema)}
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
                <NameField
                  name="name"
                  variant="outlined"
                  size="small"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name !== undefined}
                  helperText={errors.name || 'Please enter your full name'}
                  required
                />
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
                <TokenField
                  name="token"
                  variant="outlined"
                  size="small"
                  value={values.token}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.token && errors.token !== undefined}
                  helperText={errors.token || 'Please enter your invite token'}
                  required
                />
              </div>
              <div>
                <div className={styles.links}>
                  <Link href="/..">
                    <Typography fontWeight={500} color="contrast.main">
                      Back to Login
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
    </Box>
  );
};

// The user does not need to be logged in to access the SignupPage
SignupPage.noAuth = true;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // TODO: decide what to do if they're already signed in
  // ?: toast saying they're already signed in
  // if signed in, redirect to home page
  // if (session && session.user) {
  //   return {
  //     redirect: {
  //       destination: '/home',
  //       permanent: false,
  //     },
  //   };
  // }

  const inviteToken = (context.query?.invite as string | undefined) ?? null;

  return {
    props: {
      inviteToken,
    },
  };
}

export default SignupPage;
