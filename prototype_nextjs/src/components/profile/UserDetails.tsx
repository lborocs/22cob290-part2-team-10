import { signIn } from 'next-auth/react';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import toast from 'react-hot-toast';

import useUserStore from '~/store/userStore';
import ChangeNameSchema from '~/schemas/user/changeName';
import type { RequestSchema as ChangeNamePayload, ResponseSchema as ChangeNameResponse } from '~/pages/api/user/change-name';

import styles from '~/styles/Profile.module.css';

type DetailsFormData = {
  name: string
};

/**
 * Lists user info (name, email).
 *
 * Provides functionality for the user to change their name.
 */
export default function UserDetails() {
  const { setName, name, email } = useUserStore((state) => ({
    setName: state.setName,
    name: state.user.name,
    email: state.user.email,
  }));

  // TODO: add a glow to name to show it's editable?
  // see https://stackoverflow.com/a/14822905

  const handleSubmit: React.ComponentProps<typeof Formik<DetailsFormData>>['onSubmit']
    = async (values, { setFieldError, resetForm }) => {
      // see pages/index#handleSubmit
      document.querySelector<HTMLInputElement>(':focus')?.blur();

      const payload: ChangeNamePayload = values;

      const updateDetails = async () => {
        const { data } = await axios.post<ChangeNameResponse>('/api/user/change-name', payload);

        if (data.success) {
          const { name } = values;

          /**
           * Workaround to update the user's name in the cookie/session stored on the client when they
           *  change their name.
           *
           * Without this: when changing pages, their old name will still be displayed until they sign out
           *  and sign back in
           *
           * @see [...nextauth].ts
           */
          await signIn('credentials', {
            refetchUser: true,
            redirect: false,
          });

          setName(name);

          resetForm({ values });
        } else { // shouldn't happen
          console.error(data);
          throw new Error();
        }
      };

      await toast.promise(updateDetails(), {
        loading: 'Updating...',
        error: 'Please try again.',
        success: 'Details updated.',
      }, {
        position: 'bottom-center',
      });
    };

  return (
    <Formik
      initialValues={{
        name,
      }}
      validate={withZodSchema(ChangeNameSchema)}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
        dirty,
      }) => (
        <Form onSubmit={handleSubmit} noValidate>
          <Row className="mb-3">
            <Col>
              <FloatingLabel label="Name" controlId="name">
                <Form.Control
                  name="name"
                  placeholder="Enter Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.name && errors.name !== undefined}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <FloatingLabel label="Email">
                <Form.Control
                  value={email}
                  title="email"
                  placeholder="Email"
                  readOnly
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                type="submit"
                variant="success"
                disabled={!dirty || !isValid}
                className={styles.button}
              >
                Update profile
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
