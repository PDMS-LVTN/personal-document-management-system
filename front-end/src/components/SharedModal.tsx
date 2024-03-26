import { Button, IconButton } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Text } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Tag, TagCloseButton, TagLabel } from "@chakra-ui/tag";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, Link } from "lucide-react";
import { ShareMode } from "@/lib/data/constant";
import { Spinner } from "@chakra-ui/spinner";

const SharedModal = ({ noteId, onClose, actions }) => {
  const [peopleWithAccess, setPeopleWithAccess] = useState([]);
  const [allowGeneralAccess, setAllowGeneralAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleCopyLink = (onClose) => {
    const text = `${import.meta.env.VITE_CLIENT_PATH}/note/${noteId}`;
    navigator.clipboard.writeText(text);
    onClose();
  };

  const removeCollaboratorPermission = async (email: string) => {
    actions.removeNoteCollaborator(noteId, email);
    setPeopleWithAccess(peopleWithAccess.filter((_email) => _email != email));
  };

  useEffect(() => {
    const loadData = async () => {
      const { emails, is_anyone } = await actions.findCollaboratorsOfNote(
        noteId
      );
      setPeopleWithAccess(emails);
      setAllowGeneralAccess(is_anyone);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const generalAccessMode = (x) => {
    return x ? "Anyone with the link" : "Restricted";
  };

  const ref = useRef(null);

  if (isLoading) return <Spinner margin="auto" />;
  return (
    <>
      <div className="flex gap-3">
        <Input
          //   value={value}
          //   onChange={(e) => setValue(e.target.value)}
          ref={ref}
          placeholder="Add people to send the link to"
          size="md"
          onKeyDown={async (e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
              actions.addCollaborator(
                noteId,
                ref.current.value,
                ShareMode.VIEW
              );
              setPeopleWithAccess([...peopleWithAccess, ref.current.value]);
              ref.current.value = "";
            }
          }}
        />
        <IconButton
          isRound={true}
          colorScheme="brand"
          aria-label="Copy link"
          icon={<Link />}
          onClick={() => handleCopyLink(onClose)}
        />
      </div>
      <Text fontSize="md" fontWeight="bold" mt={3}>
        People with access
      </Text>
      {!peopleWithAccess.length && (
        <Text mt={2} color="text.inactive">
          Your document is not shared with anyone
        </Text>
      )}
      {peopleWithAccess.map((email, id) => {
        return (
          <div key={id} className="flex justify-start mt-3">
            <div className="flex items-center gap-3">
              <img
                className="w-8 h-8 border border-white rounded-full"
                src="/placeholder-image.jpg"
                alt=""
              />
              <Text>{email}</Text>
            </div>
            <div className="ml-auto">
              {/* <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {person.permission}
              </MenuButton>
              <MenuList>
                {permissions
                  .filter((item) => item != person.permission)
                  .map((item, id) => {
                    return <MenuItem key={id}>{item}</MenuItem>;
                  })}
              </MenuList>
            </Menu> */}
              <Tag
                size={"lg"}
                borderRadius="full"
                variant="solid"
                colorScheme="brand"
              >
                <TagLabel>Viewer</TagLabel>
                <TagCloseButton
                  onClick={() => removeCollaboratorPermission(email)}
                />
              </Tag>
            </div>
          </div>
        );
      })}
      <Text fontSize="md" fontWeight="bold" mt={5}>
        General access
      </Text>
      <div className="flex justify-start mt-3 items-center">
        <div className="flex items-center gap-3">
          <img
            className="w-8 h-8 border border-white rounded-full"
            src="\placeholder-image.jpg"
            alt=""
          />
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {generalAccessMode(allowGeneralAccess)}
            </MenuButton>
            <MenuList>
              {/* {generalPermisions
                .filter((item) => item != fakeGeneralPermissions.mode)
                .map((item, id) => {
                  return ;
                })} */}
              <MenuItem
                onClick={async () => {
                  actions.updateGeneralPermission(noteId, !allowGeneralAccess);
                  setAllowGeneralAccess(!allowGeneralAccess);
                }}
              >
                {generalAccessMode(!allowGeneralAccess)}
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        {allowGeneralAccess ? (
          <div className="ml-auto">
            {/* <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {fakeGeneralPermissions.permission}
            </MenuButton>
            <MenuList>
              {permissions
                .filter(
                  (item) => item != fakeGeneralPermissions.permission
                )
                .map((item, id) => {
                  return <MenuItem key={id}>{item}</MenuItem>;
                })}
            </MenuList>
          </Menu> */}
            <Tag
              size={"lg"}
              borderRadius="full"
              variant="solid"
              colorScheme="brand"
            >
              <TagLabel>Viewer</TagLabel>
            </Tag>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SharedModal;
