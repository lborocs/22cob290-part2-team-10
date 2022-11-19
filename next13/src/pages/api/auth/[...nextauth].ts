import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import type { User } from '~/types';

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
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch('/api/user/login1', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const user: User = await res.json();

        console.log(`user = ${JSON.stringify(user)}`);

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user as any;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    // async jwt({ token, user, account }) {
    //   if (account && user) {
    //     return {
    //       ...token,
    //       accessToken: user.data.token,
    //       refreshToken: user.data.refreshToken,
    //     };
    //   }

    //   return token;
    // },

    // async session({ session, token }) {
    //   session.user.accessToken = token.accessToken;
    //   session.user.refreshToken = token.refreshToken;
    //   session.user.accessTokenExpires = token.accessTokenExpires;

    //   return session;
    // },
  },

  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
