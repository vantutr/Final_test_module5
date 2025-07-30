import { Modal, Button } from "react-bootstrap";

const DeleteConfirmationModal = ({ show, onHide, onConfirm, productName }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận Xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn xóa sản phẩm <strong>"{productName}"</strong>{" "}
        không? Hành động này không thể hoàn tác.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
