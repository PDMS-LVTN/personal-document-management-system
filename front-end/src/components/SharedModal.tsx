import { Button, IconButton } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Text } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Tag, TagCloseButton, TagLabel } from "@chakra-ui/tag";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, Link } from "lucide-react";
import { ShareMode } from "@/lib/data/constant";
import { Spinner } from "@chakra-ui/spinner";
import { HiUserCircle } from "react-icons/hi";
import {
  Table,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";

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
          size="sm"
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
          icon={<Link size="16px" />}
          size={"sm"}
          onClick={() => handleCopyLink(onClose)}
        />
      </div>
      <Text fontSize="16px" fontWeight="600" mt={3}>
        People with access
      </Text>
      {!peopleWithAccess.length && (
        <Text mt={2} color="text.inactive" fontSize="13px">
          Your document is not shared with anyone
        </Text>
      )}
      <Table mt={3} size="sm" variant="striped" colorScheme="gray">
        <Tbody>
          {peopleWithAccess.map((email, id) => {
            return (
              // <div key={id} className="flex justify-start mt-3">
              <Tr key={id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <HiUserCircle size="40px" color="var(--brand500)" backgroundColor="white"/>
                    <Text fontSize="13px">{email}</Text>
                  </div>
                </Td>
                <Td>
                  <div className="ml-auto" style={{ textAlign: "end" }}>
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
                      size={"md"}
                      borderRadius="6px"
                      variant="solid"
                      colorScheme="brand"
                    >
                      <TagLabel fontSize="12px" fontWeight="300">
                        Viewer
                      </TagLabel>
                      <TagCloseButton
                        onClick={() => removeCollaboratorPermission(email)}
                      />
                    </Tag>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Text fontSize="md" fontWeight="600" mt={7}>
        General access
      </Text>
      <div className="flex justify-start mt-3 items-center" style={{paddingLeft: "16px", paddingRight: "16px"}}>
        <div className="flex items-center gap-3">
        <HiUserCircle size="40px" color="var(--brand500)"/>
          <Menu>
            <MenuButton
              width="14rem"
              fontSize="13px"
              as={Button}
              rightIcon={<ChevronDownIcon size="16px" />}
            >
              {generalAccessMode(allowGeneralAccess)}
            </MenuButton>
            <MenuList>
              {/* {generalPermisions
                .filter((item) => item != fakeGeneralPermissions.mode)
                .map((item, id) => {
                  return ;
                })} */}
              <MenuItem
                fontSize="13px"
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
              size={"md"}
              borderRadius="6px"
              variant="solid"
              colorScheme="brand"
              px={5}
            >
              <TagLabel fontSize="12px" fontWeight="300">
                Viewer
              </TagLabel>
            </Tag>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SharedModal;
