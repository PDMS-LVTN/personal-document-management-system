import useNotes from "@/hooks/useNotes";
import { useApp } from "@/store/useApp";
import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { Eye, PencilLine, Tag } from "lucide-react";
import { AiFillFile } from "react-icons/ai";

export const SharedNotesList = ({ data }) => {
  if (!data) return null;
  const currentNote = useApp((state) => state.currentNote);
  const { actions } = useNotes();
  return (
    <>
      <Tabs size="md" variant="enclosed">
        <TabList>
          <Tab fontSize={14}>Direct</Tab>
          <Tab fontSize={14}>Public access</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            {data.private_notes.length ? (
              data.private_notes.map((note) => {
                return (
                  <Button
                    fontSize={"14px"}
                    key={note.note_id}
                    variant="ghost"
                    borderRadius={0}
                    w="100%"
                    pt={3}
                    pb={3}
                    borderColor="gray.200"
                    display="flex"
                    justifyContent="space-between"
                    height="40px"
                    bgColor={currentNote?.id === note.note_id ? "brand.50" : ""}
                    onClick={() => {
                      actions.clickANoteHandler(note.note_id);
                    }}
                  >
                    <div className="flex w-4/5 justify-start">
                      <span className="mr-3">
                        <AiFillFile color="var(--brand300)" size="20px" />
                      </span>
                      <Text fontWeight="light" className="line-clamp-1">
                        {note.title}
                      </Text>
                    </div>
                    {note.share_mode == "view" ? (
                      <Eye color="var(--brand300)" size="20px" />
                    ) : (
                      <PencilLine color="var(--brand300)" size="20px" />
                    )}
                  </Button>
                );
              })
            ) : (
              <Text color="text.inactive">You don't have any notes</Text>
            )}
          </TabPanel>
          <TabPanel>
            {data.public_notes.length ? (
              data.public_notes.map((note) => {
                return (
                  <Button
                    fontSize={"14px"}
                    key={note.note_id}
                    variant="ghost"
                    borderRadius={0}
                    w="100%"
                    pt={3}
                    pb={3}
                    borderColor="gray.200"
                    display="flex"
                    justifyContent="space-between"
                    height="40px"
                    bgColor={currentNote?.id === note.note_id ? "brand.50" : ""}
                    onClick={() => {
                      actions.clickANoteHandler(note.note_id);
                    }}
                  >
                    <div className="flex w-4/5 justify-start">
                      <span className="mr-3">
                        <AiFillFile color="var(--brand300)" size="20px" />
                      </span>
                      <Text fontWeight="light" className="line-clamp-1">
                        {note.title}
                      </Text>
                    </div>
                    {note.share_mode == "view" ? (
                      <Eye color="var(--brand300)" size="20px" />
                    ) : (
                      <PencilLine color="var(--brand300)" size="20px" />
                    )}
                  </Button>
                );
              })
            ) : (
              <Text color="text.inactive">You don't have any notes</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
