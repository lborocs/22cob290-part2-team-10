import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

import { encodeString } from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { NextLinkComposed } from '~/components/Link';
import UserAvatar from '~/components/avatar/UserAvatar';

const AuthorsPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authorsOfPosts }) => {
  return (
    <main>
      <Head>
        <title>Authors - Make-It-All</title>
      </Head>

      <Typography
        component="span"
        sx={(theme) => ({
          bgcolor: blue[100],
          borderStyle: 'solid',
          fontSize: 'large',
          borderRadius: '20px',
          paddingInline: '15px',
          margin: '0px',
          paddingTop: '1.8px',
          fontWeight: 'bold',
          [theme.getColorSchemeSelector('dark')]: {
            bgcolor: blue['700'],
          },
        })}
      >
        Authors - Make-It-All
      </Typography>

      {authorsOfPosts.map((author) => (
        <Box
          key={author.id}
          sx={{
            borderStyle: 'solid',
            borderColor: 'solid white',
            borderRadius: '8px',
            paddingX: 1,
            paddingY: 0.5,
            width: 'fit-content',
            marginTop: 2,
          }}
          component={NextLinkComposed}
          to={`/forum/authors/${encodeString(author.id)}`}
          display="flex"
          alignItems="center"
        >
          <UserAvatar
            userId={author.id}
            name={author.name}
            image={author.image}
            sx={{
              marginRight: 1,
            }}
          />
          <b>{author.name}</b>: click here to see all posts by this author
        </Box>
      ))}
    </main>
  );
};

AuthorsPage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const nested = await prisma.post.findMany({
    select: { authorId: true },
  });
  const authorsOfPosts = await prisma.user.findMany({
    where: {
      id: {
        in: nested.map((nested) => nested.authorId),
      },
    },
  });

  return {
    props: {
      session,
      user,
      authorsOfPosts,
    },
  };
}

export default AuthorsPage;
