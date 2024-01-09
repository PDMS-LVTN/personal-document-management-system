import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
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
import {TreeData, useApp } from "../store/useApp";

type TreeItemActions = {
  getNote: (id) => any;
  createNote: (id) => any;
  clickNote: (id) => any;
};

const TreeItem = ({
  noteItem,
  treeItems,
  setTreeItems,
  isExpanded,
  actions,
  index,
}) => {
  const { onOpen } = useAccordionItemState();
  const currentNote = useApp((state) => state.currentNote);
  const setCurrentTree = useApp((state) => state.setCurrentTree);
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
          setCurrentTree(treeItems, setTreeItems);
          const children = await actions.clickNote(noteItem.id);
          if (isExpanded) {
            return;
          }

          // update child notes on client side
          console.log("hello");
          console.log(children);
          let updatedTreeItems = [
            ...treeItems.slice(0, index),
            {
              ...treeItems[index],
              childNotes: children.childNotes,
            },
            ...treeItems.slice(index + 1),
          ];
          setTreeItems(updatedTreeItems);
        }}
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <AccordionIcon mr={3} />
          <Text>{noteItem?.title}</Text>
        </Flex>
      </AccordionButton>
      <Flex alignItems="center" gap={5} mr={5}>
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
          <img src={BlackOptionsIcon} alt="options" />
        </Button>
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
                console.log(newNote as TreeData);
                setTreeItems([
                  ...treeItems.slice(0, index),
                  {
                    ...treeItems[index],
                    childNotes: [
                      ...response.childNotes,
                      { id: newNote.id, title: newNote.title },
                    ],
                  },
                  ...treeItems.slice(index + 1),
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
                      treeItems={treeItems}
                      setTreeItems={setTreeItems}
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
