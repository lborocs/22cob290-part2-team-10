import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import EmailField from '~/components/EmailField';
import PasswordField from '~/components/PasswordField';
import LoadingButton from '~/components/LoadingButton';
import RoundedRect from '~/components/RoundedRect';
import { isValidMakeItAllEmail, validatePassword } from '~/utils';

import { ErrorReason } from '~/pages/api/user/login';

import styles from '~/styles/Login.module.css';
import makeItAllLogo from '~/../public/make_it_all.png';

type LoginFormData = {
  email: string
  password: string
};

export default function LoginPage() {
  const router = useRouter();

  // handle using this as login page for auth flow
  const { callbackUrl } = router.query;
  const nextUrl = callbackUrl as string ?? '/home';

  const [emailFeedback, setEmailFeedback] = useState<string>();
  const [passwordFeedback, setPasswordFeedback] = useState<string>();

  const [badForm, setBadForm] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setBadForm(emailFeedback !== undefined || passwordFeedback !== undefined);
  }, [emailFeedback, passwordFeedback]);

  const session = useSession();

  if (session.data) {
    console.log('Logged in');
    router.push(nextUrl);
    return null;
  }

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (badForm) return;

    const formData = Object.fromEntries(new FormData(e.currentTarget)) as LoginFormData;
    const { email, password } = formData;

    let _badForm = false;

    if (!isValidMakeItAllEmail(email)) {
      _badForm = true;
      setEmailFeedback('Invalid Make-It-All email');
    }

    const pwError = validatePassword(password);
    if (pwError) {
      _badForm = true;
      setPasswordFeedback(pwError);
    }

    setBadForm(_badForm);
    if (_badForm) return;

    setIsLoggingIn(true);

    const resp = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (resp?.error) {
      const errorReason = resp.error;
      switch (errorReason) {
        case ErrorReason.DOESNT_EXIST:
          setEmailFeedback('You do not have an account');
          break;

        case ErrorReason.WRONG_PASSWORD:
          setPasswordFeedback('Incorrect password');
          break;

        case 'AccessDenied': // left the company
          setEmailFeedback('You no longer have access to this website');
          break;

        default: // shouldn't happen
          console.error(resp);
          setEmailFeedback(errorReason);
          setPasswordFeedback(errorReason);
      }
    }

    setIsLoggingIn(false);
  };

  return (
    <>
      <Head>
        <title>Login - Make-It-All</title>
      </Head>
      <main className={`vh-100 d-flex align-items-center justify-content-center flex-column ${styles.main}`}>
        {callbackUrl ? (
          <ToastContainer className="p-3" position="top-center">
            <Toast>
              <Toast.Header>
                <RoundedRect fill="#ffc107" />
                <strong className="me-auto">Sign in</strong>
                {/* <small>11 mins ago</small> */}
              </Toast.Header>
              <Toast.Body>
                You need to sign in first.
              </Toast.Body>
            </Toast>
          </ToastContainer>
        ) : null}

        <div>
          <Image
            src={makeItAllLogo}
            alt="Make-It-All Logo"
            className="mb-3"
            priority
          />

          <Form onSubmit={login}>
            <EmailField
              name="email"
              feedback={emailFeedback}
              setFeedback={setEmailFeedback}
              defaultValue="alice@make-it-all.co.uk"
            />
            <PasswordField
              name="password"
              controlId="password"
              feedback={passwordFeedback}
              setFeedback={setPasswordFeedback}
              defaultValue="TestPassword123!"
              policyTooltip
            />
            <Form.Group as={Row}>
              <div className="d-flex justify-content-center">
                <LoadingButton
                  variant="secondary"
                  type="submit"
                  isLoading={isLoggingIn}
                  disabled={badForm}
                >
                  Login
                </LoadingButton>
              </div>
            </Form.Group>
          </Form>
        </div>
      </main>
    </>
  );
}

LoginPage.noauth = true;
