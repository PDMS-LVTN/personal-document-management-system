import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";

function ConfirmModal({ modalTitle, config, isOpen, confirmDelete, close, action }) {
  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to {action} "{config || ""}"?</Text>
          <Text>It will be deleted forever.</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              close();
              confirmDelete();
            }}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </Button>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmModal;
