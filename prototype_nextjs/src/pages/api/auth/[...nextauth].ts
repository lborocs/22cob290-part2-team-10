import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import type { z } from 'zod';

import prisma from '~/lib/prisma';
import { isCorrectPassword } from '~/lib/user';
import SignInSchema from '~/schemas/user/signIn';
import type { SessionUser } from '~/types';
import type { ResponseSchema as GetUserFromSessionResponse } from '~/pages/api/user/get-user-from-session';

/**
 * Get a user from the database.
 * The user is identified by their email and password.
 * If the user is not found, null is returned.
 *
 * @param credentials The email and password of the user. See {@link SignInSchema}.
 * @returns The user. See {@link SessionUser}.
 */
async function getUser(
  credentials: z.infer<typeof SignInSchema>
): Promise<SessionUser | null> {
  const safeParseResult = SignInSchema.safeParse(credentials);

  if (!safeParseResult.success) {
    return null;
  }

  const { email, password } = safeParseResult.data;

  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
    select: {
      id: true,
      email: true,
      name: true,
      hashedPassword: true,
      isManager: true,
    },
  });

  if (!user) return null;

  if (!(await isCorrectPassword(password, user.hashedPassword))) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: null,
    isManager: user.isManager,
  };
}

async function hasLeftCompany(userId: string): Promise<boolean | undefined> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      leftCompany: true,
    },
  });

  return user?.leftCompany;
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
        refetchUser: {},
      },
      async authorize(credentials, req) {
        /**
         * Workaround to update the user's details in the cookie/session stored on the client. Need
         *  a workaround because Next-Auth doesn't currently support doing mutating the cookie/session.
         *
         * Works by basically re-signing them in (getting their info from database again), but instead
         *  of using their email & password, it uses the session to know who is signed in.
         *  - We can't use their email & password because their password isn't stored in plain text, and
         *   it's inconvenient to ask them to re-enter it.
         *
         * After "signing in", next-auth's signIn flow will re-set the cookie/session stored on the client.
         */
        if (credentials!.refetchUser) {
          const { data } = await axios.get<GetUserFromSessionResponse>(
            `${process.env.NEXTAUTH_URL}/api/user/get-user-from-session`,
            {
              headers: {
                // because we're making the request from the server, we basically pretend to be the user making the request
                cookie: req.headers!.cookie,
              },
            }
          );
          return data.user;
        }

        const user = await getUser(credentials!);

        if (user) return user;
        return null;
      },
    }),
  ],

  pages: {
    signIn: '/',
  },

  callbacks: {
    async signIn({ user, account }) {
      const isAllowedToSignIn = !(await hasLeftCompany(user.id));

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

    async jwt({ token, user: _user, account }) {
      const user = _user as SessionUser | undefined;

      if (user && account) {
        // modify token...
        token.uid = user.id;
        token.isManager = user.isManager;
      }

      return token;
    },

    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.

      if (session.user) {
        // modify session...
        const sUser = session.user as SessionUser;
        sUser.id = token.uid as string;
        sUser.isManager = token.isManager as boolean;
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
