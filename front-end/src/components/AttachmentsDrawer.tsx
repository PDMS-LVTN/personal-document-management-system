import Links from "@/editor/components/InternalLinks/Links";
import { useInternalLinks } from "@/hooks/useInternalLinks";
import { useApp } from "@/store/useApp";
import { Text, Tooltip } from "@chakra-ui/react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { FileText, Files, Images } from "lucide-react";
import { useState, useEffect } from "react";
import { FileInput, FileOutput } from "lucide-react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

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
          {/* <Box sx={{ width: 500, height: 450, overflowY: 'scroll' }}> */}
            <ImageList variant="masonry" cols={3} gap={8}>
              {attachments.images.map((item, id) => (
                <ImageListItem key={id}>
                  <img
                    srcSet={`${import.meta.env.VITE_SERVER_PATH}/${item.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${import.meta.env.VITE_SERVER_PATH}/${item.path}?w=248&fit=crop&auto=format`}
                    alt={'anc'}
                    loading="lazy"
                    // onClick={() => onClickImage(id)}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          {/* </Box> */}
      </div>
    );
  };
  const onClick = (id) => {
    document.getElementById(`file-node-${id}`).click();
  };

  const renderFiles = () => {
    return (
      <>
        {attachments.files.length ? (
          attachments.files.map((item, id) => {
            return (
              <div key={id}>
                <div
                  contentEditable={false}
                  className="flex justify-start gap-2 rounded-md hover:cursor-pointer  "
                  style={{
                    backgroundColor: "var(--brand50)",
                    width: "100%",
                    position: "relative",
                    height: "40px",
                    marginBottom: "0.3rem",
                  }}
                  onClick={() => onClick(id)}
                >
                  <div
                    style={{
                      backgroundColor: "var(--brand100)",
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: "40px",
                      borderTopLeftRadius: "0.375rem",
                      borderBottomLeftRadius: "0.375rem",
                    }}
                    className="flex justify-center items-center"
                  >
                    <FileText
                      className="w-5 h-5 text-black dark:text-white "
                      style={{ color: "var(--brand400)" }}
                    />
                  </div>
                  <div
                    className="flex flex-col justify-center pl-1 py-1"
                    style={{ marginLeft: "50px" }}
                  >
                    <div className="text-xs line-clamp-1">{item.name}</div>
                  </div>
                </div>
                <a
                  id={`file-node-${id}`}
                  className="w-0 h-0 overflow-hidden opacity-0"
                  href={`${import.meta.env.VITE_SERVER_PATH}/${item.path}`}
                  // ref={ref}
                  target="_blank"
                ></a>
              </div>
            );
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
      {/* <Text
        fontSize="xs"
        className="absolute text-white rounded-tl-lg bg-violet-500 px-2 py-1 bottom-0 right-0"
      >{`Attachments of "${title}"`}</Text> */}
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
