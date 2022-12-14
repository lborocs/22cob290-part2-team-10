import { useEffect } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth/next';
import { signIn } from 'next-auth/react';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import toast, { Toaster } from 'react-hot-toast';

import FloatingEmailField from '~/components/FloatingEmailField';
import FloatingPasswordField from '~/components/FloatingPasswordField';
import LoadingButton from '~/components/LoadingButton';
import SignInSchema from '~/schemas/user/signIn';
import type { AppPage } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

import styles from '~/styles/SignIn.module.css';
import makeItAllLogo from '~/../public/make_it_all.png';

type SignInFormData = {
  email: string
  password: string
};

// TODO: add create account link that takes to /signup
const SignInPage: AppPage = () => {
  const router = useRouter();

  // handle using this as signIn page for auth flow
  const { callbackUrl } = router.query;
  const nextUrl = callbackUrl as string | undefined ?? '/home';

  const handleSubmit: React.ComponentProps<typeof Formik<SignInFormData>>['onSubmit']
    = async ({ email, password }, { setFieldError }) => {
      // unfocus the focused element so that an error from backend doesn't almost immediately
      // disappear if they submitted the form while focused on an element (i.e. pressed enter.
      // because touched will update to true when they unfocus from the element
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
      toast.error((t) => (
        <span onClick={() => toast.dismiss(t.id)} style={{ cursor: 'pointer' }}>
          You need to sign in first.
        </span>
      ), {
        id: 'needToSignIn',
        duration: Infinity,
      });
    }
  }, [callbackUrl]);

  return (
    <main className={styles.main}>
      <Head>
        <title>Sign In - Make-It-All</title>
      </Head>

      <Toaster
        position="top-center"
      />

      <div className={styles.wrapper}>
        <Image
          className={`mb-3 ${styles.logo}`}
          src={makeItAllLogo}
          alt="Make-It-All Logo"
          priority
        />

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
            <Form
              onSubmit={handleSubmit}
              className={styles.formGrid}
              noValidate
            >
              <div>
                <FloatingEmailField
                  name="email"
                  controlId="email"
                  feedback={touched.email ? errors.email : undefined}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && errors.email !== undefined}
                  feedbackTooltip
                  onlyFeedbackOutline={errors.email?.length === 0}
                />
              </div>
              <div>
                <FloatingPasswordField
                  name="password"
                  controlId="password"
                  feedback={touched.password ? errors.password : undefined}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && errors.password !== undefined}
                  feedbackTooltip
                  onlyFeedbackOutline={errors.password?.length === 0}
                  policyTooltip
                />
              </div>
              <div>
                <div className={styles.links}>
                  <Link href="/signup" className={styles.signupLink}>
                    Create Account
                  </Link>
                  <LoadingButton
                    variant="secondary"
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={!isValid}
                    className={styles.signInBtn}
                  >
                    Sign In
                  </LoadingButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

// The user does not need to be logged in to access the SignInPage
SignInPage.noAuth = true;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  // if signed in, redirect to home page
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
