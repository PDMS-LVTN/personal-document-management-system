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
  deleteNote: (id) => any;
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
                        {/* <img src={BlackOptionsIcon} alt="options" /> */}
                        <Menu>
                          <MenuButton
                            height =  '40px'
                            width = '40px'
                            padding = '7px'
                            transition='all 0.2s'
                            borderRadius= '50%'
                            // borderRadius='md'
                            // borderWidth='1px'
                            _hover={{ bg: 'gray.100' }}
                            _expanded={{ bg: 'blue.100' }}
                            // _focus={{ boxShadow: 'outline' }}
                          >
                            <img src={BlackOptionsIcon} alt="options" />
                          </MenuButton>
                          <MenuList>
                            <MenuItem>Edit Note</MenuItem>
                            <MenuItem>
                            Rename Note
                            </MenuItem>
                            <MenuItem>Copy Link</MenuItem>
                            <MenuDivider />
                            <MenuItem
                              onClick={() => actions.deleteNote(noteItem?.id)}
                            >
                              Delete Note
                            </MenuItem>
                          </MenuList>
                        </Menu>
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



// {notes.length > 0 ? (
//   notes.map((noteItem) => {
//     return (
//       <Suspense key={noteItem?.id} fallback={<Skeleton />}>
//         <Flex
//           justify="space-between"
//           bgColor={currentNote?.id === noteItem?.id ? "brand.50" : ""}
//           className="note"
//           pl="2em"
//           pr="2em"
//         >
//           <Flex alignItems="center">
//             <Button
//               variant="ghost"
//               mr="0.5em"
//               style={{
//                 height: "40px",
//                 width: "40px",
//                 padding: "7px",
//                 borderRadius: "50%",
//               }}
//             >
//               <img src={DownCaret} alt="down-caret" />
//             </Button>
//             <Button
//               ml="-1em"
//               variant="ghost"
//               onClick={() => handler.clickANoteHandler(noteItem?.id)}
//             >
//               {noteItem?.title}
//             </Button>
//           </Flex>
//           <div
//           style={
//             {display: 'flex',
//             justifyContent: 'space-between'}
//           }>
//             <Menu>
//               <MenuButton
//                 height =  '40px'
//                 width = '40px'
//                 padding = '7px'
//                 transition='all 0.2s'
//                 borderRadius= '50%'
//                 // borderRadius='md'
//                 // borderWidth='1px'
//                 _hover={{ bg: 'gray.100' }}
//                 _expanded={{ bg: 'blue.100' }}
//                 // _focus={{ boxShadow: 'outline' }}
//               >
//                 <img src={BlackOptionsIcon} alt="options" />
//               </MenuButton>
//               <MenuList>
//                 <MenuItem>Edit Note</MenuItem>
//                 <MenuItem>
//                 Rename Note
//                 </MenuItem>
//                 <MenuItem>Copy Link</MenuItem>
//                 <MenuDivider />
//                 <MenuItem
//                   onClick={() => handler.deleteNote(noteItem?.id)}
//                 >
//                   Delete Note
//                 </MenuItem>
//               </MenuList>
//             </Menu>
            
//             <Button
//               variant="ghost"
//               style={{
//                 height: "40px",
//                 width: "40px",
//                 padding: "7px",
//                 borderRadius: "50%",
//                 marginLeft: '0.5em'
//               }}
//               onClick={() => handler.createNote(noteItem?.id)}
//             >
//               <img src={BlackPlusIcon} alt="plus icon" />
//             </Button>
//           </div>
//         </Flex>
//       </Suspense>
//     );
//   })