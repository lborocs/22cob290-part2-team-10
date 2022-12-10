import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { Formik, type FormikProps } from 'formik';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import {
  type TextAvatar,
  getDefaultTextAvatar,
  getTextAvatarFromStore,
  updateTextAvatarStore,
  updateTextAvatarCss,
} from '~/lib/textAvatar';
import TextAvatarComponent from '~/components/TextAvatar';
import LoadingButton from '~/components/LoadingButton';

import styles from '~/styles/profile/TextAvatarSection.module.css';

/**
 * Component providing functionality for the user to change the colours of their text avatar.
 */
export default function TextAvatarEditor() {
  const [showModal, setShowModal] = useState(false);

  // default as in default values for the form (what is currently set in store)
  const [defaultTextAvatar, setDefaultTextAvatar] = useState<TextAvatar>(null as unknown as TextAvatar);

  // can't use formikRef.current.isSubmitting because this component wouldn't re-render on submit (only the form would)
  // so the LoadingButton doesn't enter it's loading state - it won't visually change
  // but by setting isSaving in the Formik render function, this component will re-render on submit
  const [isSaving, setIsSaving] = useState(false);

  const formikRef = useRef<FormikProps<TextAvatar>>(null);

  // using SWR like useEffect(..., [])
  useSWR('defaultTextAvatar', async () => {
    const textAvatar = await getTextAvatarFromStore();

    setDefaultTextAvatar(textAvatar);
  });

  // system default as in what they had before changing any settings
  const resetToSystemDefault = () => {
    const systemDefault = getDefaultTextAvatar();

    formikRef.current!.setValues(systemDefault);

    updateTextAvatarCss(systemDefault);
  };

  const cancelAndClose = () => {
    updateTextAvatarCss(defaultTextAvatar);
    onHide();
  };

  const onHide = () => setShowModal(false);

  const handleSubmit: React.ComponentProps<typeof Formik<TextAvatar>>['onSubmit']
    = async (values, { resetForm }) => {
      const success = await updateTextAvatarStore(values);

      if (success) {
        setDefaultTextAvatar(values);

        toast.success('Saved.', {
          position: 'bottom-center',
        });
        onHide();
      } else { // shouldn't happen
        toast.error('Please try again', {
          position: 'bottom-center',
        });
      }

      resetForm({ values });
      updateTextAvatarCss(values);
    };

  return (
    <div>
      {/* TODO: on hover show like a pencil to signify that it's editable */}
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
          <Formik
            initialValues={{
              ...defaultTextAvatar,
            }}
            onSubmit={handleSubmit}
            onReset={() => {
              updateTextAvatarCss(defaultTextAvatar);
            }}
            validate={(values) => { // basically onChange
              updateTextAvatarCss(values);
            }}
            innerRef={formikRef}
            enableReinitialize
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
              isSubmitting,
            }) => {
              setIsSaving(isSubmitting);

              return (
                <Form
                  id="text-avatar-form"
                  onSubmit={handleSubmit}
                  onReset={handleReset}
                >
                  <Form.Group as={Row} controlId="avatar-bg">
                    <Form.Label column>Background colour</Form.Label>
                    <Form.Control
                      type="color"
                      name="avatar-bg"
                      value={values['avatar-bg']}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  <Form.Group as={Row} className="mt-1" controlId="avatar-fg">
                    <Form.Label column>Text colour</Form.Label>
                    <Form.Control
                      type="color"
                      name="avatar-fg"
                      value={values['avatar-fg']}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                </Form>
              );
            }}
          </Formik>
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
          <LoadingButton
            type="submit"
            form="text-avatar-form"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            loadingContent="Saving"
            style={{
              width: '5.7em',
            }}
          >
            Save
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
