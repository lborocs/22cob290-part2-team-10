import { useState } from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import { signOut } from 'next-auth/react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Layout from '~/components/Layout';
import TextAvatar from '~/components/TextAvatar';
import UserDetails from '~/components/profile/UserDetails';
import ChangePasswordModal from '~/components/profile/ChangePasswordModal';
import InviteModal from '~/components/profile/InviteModal';
import TextAvatarModal from '~/components/profile/TextAvatarModal';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';

import styles from '~/styles/Profile.module.css';

export default function ProfilePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showTextAvatarModal, setShowTextAvatarModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // use to update text avatar when user changes their name
  const [currentUser, setCurrentUser] = useState(user!);

  if (!user) return null;

  // TODO: theme switcher

  return (
    <>
      <Head>
        <title>Profile - Make-It-All</title>
      </Head>
      <Layout user={currentUser} sidebarType="projects">
        <main>
          <Container as="section">
            <Row>
              <Col sm="auto" className="d-flex justify-content-center pb-4 pe-md-4">
                <div>
                  <TextAvatar
                    user={currentUser}
                    className={styles['text-avatar']}
                    size="120px"
                    style={{
                      fontSize: '3em',
                    }}
                    onClick={() => setShowTextAvatarModal(true)}
                  />
                  <TextAvatarModal
                    show={showTextAvatarModal}
                    onHide={() => setShowTextAvatarModal(false)}
                  />
                </div>
              </Col>
              <Col>
                <UserDetails
                  user={currentUser}
                  setUser={setCurrentUser}
                />
              </Col>
            </Row>
          </Container>

          <br />
          <br />

          <section>
            <Row>
              <Col>
                <h3>Change Password</h3>
                <Button
                  variant="dark"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change
                </Button>

                <ChangePasswordModal
                  email={user.email}
                  show={showPasswordModal}
                  onHide={() => setShowPasswordModal(false)}
                />
              </Col>
              <Col>
                <h3>Invite Employee</h3>
                <Button
                  variant="dark"
                  onClick={() => setShowInviteModal(true)}
                >
                  Generate invite
                </Button>

                <InviteModal
                  show={showInviteModal}
                  onHide={() => setShowInviteModal(false)}
                />
              </Col>
            </Row>
          </section>

          <br />
          <br />

          <Button variant="danger" onClick={() => signOut({ callbackUrl: '/' })}>
            Sign Out
          </Button>
        </main>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  // not logged in, will be handled by _app
  // use auth's redirection because it gives callback URL
  if (!session || !session.user) {
    return { props: {} };
  }

  const email = session.user.email!;
  const user = (await getUserInfo(email))!;

  return {
    props: {
      session,
      user,
    },
  };
}
