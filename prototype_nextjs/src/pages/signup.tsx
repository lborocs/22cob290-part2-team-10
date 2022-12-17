import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import type { z } from 'zod';
import Image from 'next/image';

import SignUpSchema from '~/schemas/user/signup';
import type { AppPage } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import type { ResponseSchema as SignUpResponse } from '~/pages/api/user/signUp';
import { Formik, Field, Form, ErrorMessage } from "formik";
import FloatingNameField from '~/components/FloatingNameField';
import FloatingTokenField from '~/components/FloatingTokenField';
import FloatingEmailField from '~/components/FloatingEmailField';
import FloatingPasswordField from '~/components/FloatingPasswordField';
import LoadingButton from '~/components/LoadingButton';
import SignInSchema from '~/schemas/user/signIn';
import { withZodSchema } from 'formik-validator-zod';
import styles from '~/styles/SignIn.module.css';

import makeItAllLogo from '~/../public/make_it_all.png';





// signup?invite=${inviteToken}

type SignUpFormData = z.infer<typeof SignUpSchema>;

// TODO: SignupPage
// TODO: use Formik and SignUpSchema for client-side validation
const SignupPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ inviteToken }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as SignUpFormData;

    const { data } = await axios.post<SignUpResponse>('api/user/signUp', formData);

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
    <main className={styles.main}>
      <Head>
        <title>Signup - Make-It-All</title>
      </Head>

      {/* TODO */}
      <Toaster
        position="top-center"
      />
      {/* <p>
        token = {String(inviteToken)}
      </p> */}





      <div className={styles.wrapper}>
        <Image
          className={`mb-3 ${styles.logo}`}
          src={makeItAllLogo}
          alt="Make-It-All Logo"
          priority
        />

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
            <Form
              onSubmit={handleSubmit}
              className={styles.formGrid}
              noValidate
            >
              <div>
                <FloatingTokenField
                  name='inviteToken'
                  controlId='inviteToken'
                  value={values.inviteToken}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.inviteToken && errors.inviteToken !== undefined}
                  feedbackTooltip
                  onlyFeedbackOutline={errors.inviteToken?.length === 0}
                />
              </div>

              <div>
                <FloatingNameField
                  name='name'
                  controlId='name'
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.name && errors.name !== undefined}
                  feedbackTooltip
                  onlyFeedbackOutline={errors.name?.length === 0}
                />
              </div>


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
                  <LoadingButton
                    variant="secondary"
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={!isValid}
                    className={styles.signInBtn}
                  >
                    Sign Up
                  </LoadingButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>



      {/* <Formik
        initialValues={{ inviteToken: '', email: '', name: '', password: '' }}
        validate={values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }
          if (!values.password) {
            errors.password = 'Required';
          } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,64}$/i.test(values.password)
          ) {
            errors.password = `
           Invalid Password. Please ensure password is at least 12 characters long,
           at least 1 uppercase,
           at least 1 lowercase,
           at least 1 number
           and at least 1 special symbol`;
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik> */}




      {/* previous form implemented without formik */}
      {/* <form
        onSubmit={handleSubmit}
      >
        <input
          name="inviteToken"
          title="Invite token"
          placeholder="Enter invite token"
          defaultValue={inviteToken ?? undefined}
        />
        <input
          name="email"
          title="Email"
          placeholder="Enter email"
        />
        <input
          name="name"
          title="Name"
          placeholder="Enter name"
        />
        <input
          name="password"
          title="Password"
          placeholder="Enter password"
        />
        <button type="submit">
          Sign up
        </button>
      </form> */}
    </main>
  );
};

// The user does not need to be logged in to access the SignupPage
SignupPage.noAuth = true;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

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

  const inviteToken = context.query?.invite as string | undefined ?? null;

  return {
    props: {
      inviteToken,
    },
  };
}

export default SignupPage;
