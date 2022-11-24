import NextAuth, { type NextAuthOptions, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

import { Role } from '~/types';
import type { ResponseSchema as LoginResponse } from '~/pages/api/user/login';

// TODO: extend User type to match what we return from /api/user/login

export interface SessionUser extends User {
  id: string
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const payload = {
          email: credentials!.email,
          password: credentials!.password,
        };

        const { data } = await axios.post<LoginResponse>(`${process.env.NEXTAUTH_URL as string}/api/user/login`, payload);

        if (data.success) return data.user;
        throw new Error(data.reason);
      },
    }),
  ],

  pages: {
    signIn: '/',
    error: '/auth/error', // Error code passed in query string as ?error=
    newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },

  callbacks: {
    async signIn({ user, account }) {
      const isAllowedToSignIn = (<any>user).role !== Role.LEFT_COMPANY;

      if (isAllowedToSignIn) return true;

      // Return false to display a default error message
      return false;
      // Or you can return a URL to redirect to
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async jwt({ token, user, account }) {
      // const user = _user as any; // should be from LoginResponse

      if (user && account) {
        // modify token...
        token.uid = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.

      if (session.user) {
        // modify session...
        const sUser = session.user as SessionUser;
        sUser.id = token.uid as string;
      }

      return session;
    },
  },

  session: {
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 24 * 60 * 60, // 24 hrs (test)
  },

  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
