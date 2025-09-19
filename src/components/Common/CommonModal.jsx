import { Button, Modal } from 'react-bootstrap';

const CommonModal = ({ open, setOpen, children, onClose }) => {
  return (
    <Modal
      className="fade"
      show={open}
      onHide={onClose}
      centered={true}
      size={'xl'}
      backdropClassName={'role'}
      backdrop={'static'}
    >
      <Modal.Header>
        <Modal.Title>Add New Visit</Modal.Title>
        <Button variant="" className="btn-close" onClick={onClose}></Button>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default CommonModal;
