import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { useState, useEffect } from "react";

type SubType = {
  path: string;
};

type AttachmentsType = {
  images: SubType[];
  files: SubType[];
  // links: [];
};

const AttachmentsDrawer = ({ actions, noteId }) => {
  const [attachments, setAttachments] = useState<AttachmentsType>({
    images: [],
    files: [],
    // links: [],
  });

  const renderMedia = () => {
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
        {attachments.files.map((item, id) => {
          return <div key={id}>{item.path}</div>;
        })}
      </>
    );
  };
  const renderLinks = () => {
    return <></>;
  };

  useEffect(() => {
    const loadData = async () => {
      const res = await actions.getAttachments(noteId);
      console.log(res);
      setAttachments(res);
    };

    loadData();
  }, []);

  return (
    <Tabs>
      <TabList>
        <Tab>Media</Tab>
        <Tab>Files</Tab>
        <Tab>Links</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>{renderMedia()}</TabPanel>
        <TabPanel>{renderFiles()}</TabPanel>
        <TabPanel>{renderLinks()}</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default AttachmentsDrawer;
