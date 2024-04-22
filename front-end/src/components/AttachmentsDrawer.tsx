import Links from "@/editor/components/InternalLinks/Links";
import { useInternalLinks } from "@/hooks/useInternalLinks";
import { useApp } from "@/store/useApp";
import { Text, Tooltip } from "@chakra-ui/react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { Files, Images } from "lucide-react";
import { useState, useEffect } from "react";
import { FileInput, FileOutput } from "lucide-react";

type SubType = {
  path: string;
};

type AttachmentsType = {
  images: SubType[];
  files: SubType[];
};

const AttachmentsDrawer = ({ actions }) => {
  const [attachments, setAttachments] = useState<AttachmentsType>({
    images: [],
    files: [],
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [backlinks, setBacklinks] = useState([]);
  const [headlinks, setHeadlinks] = useState([]);
  const { getHeadlinks, getBacklinks } = useInternalLinks();
  const currentNote = useApp((state) => state.currentNote);
  const [id] = useState(currentNote.id);
  const [title] = useState(currentNote.title);

  const renderMedia = () => {
    if (!attachments.images.length)
      return (
        <span className="block text-gray-400 text-xs">No images found</span>
      );
    return (
      <div className="flex flex-wrap">
        {attachments.images.map((item, id) => {
          return (
            <img
              key={id}
              src={`${import.meta.env.VITE_SERVER_PATH}/${item.path}`}
              alt=""
              className="flex-1 w-2/6"
            />
          );
        })}
      </div>
    );
  };
  const renderFiles = () => {
    return (
      <>
        {attachments.files.length ? (
          attachments.files.map((item, id) => {
            return <div key={id}>{item.path}</div>;
          })
        ) : (
          <span className="block text-gray-400 text-xs">No files found</span>
        )}
      </>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      const res = await actions.getAttachments(id);
      setAttachments(res);
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadData = async (func, set) => {
      const { responseData } = await func(id, title);
      set(responseData);
    };
    if (tabIndex === 0 || tabIndex === 1) return;
    // const data = {
    //   noteId: currentNote.id,
    //   title: currentNote.title,
    // };
    if (tabIndex === 2) {
      loadData(getBacklinks, setBacklinks);
    } else if (tabIndex === 3) {
      loadData(getHeadlinks, setHeadlinks);
    }
  }, [tabIndex]);

  return (
    // BUG: tooltips do not show up
    <>
      <Text
        fontSize="xs"
        className="absolute text-white rounded-tl-lg bg-violet-500 px-2 py-1 bottom-0 right-0"
      >{`Attachments of "${title}"`}</Text>
      <Tabs colorScheme="brand" onChange={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>
            <Tooltip label="Media">
              <Images size={18} />
            </Tooltip>
          </Tab>
          <Tab>
            <Tooltip label="Files">
              <Files size={18} />
            </Tooltip>
          </Tab>
          <Tab>
            <Tooltip label="Backlinks for notes">
              <FileOutput size={18} />
            </Tooltip>
          </Tab>
          <Tab>
            <Tooltip label="Outgoing links from notes">
              <FileInput size={18} />
            </Tooltip>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>{renderMedia()}</TabPanel>
          <TabPanel>{renderFiles()}</TabPanel>
          <TabPanel>
            <Links
              items={backlinks}
              type="back"
              actions={actions}
              id={id}
              title={title}
            />
          </TabPanel>
          <TabPanel>
            <Links
              items={headlinks}
              type="head"
              actions={actions}
              id={id}
              title={title}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default AttachmentsDrawer;
