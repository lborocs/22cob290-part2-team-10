import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

import EmailField from '~/components/EmailField';
import PasswordField from '~/components/PasswordField';
import LoadingButton from '~/components/LoadingButton';
import { Role } from '~/types';
import { isValidMakeItAllEmail, validatePassword } from '~/utils';

import { ErrorReason, type ResponseSchema } from '~/pages/api/user/login';

import styles from '~/styles/Login.module.css';
import makeItAllLogo from '~/../public/make_it_all.png';

type LoginFormData = {
  email: string
  password: string
};

// TODO
export function getServerSideProps() {
  // TODO: check for logged in cookie, or use next-auth
  return {
    props: {

    },
  };
}

// TODO: NEXT AUTH
export default function LoginPage() {
  // const router = useRouter();

  // const [emailFeedback, setEmailFeedback] = useState<string>();
  // const [passwordFeedback, setPasswordFeedback] = useState<string>();

  // const [badForm, setBadForm] = useState(false);

  // const [isLoggingIn, setIsLoggingIn] = useState(false);

  // useEffect(() => {
  //   setBadForm(emailFeedback !== undefined || passwordFeedback !== undefined);
  // }, [emailFeedback, passwordFeedback]);

  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user!.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  } else {
    // signIn('credentials', {
    //   // callbackUrl: 'http://localhost:3000/loggedintest',
    // });
    signIn();
    return null;
    // return (
    //   <>
    //     Not signed in!!! <br />
    //     <button onClick={() => signIn()}>Sign in</button>
    //   </>
    // );
  }

  // const login = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (badForm) return;

  //   const formData = Object.fromEntries(new FormData(e.currentTarget)) as LoginFormData;
  //   const { email, password } = formData;

  //   let _badForm = false;

  //   if (!isValidMakeItAllEmail(email)) {
  //     _badForm = true;
  //     setEmailFeedback('Invalid Make-It-All email');
  //   }

  //   const pwError = validatePassword(password);
  //   if (pwError) {
  //     _badForm = true;
  //     setPasswordFeedback(pwError);
  //   }

  //   setBadForm(_badForm);
  //   if (_badForm) return;

  //   setIsLoggingIn(true);

  //   let res: ResponseSchema | null = null;
  //   try {
  //     const { data } = await axios.post<ResponseSchema>('api/user/login', formData);
  //     res = data;
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       //handleAxiosError(error);
  //     } else {
  //       //handleUnexpectedError(error);
  //     }
  //     alert(error);
  //     setIsLoggingIn(false);
  //     return;
  //   }

  //   console.log(res);
  //   if (res.success) {
  //     const { user } = res;

  //     if (user.role === Role.LEFT_COMPANY) {
  //       setEmailFeedback('You no longer have access to this website');
  //     } else {
  //       alert(`Logged in as ${JSON.stringify(user)}`);
  //       await router.push('/home');
  //     }
  //   } else {
  //     switch (res.reason) {
  //       case ErrorReason.DOESNT_EXIST:
  //         setEmailFeedback('You do not have an account');
  //         break;

  //       case ErrorReason.WRONG_PASSWORD:
  //         setPasswordFeedback('Incorrect password');
  //         break;

  //       default: // shouldn't happen
  //         setEmailFeedback(res.reason);
  //         setPasswordFeedback(res.reason);
  //     }
  //   }

  //   setIsLoggingIn(false);
  // };

  // return (
  //   <main className={`vh-100 d-flex align-items-center justify-content-center flex-column ${styles.main}`}>
  //     <Head>
  //       <title>Login - Make-It-All</title>
  //     </Head>
  //     <div>
  //       <Image
  //         src={makeItAllLogo}
  //         alt="Make-It-All Logo"
  //         className="mb-3"
  //         priority
  //       />

  //       <Form onSubmit={login}>
  //         <EmailField
  //           name="email"
  //           feedback={emailFeedback}
  //           setFeedback={setEmailFeedback}
  //         />
  //         <PasswordField
  //           name="password"
  //           controlId="password"
  //           feedback={passwordFeedback}
  //           setFeedback={setPasswordFeedback}
  //           policyTooltip
  //         />
  //         <Form.Group as={Row}>
  //           <div className="d-flex justify-content-center">
  //             <LoadingButton
  //               variant="secondary"
  //               type="submit"
  //               isLoading={isLoggingIn}
  //               disabled={badForm}
  //             >
  //               Login
  //             </LoadingButton>
  //           </div>
  //         </Form.Group>
  //       </Form>
  //     </div>
  //   </main>
  // );
}
