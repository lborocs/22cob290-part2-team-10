import { useEffect, useState } from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getCsrfToken } from 'next-auth/react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import EmailField from '~/components/EmailField';
import PasswordField from '~/components/PasswordField';
import { isValidMakeItAllEmail, validatePassword } from '~/utils';

import styles from '~/styles/Login.module.css';
import makeItAllLogo from '~/../public/make_it_all.png';

type LoginFormData = {
  username: string
  password: string
};

export default function SignInPage({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [emailFeedback, setEmailFeedback] = useState<string>();
  const [passwordFeedback, setPasswordFeedback] = useState<string>();

  const [badForm, setBadForm] = useState(false);

  useEffect(() => {
    setBadForm(emailFeedback !== undefined || passwordFeedback !== undefined);
  }, [emailFeedback, passwordFeedback]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (badForm) return e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.currentTarget)) as LoginFormData;
    const { username, password } = formData;

    let _badForm = false;

    if (!isValidMakeItAllEmail(username)) {
      _badForm = true;
      setEmailFeedback('Invalid Make-It-All email');
    }

    const pwError = validatePassword(password);
    if (pwError) {
      _badForm = true;
      setPasswordFeedback(pwError);
    }

    setBadForm(_badForm);
    if (_badForm) return e.preventDefault();
  };

  return (
    <main className={`vh-100 d-flex align-items-center justify-content-center flex-column ${styles.main}`}>
      <Head>
        <title>Login - Make-It-All</title>
      </Head>
      <div>
        <Image
          src={makeItAllLogo}
          alt="Make-It-All Logo"
          className="mb-3"
          priority
        />

        <Form onSubmit={onSubmit} method="post" action="/api/auth/signin/credentials">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <EmailField
            name="username"
            feedback={emailFeedback}
            setFeedback={setEmailFeedback}
          />
          <PasswordField
            name="password"
            controlId="password"
            feedback={passwordFeedback}
            setFeedback={setPasswordFeedback}
            policyTooltip
          />
          <Form.Group as={Row}>
            <div className="d-flex justify-content-center">
              <Button
                variant="secondary"
                type="submit"
                disabled={badForm}
              >
                Login
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken: csrfToken!,
    },
  };
}
