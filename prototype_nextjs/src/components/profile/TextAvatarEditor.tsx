import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import {
  type TextAvatar,
  getDefaultTextAvatar,
  getTextAvatarFromCss,
  getTextAvatarFromStore,
  updateTextAvatarCss,
  updateTextAvatarStore,
} from '~/lib/textAvatar';
import TextAvatarComponent from '~/components/TextAvatar';

import styles from '~/styles/profile/TextAvatarSection.module.css';

// TODO: loading state, maybe use formik?
export default function TextAvatarEditor() {
  const [showModal, setShowModal] = useState(false);

  const [bg, setBg] = useState('');
  const [fg, setFg] = useState('');

  // default as in default values for the form (what is currently set in store - localStorage)
  const [defaultTextAvatar, setDefaultTextAvatar] = useState<TextAvatar>(null as unknown as TextAvatar);

  const onColorChange = (e: React.ChangeEvent<any>) => {
    const inputElem: HTMLInputElement = e.target;

    const { id, value: colour } = inputElem;

    document.documentElement.style.setProperty(`--${id}`, colour);
  };

  // default as in what they had before changing any settings
  const resetToSystemDefault = () => {
    const systemDefault = getDefaultTextAvatar();

    updateTextAvatarCss(systemDefault);

    setBg(systemDefault['avatar-bg']);
    setFg(systemDefault['avatar-fg']);
  };

  const cancelAndClose = async () => {
    updateTextAvatarCss(await getTextAvatarFromStore());
    onHide();
  };

  useEffect(() => {
    if (showModal) {
      // get textAvatar from CSS instead of from store because TextAvatar would have already updated CSS
      const textAvatar = getTextAvatarFromCss();

      setBg(textAvatar['avatar-bg']);
      setFg(textAvatar['avatar-fg']);

      setDefaultTextAvatar(textAvatar);
    }
  }, [showModal]);

  const onHide = () => setShowModal(false);

  return (
    <div>
      <TextAvatarComponent
        className={styles['text-avatar']}
        size="120px"
        style={{
          fontSize: '3em',
        }}
        onClick={() => setShowModal(true)}
      />

      <Modal
        show={showModal}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Avatar</Modal.Title>
          <CloseButton
            onClick={cancelAndClose}
          />
        </Modal.Header>

        <Modal.Body>
          <Form
            id="text-avatar-form"
            onSubmit={async (e) => {
              e.preventDefault();
              // for some reason, the form's values are the default :/
              const newTextAvatar = getTextAvatarFromCss();

              updateTextAvatarCss(newTextAvatar);
              // TODO check result of:
              await updateTextAvatarStore(newTextAvatar);
            }}
            onReset={(e) => {
              setBg(defaultTextAvatar['avatar-bg']);
              setFg(defaultTextAvatar['avatar-fg']);
              updateTextAvatarCss(defaultTextAvatar);
            }}
          >
            <Form.Group as={Row} controlId="avatar-bg">
              <Form.Label column>Background colour</Form.Label>
              <Form.Control
                type="color"
                name="avatar-bg"
                value={bg}
                onChange={(e) => {
                  setBg(e.target.value);
                  onColorChange(e);
                }}
              />
            </Form.Group>
            <Form.Group as={Row} className="mt-1" controlId="avatar-fg">
              <Form.Label column>Text colour</Form.Label>
              <Form.Control
                type="color"
                name="avatar-fg"
                value={fg}
                onChange={(e) => {
                  setFg(e.target.value);
                  onColorChange(e);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={cancelAndClose}
          >
            Close
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={resetToSystemDefault}
          >
            Reset to default
          </Button>
          <Button
            type="reset"
            form="text-avatar-form"
            variant="warning"
            size="sm"
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="text-avatar-form"
            variant="primary"
            size="sm"
            onClick={onHide}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
