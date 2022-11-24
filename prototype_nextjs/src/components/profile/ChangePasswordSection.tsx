import { useState } from 'react';
import Button from 'react-bootstrap/Button';

import ChangePasswordModal from '~/components/profile/ChangePasswordModal';

export default function ChangePasswordSection() {
  const [showModal, setshowModal] = useState(false);

  return (
    <div>
      <h3>Change Password</h3>
      <Button
        variant="dark"
        onClick={() => setshowModal(true)}
      >
        Change
      </Button>

      <ChangePasswordModal
        show={showModal}
        onHide={() => setshowModal(false)}
      />
    </div>
  );
}
