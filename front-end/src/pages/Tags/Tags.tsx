import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import SearchTag from "./SearchTag";
import CreateTagModal from "../../components/CreateTagModal";
import PlusIcon from "../../assets/plus-icon.svg";


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
            <button
              style={{
                height: "32px",
                width: "32px",
                padding: "10px",
                borderRadius: "100%",
                background: "var(--brand400)",
              }}
              onClick={onOpen}
            >
              <img src={PlusIcon} alt="create" />
            </button>
          </Tooltip>
        </Flex>
      </Flex>
      <SearchTag renderResults={renderResults} />
    </>
  );
};
