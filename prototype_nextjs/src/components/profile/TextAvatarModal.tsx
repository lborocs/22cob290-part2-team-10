import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import {
  type TextAvatar,
  getDefaultTextAvatar,
  getTextAvatarFromStore,
  updateTextAvatarCss,
  updateTextAvatarStore,
} from '~/components/TextAvatar';

export default function TextAvatarModal({ show, onHide }: {
  show: boolean
  onHide: () => void
}) {
  const [bg, setBg] = useState('');
  const [fg, setFg] = useState('');

  // default as in default values for the form (what is currently set in store - localStorage)
  const [defaultTextAvatar, setDefaultTextAvatar] = useState<TextAvatar>(null as unknown as TextAvatar);

  const formRef = useRef<HTMLFormElement>(null);

  const getTextAvatarFromForm = () => Object.fromEntries(new FormData(formRef.current!)) as TextAvatar;

  const onColorChange = (e: React.ChangeEvent<any>) => {
    const input: HTMLInputElement = e.target;

    const { id, value: colour } = input;

    document.documentElement.style.setProperty(`--${id}`, colour);
  };

  // default as in what they had before changing any settings
  const resetToSystemDefault = () => {
    const systemDefault = getDefaultTextAvatar();

    updateTextAvatarCss(systemDefault);

    setBg(systemDefault['avatar-bg']);
    setFg(systemDefault['avatar-fg']);
  };

  const cancel = () => updateTextAvatarCss(getTextAvatarFromStore());

  useEffect(() => {
    const textAvatar = getTextAvatarFromStore();

    setBg(textAvatar['avatar-bg']);
    setFg(textAvatar['avatar-fg']);

    setDefaultTextAvatar(textAvatar);
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header>
        <Modal.Title>Avatar</Modal.Title>
        <CloseButton
          onClick={() => {
            cancel();
            onHide();
          }}
        />
      </Modal.Header>

      <Modal.Body>
        <Form
          id="text-avatar-form"
          onSubmit={(e) => {
            e.preventDefault();
            const newTextAvatar = getTextAvatarFromForm();
            updateTextAvatarCss(newTextAvatar);
            updateTextAvatarStore(newTextAvatar);
          }}
          onReset={(e) => {
            setBg(defaultTextAvatar['avatar-bg']);
            setFg(defaultTextAvatar['avatar-fg']);
            updateTextAvatarCss(defaultTextAvatar);
          }}
          ref={formRef}
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
          onClick={() => {
            cancel();
            onHide();
          }}
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
  );
}
