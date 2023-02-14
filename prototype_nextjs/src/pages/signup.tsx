import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import type { z } from 'zod';

import SignUpSchema from '~/schemas/user/signup';
import type { AppPage } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import type { ResponseSchema as SignUpResponse } from '~/pages/api/user/signUp';

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
    <main>
      <Head>
        <title>Signup - Make-It-All</title>
      </Head>

      {/* TODO */}
      <Toaster
        position="top-center"
      />
      <p>
        token = {String(inviteToken)}
      </p>

      <form
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
      </form>
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
