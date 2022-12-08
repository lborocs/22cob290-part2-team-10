import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: PostPage
const PostPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ }) => {
  // TODO: error page if no forum post with provided ID exists
  // TODO: share button (copy URL)

  const pageTitle = '[INSERT POST TITLE] - Make-It-All';

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>
    </main >
  );
};

PostPage.layout = {
  sidebar: {
    type: SidebarType.CUSTOM,
    content: <ForumSidebar />,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const { id } = context.params!;
  const decodedId = hashids.decode(id as string);

  const postId = decodedId[0] as number | undefined;

  // TODO: use prisma to get post from database
  // TODO: convert the post's date from `Date` to number because Date isn't serializable
  // can use `lib/posts#serializablePost`

  return {
    props: {
      session,
      user,
    },
  };
}

export default PostPage;
