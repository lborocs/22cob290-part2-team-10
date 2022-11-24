import { useState } from 'react';
import Button from 'react-bootstrap/Button';

import InviteModal from '~/components/profile/InviteModal';

export default function InviteEmployeeSection() {
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

      <InviteModal
        show={showModal}
        onHide={() => setshowModal(false)}
      />
    </div>
  );
}
