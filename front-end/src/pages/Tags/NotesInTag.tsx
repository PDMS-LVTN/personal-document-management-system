import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { IoMdPricetag } from "react-icons/io";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { useTags } from "../../hooks/useTags";
import useNotes from "../../hooks/useNotes";
import { ContextType } from "../../layouts/TreeAndEditorContainer";
import { useApp } from "../../store/useApp";

interface TagData {
  id: string;
  description: string;
  user_id: string;
  notes: any[];
}

const NotesInTag = () => {
  const { tagId } = useParams();
  const currentTags = useApp((state) => state.currentTags);
  const currentNote = useApp((state) => state.currentNote);
  const navigate = useNavigate();
  const { getNotesInTag } = useTags();
  const [data, setData] = useState<TagData>(null);
  const { ref } = useOutletContext<ContextType>();
  const { actions } = useNotes(ref);

  const fetchData = async () => {
    const { responseData } = await getNotesInTag(tagId);
    console.log("notes in tag", responseData);
    setData(responseData);
  };

  useEffect(() => {
    fetchData();
  }, [tagId, currentTags]);

  // delete note
  useEffect(() => {
    if (!currentNote) {
      fetchData();
    }
  }, [currentNote]);

  return (
    <>
      <Flex
        justify="space-between"
        mb="1em"
        pl="2em"
        pr="2em"
        gap={2}
        id="notes"
      >
        <Flex alignItems="center" gap={3}>
          <IoMdPricetag size={25} color="#7540EE" />
          <Text fontSize="2xl" fontWeight="600">
            {data?.description}
          </Text>
        </Flex>
        <IconButton
          isRound
          aria-label="Go back"
          icon={<FaArrowLeftLong />}
          onClick={() =>
            navigate("/tags", { replace: true, state: { isGoBack: true } })
          }
        />
      </Flex>
      {data?.notes && data.notes?.length ? (
        data.notes.map((item, idx) => {
          return (
            <Button
              variant="ghost"
              bgColor={currentNote?.id === item?.id ? "brand.50" : ""}
              key={idx}
              borderRadius={0}
              w="100%"
              pt={3}
              pb={3}
              borderTop={idx == 0 ? "1px" : "0px"}
              borderBottom="1px"
              borderColor="gray.200"
              display="flex"
              justifyContent="flex-start"
              height="fit-content"
              gap={2}
              onClick={() => {
                actions.clickANoteHandler(item.id);
                //   setNotes([
                //     ...notes.slice(0, idx),
                //     {
                //       ...notes[idx],
                //       title: currentNote?.title,
                //     },
                //     ...notes.slice(idx + 1),
                //   ]);
              }}
            >
              <Text fontWeight="normal">
                {currentNote?.id === item?.id ? currentNote.title : item.title}
              </Text>
            </Button>
          );
        })
      ) : (
        <Text ml={10} color="text.inactive">
          No notes found
        </Text>
      )}
    </>
  );
};

export default NotesInTag;
