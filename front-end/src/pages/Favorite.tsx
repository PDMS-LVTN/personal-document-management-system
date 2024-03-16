import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
// import { TreeView } from "../components/TreeView";
// import { useApp } from "../store/useApp";
// import { useOutletContext } from "react-router-dom";
// import { ContextType } from "../layouts/TreeAndEditorContainer";
import { useFavorite } from "../hooks/useFavorite";
// import { useTree } from "@/hooks/useTree";
import { Note, useApp } from "@/store/useApp";
// import { Tree, TreeApi } from "react-arborist";
import useNotes from "@/hooks/useNotes";
// import Node from "./Notes/Node";
import { IoSearch } from "react-icons/io5";

function Favorite() {
  // const { ref } = useOutletContext<ContextType>();
  // const treeRef = useRef<TreeApi<Note>>(null);
  const { getFavoriteNotes } = useFavorite();
  const { actions } = useNotes();
  const [notes, setNotes] = useState<Note[]>([]);
  const currentNote = useApp((state) => state.currentNote);
  // const [data, controller] = useTree(notes, { getFavoriteNotes });
  const [term, setTerm] = useState("");

  const fetchData = async () => {
    const responseData = await getFavoriteNotes();
    setNotes(responseData);
  };

  useEffect(() => {
    // let isMounted = true;
    // const controller = new AbortController();
    // const loadData = async () => {
    //   const notes = await getFavoriteNotes(controller);
    //   if (isMounted) {
    //     console.log(notes);
    //     setNotes(notes);
    //   }
    // };
    fetchData();

    // return () => {
    //   isMounted = false;
    //   isMounted && controller.abort();
    // };
  }, [currentNote]);

  // useEffect(() => {
  //   if (!currentNote) {
  //     fetchData();
  //   }
  // }, [currentNote]);

  // const handleActivate = async (e) => {
  //   const focusedNode = treeRef.current.focusedNode;
  //   const id = focusedNode?.id;
  //   console.log(id);
  //   if (id) await actions.clickANoteHandler(focusedNode.id);
  // };

  return (
    <>
      <Flex justify="space-between" mb="1em" pl="2em" pr="2em" id="notes">
        <Text fontSize="2xl" fontWeight="600">
          Favorites
        </Text>
      </Flex>
      {/* {treeItems && treeItems.length > 0 ? (
        <Suspense fallback={<Skeleton />}>
          <TreeView data={treeItems} editorRef={ref} />
        </Suspense>
      ) : ( */}
      <InputGroup pl="2em" pr="2em" w="100%">
        <InputLeftElement pointerEvents="none" ml="2em">
          <IoSearch size="24px" color="var(--brand400)" />
        </InputLeftElement>
        <Input
          m={0}
          type="text"
          placeholder="Search..."
          className="search-input"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </InputGroup>
      <div className="mt-4">
        {notes && notes.length ? (
          // <Tree
          //   data={data}
          //   ref={treeRef}
          //   {...controller}
          //   openByDefault={false}
          //   width="100%"
          //   indent={24}
          //   rowHeight={40}
          //   overscanCount={1}
          //   paddingTop={30}
          //   paddingBottom={10}
          //   padding={25 /* sets both */}
          //   searchTerm={term}
          //   searchMatch={(node, term) =>
          //     node.data.title.toLowerCase().includes(term.toLowerCase())
          //   }
          //   childrenAccessor={(d) => d.childNotes}
          //   onActivate={handleActivate}
          // >
          //   {Node}
          // </Tree>
          notes.map((note, idx) => {
            return (
              <Button
                key={idx}
                variant="ghost"
                borderRadius={0}
                w="100%"
                pt={3}
                pb={3}
                pl="2em"
                pr="2em"
                borderTop={idx == 0 ? "1px" : "0px"}
                borderBottom="1px"
                borderColor="gray.200"
                display="flex"
                justifyContent="flex-start"
                height="40px"
                bgColor={currentNote?.id === note?.id ? "brand.50" : ""}
                onClick={() => {
                  actions.clickANoteHandler(note.id);
                }}
              >
                <Text fontWeight="normal">
                  {currentNote?.id === note?.id
                    ? currentNote.title
                    : note.title}
                </Text>
              </Button>
            );
          })
        ) : (
          <Text pl="2em" pr="2em" color="text.inactive">
            Pick your favorite notes
          </Text>
        )}
      </div>
    </>
  );
}

export default Favorite;
