import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import { Clipboard2Fill } from 'react-bootstrap-icons';
import axios, { type AxiosRequestConfig } from 'axios';

import { copyToClipboard } from '~/utils';
import type { ResponseSchema as InviteUrlResponse } from '~/pages/api/user/get-invite-url';

enum CopyStatus {
  NOT_COPIED,
  FAILED,
  SUCCEEDED,
}

/**
 * Component providing functionality for the user to invite an employee to join
 *  the system.
 */
export default function InviteEmployeeSection() {
  const [showModal, setShowModal] = useState(false);

  const [inviteUrl, setInviteUrl] = useState('');

  const [copyStatus, setCopyStatus] = useState(CopyStatus.NOT_COPIED);
  const [copyFailedFeedback, setCopyFailedFeedback] = useState('');

  const reset = () => {
    setInviteUrl('');
    setCopyStatus(CopyStatus.NOT_COPIED);
  };

  const fetchInviteUrl = async (config?: AxiosRequestConfig) => {
    try {
      const { data } = await axios.get<InviteUrlResponse>('/api/user/get-invite-url', config);
      setInviteUrl(data.inviteUrl);
    } catch (e) {
      console.error(e);
    }
  };

  const copyInviteUrl = async () => {
    try {
      await copyToClipboard(inviteUrl);
      setCopyStatus(CopyStatus.SUCCEEDED);
    } catch (e: any) {
      setCopyStatus(CopyStatus.FAILED);
      setCopyFailedFeedback(String(e));
    }
  };

  const regenerateInvite = async () => {
    reset();

    // artificial delay
    await new Promise((res) => setTimeout(res, 400));

    await fetchInviteUrl();
  };

  const fetchingInviteUrl = inviteUrl === '';

  useEffect(() => {
    if (showModal) {
      const controller = new AbortController();
      const signal = controller.signal;

      fetchInviteUrl({ signal });

      return () => {
        controller.abort();
      };
    } else {
      reset();
    }
  }, [showModal]);

  const onHide = () => setShowModal(false);

  return (
    <div>
      <h3>Invite Employee</h3>
      <Button
        variant="dark"
        onClick={() => setShowModal(true)}
        style={{
          width: '10em',
        }}
      >
        Generate invite
      </Button>

      <Modal
        show={showModal}
        onHide={onHide}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Invite URL (valid for 7 days)</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              value={fetchingInviteUrl ? 'Generating...' : inviteUrl}
              isValid={copyStatus === CopyStatus.SUCCEEDED}
              isInvalid={copyStatus === CopyStatus.FAILED}
              readOnly
            />
            <Button
              variant="outline-secondary"
              onClick={copyInviteUrl}
              disabled={fetchingInviteUrl}
              className="d-flex align-items-center"
            >
              <Clipboard2Fill />
            </Button>
            {/* even with hasValidation, it doesn't show rounded corners with 2 feedback elements :( */}
            <Form.Control.Feedback
              // dont need to handle NOT_COPIED because this shouldn't be shown if NOT_COPIED
              type={copyStatus === CopyStatus.SUCCEEDED ? 'valid' : 'invalid'}
            >
              {copyStatus === CopyStatus.SUCCEEDED ? 'Coped!' : copyFailedFeedback}
            </Form.Control.Feedback>
          </InputGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={onHide}>
            Close
          </Button>
          <Button variant="success" size="sm" onClick={regenerateInvite}>
            Regenerate
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
