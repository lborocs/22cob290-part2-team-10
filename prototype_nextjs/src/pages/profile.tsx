import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import { signOut } from 'next-auth/react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Toaster } from 'react-hot-toast';

import prisma from '~/lib/prisma';
import { getEmailFromToken } from '~/lib/inviteToken';
import { SidebarType } from '~/components/Layout';
import TextAvatarEditor from '~/components/profile/TextAvatarEditor';
import UserDetails from '~/components/profile/UserDetails';
import ChangePasswordSection from '~/components/profile/ChangePasswordSection';
import InviteEmployeeSection from '~/components/profile/InviteEmployeeSection';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: theme switcher
const ProfilePage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ inviter }) => {
  return (
    <main>
      <Head>
        <title>Profile - Make-It-All</title>
      </Head>

      <Toaster />

      <Container as="section">
        <Row>
          <Col sm="auto" className="d-flex justify-content-center pb-4 pe-md-4">
            <TextAvatarEditor />
          </Col>
          <Col>
            {inviter && (
              <small>Invited by: {inviter.name} ({inviter.email})</small>
            )}
            <UserDetails />
          </Col>
        </Row>
      </Container>

      <br />
      <br />

      <section>
        <Row>
          <Col>
            <ChangePasswordSection />
          </Col>
          <Col>
            <InviteEmployeeSection />
          </Col>
        </Row>
      </section>

      <br />
      <br />

      <Button variant="danger" onClick={() => signOut({ callbackUrl: '/' })}>
        Sign Out
      </Button>
    </main>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  // not signed in, will be handled by _app
  // use auth's redirection because it provides callback URL
  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const { inviteToken } = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      inviteToken: true,
    },
  });

  const inviterEmail = getEmailFromToken(inviteToken);

  const inviter = inviterEmail
    ? await prisma.user.findUniqueOrThrow({
      where: {
        email: inviterEmail,
      },
      select: {
        email: true,
        name: true,
      },
    })
    : null;

  return {
    props: {
      session,
      user,
      inviter,
    },
  };
}

ProfilePage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export default ProfilePage;
