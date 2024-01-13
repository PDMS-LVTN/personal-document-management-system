import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
// import { useTags } from "../../hooks/useTags";
import { FaPlus } from "react-icons/fa";
// import { useApp } from "../../store/useApp";
import SearchTag from "./SearchTag";
import CreateTagModal from "../../components/CreateTagModal";

// BUG: tags are duplicated => create a relation also create a new tag
export const Tags = ({ renderResults }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <CreateTagModal onClose={onClose} />
      </Modal>
      <Flex justify="space-between" mb="1em" pl="2em" pr="2em" id="notes">
        <Text fontSize="2xl" fontWeight="600">
          Tags
        </Text>
        <Flex gap={3}>
          <Tooltip label="Create a tag">
            <Button
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
                background: "var(--brand400)",
              }}
              onClick={onOpen}
            >
              <FaPlus color="white" />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
      <SearchTag renderResults={renderResults} />
    </>
  );
};
