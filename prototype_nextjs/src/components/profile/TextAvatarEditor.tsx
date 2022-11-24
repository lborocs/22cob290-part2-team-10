import { useState } from 'react';

import TextAvatar from '~/components/TextAvatar';
import TextAvatarModal from '~/components/profile/TextAvatarModal';

import styles from '~/styles/profile/TextAvatarSection.module.css';

export default function TextAvatarEditor() {
  const [showModal, setshowModal] = useState(false);

  return (
    <div>
      <TextAvatar
        className={styles['text-avatar']}
        size="120px"
        style={{
          fontSize: '3em',
        }}
        onClick={() => setshowModal(true)}
      />
      <TextAvatarModal
        show={showModal}
        onHide={() => setshowModal(false)}
      />
    </div>
  );
}
