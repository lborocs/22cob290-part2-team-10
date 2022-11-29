import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import axios from 'axios';
import { Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useStore } from 'zustand';

import LoadingButton from '~/components/LoadingButton';
import RoundedRect from '~/components/RoundedRect';
import { useUserStore } from '~/store/userStore';
import ChangeNameSchema from '~/schemas/api/user/changeName';
import type { RequestSchema as ChangeNamePayload, ResponseSchema as ChangeNameResponse } from '~/pages/api/user/change-name';

type DetailsFormData = {
  firstName: string
  lastName: string
};

enum ChangeStatus {
  NOT_CHANGED,
  CHANGING,
  SUCCEEDED,
  FAILED,
}

export default function UserDetails() {
  const userStore = useUserStore();
  const { setFirstName, setLastName, firstName, lastName, email, role } = useStore(userStore, (state) => ({
    setFirstName: state.setFirstName,
    setLastName: state.setLastName,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    email: state.user.email,
    role: state.user.role,
  }));

  const [changeStatus, setChangeStatus] = useState(ChangeStatus.NOT_CHANGED);

  // TODO: add a glow to firstName & lastName to show it's editable?
  // see https://stackoverflow.com/a/14822905

  const handleSubmit: React.ComponentProps<typeof Formik<DetailsFormData>>['onSubmit']
    = async (values) => {
      // see pages/index#handleSubmit
      document.querySelector<HTMLInputElement>(':focus')?.blur();

      const payload: ChangeNamePayload = values;

      const { data } = await axios.post<ChangeNameResponse>('/api/user/change-name', payload);

      if (data.success) {
        setChangeStatus(ChangeStatus.SUCCEEDED);

        const { firstName, lastName } = values;

        setFirstName(firstName);
        setLastName(lastName);
      } else { // shouldn't really happen
        console.log(data);
        setChangeStatus(ChangeStatus.FAILED);
      }
    };

  return (
    <>
      <Formik
        initialValues={{
          firstName,
          lastName,
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
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Row>
              <Col md>
                <FloatingLabel label="First name" className="mb-3" controlId="firstName">
                  <Form.Control
                    name="firstName"
                    placeholder="Enter first name"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.firstName && !!errors.firstName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col md>
                <FloatingLabel label="Last name" className="mb-3" controlId="lastName">
                  <Form.Control
                    name="lastName"
                    placeholder="Enter last name"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.lastName && !!errors.lastName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel label="Email" className="mb-3">
                  <Form.Control
                    value={email}
                    readOnly
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel label="Role" className="mb-3">
                  <Form.Control
                    value={role}
                    readOnly
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <div>
                <LoadingButton
                  type="submit"
                  variant="success"
                  // isLoading={changeStatus === ChangeStatus.CHANGING}
                  isLoading={isSubmitting}
                  loadingContent="Saving"
                >
                  Save
                </LoadingButton>
              </div>
            </Row>
          </Form>
        )}
      </Formik>

      <ToastContainer className="p-3" position="bottom-end">
        <Toast
          show={changeStatus === ChangeStatus.SUCCEEDED}
          onClose={() => setChangeStatus(ChangeStatus.NOT_CHANGED)}
          autohide
        >
          <Toast.Header>
            <RoundedRect fill="#198754" />
            <strong className="me-auto">Success</strong>
            <small>Now</small>
          </Toast.Header>
          <Toast.Body>
            Details updated.
          </Toast.Body>
        </Toast>
        <Toast
          show={changeStatus === ChangeStatus.FAILED}
          onClose={() => setChangeStatus(ChangeStatus.NOT_CHANGED)}
          autohide
        >
          <Toast.Header>
            <RoundedRect fill="#dc3545" />
            <strong className="me-auto">Failed</strong>
            <small>Now</small>
          </Toast.Header>
          <Toast.Body>
            Please try again.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
