import { Button, IconButton } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
} from "@chakra-ui/menu";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, Link } from "lucide-react";
import { ShareMode } from "@/lib/data/constant";
import { Spinner } from "@chakra-ui/spinner";
import { HiUserCircle } from "react-icons/hi";
import { Table, Tbody, Td, Tr } from "@chakra-ui/react";

const SharedModal = ({ noteId, onClose, actions }) => {
  const [peopleWithAccess, setPeopleWithAccess] = useState([]);
  const [generalAccess, setGeneralAccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const permissions = ["View", "Edit"];

  const handleCopyLink = (onClose) => {
    const text = `${
      import.meta.env.VITE_CLIENT_PATH
    }/note/${noteId}/shared/public`;
    navigator.clipboard.writeText(text);
    onClose();
  };
  const getMode = (share_mode: string) => {
    if (share_mode === "view") {
      return ShareMode.VIEW;
    } else if (share_mode === "edit") return ShareMode.EDIT;
  };

  const removeCollaboratorPermission = async (email: string) => {
    actions.removeNoteCollaborator(noteId, email);
    setPeopleWithAccess(
      peopleWithAccess.filter((person) => person.email != email)
    );
  };

  const updatePermission = async (email: string, share_mode: ShareMode) => {
    actions.updateCollaboratorPermission(noteId, email, share_mode);
    setPeopleWithAccess(
      peopleWithAccess.map((person) =>
        person.email === email ? { ...person, share_mode } : person
      )
    );
  };

  useEffect(() => {
    const loadData = async () => {
      const { collaborators, is_anyone } =
        await actions.findCollaboratorsOfNote(noteId);
      setPeopleWithAccess(collaborators);
      setGeneralAccess(is_anyone);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const generalAccessMode = (x) => {
    return x ? "Anyone with the link" : "Restricted";
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const ref = useRef(null);

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <div className="flex gap-3">
        <Input
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
              setPeopleWithAccess([
                ...peopleWithAccess,
                { email: ref.current.value, share_mode: ShareMode.VIEW },
              ]);
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
          {peopleWithAccess.map((person, id) => {
            return (
              <Tr key={id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <HiUserCircle size="40px" color="var(--brand400)" />
                    <Text fontSize="13px">{person.email}</Text>
                  </div>
                </Td>
                <Td>
                  <div className="ml-auto" style={{ textAlign: "end" }}>
                    <Menu>
                      <MenuButton
                        fontSize="13px"
                        as={Button}
                        rightIcon={<ChevronDownIcon size="16px" />}
                      >
                        {capitalizeFirstLetter(person.share_mode)}
                      </MenuButton>
                      <MenuList w={"2em"}>
                        {permissions
                          .filter(
                            (item) => item.toLowerCase() != person.share_mode
                          )
                          .map((item, id) => {
                            return (
                              <MenuItem
                                fontSize="13px"
                                key={id}
                                onClick={() =>
                                  updatePermission(
                                    person.email,
                                    getMode(item.toLowerCase())
                                  )
                                }
                              >
                                {item}
                              </MenuItem>
                            );
                          })}
                        <MenuDivider />
                        <MenuItem
                          fontSize="13px"
                          onClick={() =>
                            removeCollaboratorPermission(person.email)
                          }
                        >
                          Remove access
                        </MenuItem>
                      </MenuList>
                    </Menu>
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
      <div
        className="flex justify-start mt-3 items-center"
        style={{ paddingLeft: "16px", paddingRight: "16px" }}
      >
        <div className="flex items-center gap-3">
          <HiUserCircle size="40px" color="var(--brand500)" />
          <Menu>
            <MenuButton
              width="14rem"
              fontSize="13px"
              as={Button}
              rightIcon={<ChevronDownIcon size="16px" />}
            >
              {generalAccessMode(generalAccess)}
            </MenuButton>
            <MenuList>
              {generalAccess ? (
                <MenuItem
                  fontSize="13px"
                  onClick={async () => {
                    actions.updateGeneralPermission(noteId, null);
                    setGeneralAccess(null);
                  }}
                >
                  {generalAccessMode(!generalAccess)}
                </MenuItem>
              ) : (
                <MenuItem
                  fontSize="13px"
                  onClick={async () => {
                    actions.updateGeneralPermission(noteId, ShareMode.VIEW);
                    setGeneralAccess(ShareMode.VIEW);
                  }}
                >
                  {generalAccessMode(!generalAccess)}
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </div>
        {generalAccess ? (
          <div className="ml-auto">
            <Menu>
              <MenuButton
                fontSize="13px"
                as={Button}
                rightIcon={<ChevronDownIcon size="16px" />}
              >
                {capitalizeFirstLetter(generalAccess)}
              </MenuButton>
              {/* TODO: disabled button */}
              <MenuList>
                {permissions
                  .filter((item) => item.toLowerCase() != generalAccess)
                  .map((item, id) => {
                    return (
                      <MenuItem
                        fontSize="13px"
                        key={id}
                        onClick={() => {
                          actions.updateGeneralPermission(
                            noteId,
                            getMode(item.toLowerCase())
                          );
                          setGeneralAccess(item);
                        }}
                      >
                        {item}
                      </MenuItem>
                    );
                  })}
              </MenuList>
            </Menu>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SharedModal;
