import "./Modal.css";

const Modal = ({ children, isOpen, closeModal }) => {
  const handleModalContainerClick = (e) => {
    e.stopPropagation();
  };
  let clickTargetID = null;

  const handleOnMouseDown = (e) => {
    e.stopPropagation();
    clickTargetID = e.target.id;
  };

  const handleOnMouseUp = (e) => {
    e.stopPropagation();
    if (e.target.id === clickTargetID && clickTargetID === "modal-article") {
      closeModal();
    }
    clickTargetID = null;
  };

  return (
    <article
      className={`modal${isOpen ? " is-open" : ""}`}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      id="modal-article"
    >
      <div
        className={`modal-container ${isOpen && "component-fadeIn"}`}
        onClick={handleModalContainerClick}
      >
        {children}
      </div>
    </article>
  );
};

export default Modal;
