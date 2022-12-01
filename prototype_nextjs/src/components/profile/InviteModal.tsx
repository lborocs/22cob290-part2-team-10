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

export default function InviteEmployeeModal({ show, onHide }: {
  show: boolean
  onHide: () => void
}) {
  const [inviteUrl, setInviteUrl] = useState('');

  const [copyStatus, setCopyStatus] = useState(CopyStatus.NOT_COPIED);
  const [copyFailedFeedback, setCopyFailedFeedback] = useState('');

  const reset = () => {
    setInviteUrl('');
    setCopyStatus(CopyStatus.NOT_COPIED);
  };

  const fetchInviteUrl = (config?: AxiosRequestConfig) => {
    axios.get<InviteUrlResponse>('/api/user/get-invite-url', config)
      .then(({ data }) => setInviteUrl(data.inviteUrl))
      .catch((e) => console.error(e))
      ;
  };

  const copyInviteUrl = () => {
    copyToClipboard(inviteUrl)
      .then(() => setCopyStatus(CopyStatus.SUCCEEDED))
      .catch((e) => {
        setCopyStatus(CopyStatus.FAILED);
        setCopyFailedFeedback(e);
      })
      ;
  };

  const regenerateInvite = () => {
    reset();
    fetchInviteUrl();
  };

  const fetchingInviteUrl = inviteUrl === '';

  useEffect(() => {
    if (show) {
      const controller = new AbortController();
      const signal = controller.signal;

      fetchInviteUrl({ signal });

      return () => {
        controller.abort();
      };
    } else {
      reset();
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Invite URL</Modal.Title>
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
  );
}
