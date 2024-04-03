import useNotes from "@/hooks/useNotes";
import { Note, useApp } from "@/store/useApp";
import { Button } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";

const SharedNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { actions } = useNotes();
  const currentNote = useApp((state) => state.currentNote);
  const { permission } = useOutletContext();
  const { noteId } = useParams();

  useEffect(() => {
    const loadData = async () => {
      const notesData: Note[] = await actions.getAllSharedNotes();
      setNotes(notesData);
    };
    loadData();
  }, []);

  useEffect(() => {
    // TODO: set correct editor editable and currentnote
    // remember to set the currentnote truoc => tao editor => window.editor.setOptions({ editable: false });
    console.log(window.editor);
    console.log("hello");
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      <Flex justify="space-between" mb="1em" pl="2em" pr="2em" id="notes">
        <Text fontSize="2xl" fontWeight="600">
          Shared with me
        </Text>
      </Flex>

      <div className="mt-4">
        {notes && notes.length ? (
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
                  // actions.clickANoteHandler(note.id);
                  // TODO: click shared note?
                  navigate(`${currentNote?.id}`);
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
            Items shared with me
          </Text>
        )}
      </div>
    </div>
  );
};

export default SharedNotes;
