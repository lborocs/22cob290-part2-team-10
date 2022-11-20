import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import { signOut } from 'next-auth/react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUser } from '~/pages/api/user/getUser';

export default function ProfilePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  const { fname, lname, email, role } = user;

  // TODO: text avatar on the left or smthn, and click on it to open edit modal

  // TODO: name editable

  return (
    <>
      <Head>
        <title>Profile - Make-ItAll</title>
      </Head>
      <main>
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
              <Button variant='dark'>
                Change
              </Button>

              {/* TODO: modal & toast */}
            </Col>
            <Col>
              <h3>Invite Employee</h3>
              <Button variant='dark'>
                Generate invite
              </Button>

              {/* TODO: modal */}
            </Col>
          </Row>
        </section>

        <br />
        <br />

        <section>
          <h3>Avatar</h3>
          <Button variant='dark'>
            Change avatar colours
          </Button>
          {/*  TODO: modal */}
        </section>

        <br />
        <br />

        <Button variant='danger' onClick={() => signOut({ callbackUrl: '/' })}>
          Sign Out
        </Button>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  // use auth's redirection because it gives callback URL
  if (!session) {
    console.log('PROFILE SSR NO SESSION');
    return {
      props: {
      },
      // redirect: {
      //   destination: '/',
      //   permanent: false,
      // },
    };
  }

  const email = session.user!.email!;
  const user = getUser(email)!;

  return {
    props: {
      session,
      user,
    },
  };
}

ProfilePage.auth = true;
