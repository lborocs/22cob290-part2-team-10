import { useState } from "react";
import Modal from "./Modal";
import Backdrop from "./Backdrop";
function Todo(props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  function deleteHandler() {
    setModalIsOpen(true);
  }

  function closeModuleHandler() {
    setModalIsOpen(false);
  }

  return (
    //{} allows you to use javascript code in html, props.text allows different text for the same component
    <div className="card">
      <h2>{props.text}</h2>
      <div className="actions">
        <button className="btn" onClick={deleteHandler}>
          Delete
        </button>
      </div>

      {modalIsOpen && (
        <Modal onCancel={closeModuleHandler} onConfirm={closeModuleHandler} />
      )}
      {modalIsOpen && <Backdrop onClick={closeModuleHandler} />}
    </div>
  );
}

export default Todo;
