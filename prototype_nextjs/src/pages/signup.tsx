import Head from 'next/head';

import Link from 'next/link';
import Image, { type ImageLoader } from 'next/image';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { withZodSchema } from 'formik-validator-zod';
import type { z } from 'zod';
import toast from 'react-hot-toast';

import { Formik } from 'formik';

import SignUpSchema from '~/schemas/user/signup';

import NameField from '~/components/NameField';
import EmailField from '~/components/EmailField';
import PasswordField from '~/components/PasswordField';
import TokenField from '~/components/TokenField';

import type { SignupResponse } from '~/pages/api/user/signup';

import styles from '~/styles/SignIn.module.css';

import makeItAllLogo from '~/../public/assets/make_it_all.png';

import darkBg from '~/../public/assets/signin/mesh-63.png';
import darkBgMobile from '~/../public/assets/signin/mesh-63-mobile.png';

const bgImageLoader: ImageLoader = ({ src, width, quality }) => {
  //function to help with responsive image
  // the approx width that should work on most phones and tablets is used
  if (width <= 2000) {
    // return 'https://www.shutterstock.com/image-photo/barcelona-feb-23-lionel-messi-600w-1900547713.jpg';
    return `/_next/image?url=${darkBgMobile.src}&w=${width}&q=${quality}`;
  }

  return `/_next/image?url=${darkBg.src}&w=${width}&q=${quality}`;
};

// TODO: get inviteToken from query param (getServerSideProps)

export default function SignupPage() {
  /*
  This code is a Next.js component that is responsible for creating a sign-up page. The component uses
  Material-UI and Formik libraries to create a form for users to input their information to sign up.
  */
  async function createUser(formData: z.infer<typeof SignUpSchema>) {
    // function for sending user information to the server
    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(formData),
    });

    return (await response.json()) as SignupResponse;
  }
  return (
    /*
    a Material-UI Box component is returned as the main container for the
    page and includes the necessary form fields and validation using Formik
    */
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
            name: '',
            email: '',
            password: '',
            inviteToken: '',
          }}
          validate={withZodSchema(SignUpSchema)} // uses schema defined in SignupSchema in order to validate the input into the form
          onSubmit={(values, { setSubmitting }) => {
            // when all data has been input, onSubmit is called to send the data to the function that handles submission
            setTimeout(() => {
              createUser(values)
                .then((response) => {
                  console.log('response =', response);
                  if ('message' in response) {
                    toast.error(response.message); // this gives notification to user that an error has occured in processing the creation of a new user
                  } else {
                    toast.success(
                      `You have successfully created an account for ${response.name}. Redirecting in 3 seconds...`
                    ); // notification for successful creation of user
                    setTimeout(() => window.location.replace('..'), 3000);
                  }
                })
                .catch((err) => {
                  // used for testing
                });
              setSubmitting(false);
            }, 400);
          }}
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
                  name="inviteToken"
                  variant="outlined"
                  size="small"
                  value={values.inviteToken}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.inviteToken && errors.inviteToken !== undefined
                  }
                  helperText={
                    errors.inviteToken || 'Please enter your invite token'
                  }
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
}
SignupPage.noAuth = true;
