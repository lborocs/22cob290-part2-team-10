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

type DetailsFormData = {
  name: string
};

export default function UserDetails() {
  const { setName, name, email } = useUserStore((state) => ({
    setName: state.setName,
    name: state.user.name,
    email: state.user.email,
  }));

  // TODO: add a glow to firstName & lastName to show it's editable?
  // see https://stackoverflow.com/a/14822905

  const handleSubmit: React.ComponentProps<typeof Formik<DetailsFormData>>['onSubmit']
    = async (values, { resetForm }) => {
      // see pages/index#handleSubmit
      document.querySelector<HTMLInputElement>(':focus')?.blur();

      const payload: ChangeNamePayload = values;

      const updateDetails = async () => {
        const { data } = await axios.post<ChangeNameResponse>('/api/user/change-name', payload);

        if (data.success) {
          const { name } = values;

          setName(name);

          resetForm({ values });
        } else { // shouldn't happen
          console.log(data);
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
          <Row>
            <Col md>
              <FloatingLabel label="Name" className="mb-3" controlId="name">
                <Form.Control
                  name="name"
                  placeholder="Enter Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.name && !!errors.name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>
          </Row>
          {/* <Row>
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
          </Row> */}
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
            <div>
              <Button
                type="submit"
                variant="success"
                disabled={!dirty || !isValid}
              >
                Update profile
              </Button>
            </div>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
