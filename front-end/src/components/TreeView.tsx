import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useAccordionItemState,
} from "@chakra-ui/react";
import { Fragment, Suspense, useEffect, useState } from "react";

import DownCaret from "../assets/down-caret.svg";
import BlackPlusIcon from "../assets/black-plus-icon.svg";
import BlackOptionsIcon from "../assets/black-options-icon.svg";
import BlackDotIcon from "../assets/black-dot-icon.svg";
import { TreeData, useApp } from "../store/useApp";

type TreeItemActions = {
  getNote: (id) => any;
  createNote: (id) => any;
  clickNote: (id) => any;
  deleteNote: (id) => any;
};

const TreeItem = ({
  noteItem,
  localTreeItems,
  setLocalTreeItems,
  isExpanded,
  actions,
  index,
}) => {
  const { onOpen } = useAccordionItemState();
  const currentNote = useApp((state) => state.currentNote);
  const setCurrentTree = useApp((state) => state.setCurrentTree);
  const setTree = useApp((state) => state.setTree);
  const treeItems = useApp((state) => state.treeItems);

  // const setCurrentNote = useApp((state) => state.setCurrentNote);
  return (
    <Flex
      justifyContent="space-between"
      w="100%"
      bgColor={currentNote?.id === noteItem?.id ? "brand.50" : ""}
    >
      <AccordionButton
        onClick={async () => {
          // expose the current tree's state
          setCurrentTree(localTreeItems, setLocalTreeItems);
          const children = await actions.clickNote(noteItem.id);
          if (isExpanded) {
            return;
          }

          // update child notes on client side
          console.log(children);
          let updatedTreeItems = [
            ...localTreeItems.slice(0, index),
            {
              ...localTreeItems[index],
              childNotes: children.childNotes,
            },
            ...localTreeItems.slice(index + 1),
          ];
          setLocalTreeItems(updatedTreeItems);
        }}
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <AccordionIcon mr={3} />
          <Text>{noteItem?.title}</Text>
        </Flex>
      </AccordionButton>
      <Flex alignItems="center" mr={3}>
        <Menu>
          <MenuButton
            height="40px"
            width="40px"
            padding="7px"
            transition="all 0.2s"
            borderRadius="50%"
            // borderRadius='md'
            // borderWidth='1px'
            _hover={{ bg: "gray.100" }}
            _expanded={{ bg: "blue.100" }}
            // _focus={{ boxShadow: 'outline' }}
          >
            <img src={BlackOptionsIcon} alt="options" />
          </MenuButton>
          <MenuList>
            <MenuItem>Edit Note</MenuItem>
            <MenuItem>Rename Note</MenuItem>
            <MenuItem>Copy Link</MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() => {
                actions.deleteNote(noteItem?.id);
                if (!noteItem.parent) {
                  setTree([
                    ...treeItems.slice(0, index),
                    ...treeItems.slice(index + 1),
                  ]);
                } else
                  setLocalTreeItems([
                    ...localTreeItems.slice(0, index),
                    ...localTreeItems.slice(index + 1),
                  ]);
              }}
            >
              Delete Note
            </MenuItem>
          </MenuList>
        </Menu>
        <Tooltip label="Quickly add a note inside">
          <Button
            variant="ghost"
            style={{
              height: "40px",
              width: "40px",
              padding: "7px",
              borderRadius: "50%",
              marginLeft: "0.5em",
            }}
          >
            <img
              src={BlackPlusIcon}
              alt="plus icon"
              onClick={async () => {
                const response = await actions.getNote(noteItem.id);
                const newNote = await actions.createNote(noteItem.id);
                console.log(response);
                setLocalTreeItems([
                  ...localTreeItems.slice(0, index),
                  {
                    ...localTreeItems[index],
                    childNotes: [
                      ...response.childNotes,
                      { id: newNote.id, title: newNote.title },
                    ],
                  },
                  ...localTreeItems.slice(index + 1),
                ]);
                if (!isExpanded) onOpen();
              }}
            />
          </Button>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export const TreeView = ({
  data,
  actions,
}: {
  data: TreeData[];
  actions: TreeItemActions;
}) => {
  const [treeItems, setTreeItems] = useState(data);
  useEffect(() => {
    setTreeItems(data);
  }, [data]);

  return (
    <Accordion allowMultiple>
      {treeItems && treeItems.length
        ? treeItems.map((noteItem, index) => (
            <Fragment key={index}>
              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <TreeItem
                      noteItem={noteItem}
                      localTreeItems={treeItems}
                      setLocalTreeItems={setTreeItems}
                      isExpanded={isExpanded}
                      actions={actions}
                      index={index}
                    />
                    <AccordionPanel>
                      {noteItem.childNotes && noteItem.childNotes.length ? (
                        // <Suspense fallback={<Spinner />}>
                        <TreeView
                          data={noteItem.childNotes}
                          actions={actions}
                        />
                      ) : (
                        // </Suspense>
                        <Text ml={8} color="text.inactive">
                          No pages inside
                        </Text>
                      )}
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            </Fragment>
          ))
        : null}
    </Accordion>
  );
};
