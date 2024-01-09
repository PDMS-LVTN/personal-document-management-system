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
} from "@chakra-ui/react";
import { Fragment, Suspense, useState } from "react";

import DownCaret from "../assets/down-caret.svg";
import BlackPlusIcon from "../assets/black-plus-icon.svg";
import BlackOptionsIcon from "../assets/black-options-icon.svg";
import BlackDotIcon from "../assets/black-dot-icon.svg";
import { Note, TreeData, useApp } from "../store/useApp";

type TreeItemActions = {
  getNote: (id) => any;
  createNote: (id) => any;
  clickNote: (id) => any;
};

export const TreeView = ({
  data,
  actions,
}: {
  data: TreeData[];
  actions: TreeItemActions;
}) => {
  const currentNote = useApp((state) => state.currentNote);
  const setCurrentTree = useApp((state) => state.setCurrentTree);
  const setCurrentNote = useApp((state) => state.setCurrentNote);
  // const setTopLevel = useApp((state) => state.setTopLevel);

  const [treeItems, setTreeItems] = useState(data);
  // setTopLevel(treeItems, setTreeItems);

  return (
    <Accordion allowMultiple>
      {treeItems && treeItems.length
        ? treeItems.map((noteItem, index) => (
            <Fragment key={index}>
              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      onClick={async () => {
                        // expose the current tree's state
                        setCurrentTree(treeItems, setTreeItems);

                        if (isExpanded) {
                          // setCurrentNote(noteItem as Note);
                          return;
                        }
                        const children = await actions.clickNote(noteItem.id);

                        // update child notes on client side
                        // if (
                        //   !(noteItem.childNotes && noteItem.childNotes.length)
                        // ) {
                        console.log("hello");
                        let updatedTreeItems = [
                          ...treeItems.slice(0, index),
                          {
                            ...treeItems[index],
                            childNotes: children.childNotes,
                          },
                          ...treeItems.slice(index + 1),
                        ];
                        setTreeItems(updatedTreeItems);
                        // }
                      }}
                      bgColor={
                        currentNote?.id === noteItem?.id ? "brand.50" : ""
                      }
                      justifyContent="space-between"
                    >
                      <Flex alignItems="center">
                        <AccordionIcon mr={3} />
                        <Text>{noteItem?.title}</Text>
                      </Flex>
                      <Flex alignItems="center" gap={5}>
                        <img src={BlackOptionsIcon} alt="options" />
                        <Tooltip label="Quickly add a note inside">
                          <img
                            src={BlackPlusIcon}
                            alt="plus icon"
                            onClick={async () => {
                              const response = await actions.createNote(
                                noteItem.id
                              );
                              setTreeItems([
                                ...treeItems,
                                {
                                  title: response.data.title,
                                  id: response.data.id,
                                  childNotes: [],
                                },
                              ]);
                            }}
                          />
                        </Tooltip>
                      </Flex>
                    </AccordionButton>

                    <Suspense fallback={<Spinner />}>
                      <AccordionPanel>
                        {noteItem.childNotes && noteItem.childNotes.length ? (
                          <TreeView
                            data={noteItem.childNotes}
                            actions={actions}
                          />
                        ) : (
                          <Text ml={8} color="text.inactive">
                            No pages inside
                          </Text>
                        )}
                      </AccordionPanel>
                    </Suspense>
                  </>
                )}
              </AccordionItem>
            </Fragment>
          ))
        : null}
    </Accordion>
  );
};
