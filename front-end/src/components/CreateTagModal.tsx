import {
  Button,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTags } from "../hooks/useTags";
import { useApp } from "../store/useApp";

const CreateTagModal = ({ onClose }) => {
  const [tagName, setTagName] = useState("");
  const { createTag } = useTags();
  const allTags = useApp((state) => state.allTags);
  const setAllTags = useApp((state) => state.setAllTags);
  const toast = useToast();

  return (
    <ModalContent>
      <ModalHeader>Create a new tag</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text mb={5} color="text.inactive">
          Tags let you add keywords to notes, making them easier to find and
          browse.
        </Text>
        <Text ml={1} fontSize="sm" mb={1}>
          Name
        </Text>
        <Input
          value={tagName}
          onChange={(e) => {
            setTagName(e.target.value);
          }}
          placeholder="Tag name"
          size="md"
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose} size={'sm'} mr={3}>
          Cancel
        </Button>
        <Button
          colorScheme="brand"
          size={'sm'}
          onClick={async () => {
            if (!tagName) {
              toast({
                title: `Tag name cannot be empty`,
                status: "error",
                isClosable: true,
              });
              return;
            }
            const { responseData, responseError } = await createTag(
              tagName,
              null
            );
            if (responseError) {
              toast({
                title: `Some error happened! 😢`,
                status: "error",
                isClosable: true,
              });
            } else {
              toast({
                title: `Your tag is created`,
                status: "success",
                isClosable: true,
              });
              setAllTags([
                ...allTags,
                { id: responseData.id, value: tagName, label: tagName },
              ]);
            }
            onClose();
          }}
        >
          Create
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default CreateTagModal;
