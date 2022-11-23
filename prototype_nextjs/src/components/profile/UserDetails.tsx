import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import axios from 'axios';

import LoadingButton from '~/components/LoadingButton';
import RoundedRect from '~/components/RoundedRect';
import { type UserInfo } from '~/types';
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

export default function UserDetails({ user }: {
  user: UserInfo
}) {
  const { fname, lname, email, role } = user;

  const [changeStatus, setChangeStatus] = useState(ChangeStatus.NOT_CHANGED);

  const changeDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.currentTarget)) as DetailsFormData;

    setChangeStatus(ChangeStatus.CHANGING);

    const payload: ChangeNamePayload = formData;

    const { data } = await axios.post<ChangeNameResponse>('/api/user/change-name', payload);

    if (data.success) {
      setChangeStatus(ChangeStatus.SUCCEEDED);
    } else { // should never happen
      console.log(data);
      setChangeStatus(ChangeStatus.FAILED);
    }
  };

  // TODO: add a glow to firstName & lastName to show it's editable?

  return (
    <>
      <Form onSubmit={changeDetails}>
        <Row>
          <Col md>
            <FloatingLabel label="First name" className="mb-3" controlId="firstName">
              <Form.Control
                name="firstName"
                defaultValue={fname}
                placeholder="Enter first name"
                required
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel label="Last name" className="mb-3" controlId="lastName">
              <Form.Control
                name="lastName"
                defaultValue={lname}
                placeholder="Enter last name"
                required
              />
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
              isLoading={changeStatus === ChangeStatus.CHANGING}
              loadingContent="Saving"
            >
              Save
            </LoadingButton>
          </div>
        </Row>
      </Form>

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
            Please try again later.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
