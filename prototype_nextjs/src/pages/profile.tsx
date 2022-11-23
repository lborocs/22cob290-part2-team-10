import { useState } from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import { signOut } from 'next-auth/react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

import Layout from '~/components/Layout';
import TextAvatar from '~/components/TextAvatar';
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

  if (!user) return null;

  const { fname, lname, email, role } = user;

  // TODO: name editable properly

  // TODO: big text avatar on the left or smthn, and click on it to open edit modal
  // TODO: organise more like Details: name, email, role

  // TODO: select theme

  return (
    <>
      <Head>
        <title>Profile - Make-It-All</title>
      </Head>
      <Layout user={user} sidebarType="projects">
        <main>
          <section>
            <TextAvatar
              user={user}
              className={styles['text-avatar']}
              size="80px"
              // TODO: make font a bit bigger
              onClick={() => setShowTextAvatarModal(true)}
            />
            <TextAvatarModal
              show={showTextAvatarModal}
              onHide={() => setShowTextAvatarModal(false)}
            />
          </section>

          <section>
            <Row>
              <Form.Group as={Col} lg={5}>
                <InputGroup>
                  <InputGroup.Text>Name</InputGroup.Text>
                  <Form.Control
                    defaultValue={fname}
                  />
                  <Form.Control
                    defaultValue={lname}
                  />
                </InputGroup>
              </Form.Group>
            </Row>
            <Row>
              <Col>
                <h3>Email</h3>
                <span>{email}</span>
              </Col>
              <Col>
                <h3>Role</h3>
                <span>{role}</span>
              </Col>
            </Row>
          </section>

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
