import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import ToolsIcon from "../../assets/tools-icon.svg";
import PlusIcon from "../../assets/plus-icon.svg";
import { Suspense, forwardRef, useEffect, useState } from "react";
import { useApp } from "../../store/useApp";
import { TreeView } from "../../components/TreeView";
import useNotes from "../../hooks/useNotes";
import { convertToMarkdown , convertToHtml} from 'mammoth-styles';
import TurndownService from 'turndown';
import DOMPurify from 'dompurify';

// const showdown = require('showdown');
// const converter = new showdown.Converter();

const Notes = ({ editorRef }) => {
  const treeItems = useApp((state) => state.treeItems);
  const { actions } = useNotes(editorRef);
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    async function convertToMD() {
      convertToHtml({ arrayBuffer: file })
      .then(async function (result) {
        let html = result.value;
        const images = html.match(/<img[^>]+src="([^">]+)/g); // Extract img tags
        const waitingImages = []
        const urls = []

        if (images) {
          for (const imgTag of images ) {
            const src = imgTag.match(/src="([^">]+)/)[1]; // Extract src attribute value
            const response = await fetch(src);
            const blob = await response.blob();
            const type = src.substring(5, src.indexOf(";"));
            const ext = type.substring(6);
            const image = new File([blob], "File name",{ type: type })

            const url = URL.createObjectURL(image)
            const pos = url.lastIndexOf('/');
            const fileName = url.substring(pos + 1);

            const newFile = new File([image], fileName +'.' + ext, {type: image.type});
            waitingImages.push(newFile);
            urls.push(url);
          }
        }

        if (urls.length > 0) {
          let currentIndex = 0;
          html = html.replace(/<img[^>]+>/g, (imgTag) => {
            const newUrl = urls[currentIndex];
            currentIndex++;
            return imgTag.replace(/src="([^"]+)"/, `src="${newUrl}"`);
          });
        }
        console.log(html);
        const turndownService = new TurndownService()
        const markdown = turndownService.turndown(html);
        // const markdown = converter.makeMarkdown(html);
        console.log(markdown);
        actions.createNote(null, markdown);
        
        // setCurrentNote({...currentNote, content: markdown});
        // editorRef.current.setMarkdown(markdown);
      })
      .catch(function (error) {
        console.error(error);
      });
    }

    convertToMD();

  }, [file]);

  return (
    <>
      <Flex justify="space-between" mb="1em" pl="2em" pr="2em" id="notes">
        <Text fontSize="2xl" fontWeight="600">
          Notes
        </Text>
        <div>
          <Button
            variant="ghost"
            mr="0.5em"
            style={{
              height: "40px",
              width: "40px",
              padding: "7px",
              borderRadius: "50%",
            }}
          >
            <img src={ToolsIcon} alt="tools" />
          </Button>
          <Menu>
            <MenuButton
              height="40px"
              width="40px"
              padding="12px"
              // transition="all 0.2s"
              borderRadius="50%"
              background="var(--brand400)"
            >
              <img src={PlusIcon} alt="create" />
            </MenuButton>
            <MenuList>
              <MenuItem
                position={"relative"}
                onClick={() => actions.createNote(null, '# Untitled')}
              >
                Create new note
              </MenuItem>
              <MenuItem>
                <span>Import file</span>
                <input
                  style={{
                    opacity: 0,
                    zIndex: 5,
                    position: "absolute",
                    maxWidth: "200px",
                    cursor: "pointer",
                  }}
                  type="file"
                  className="upload-file"
                  name="upload_file"
                  onChange={handleInputChange}
                />
              </MenuItem>
            </MenuList>
          </Menu>
          {/* <Tooltip label="Add">
            <Button
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
                background: "var(--brand400)",
              }}
              onClick={() => actions.createNote(null)}
            >
              <img src={PlusIcon} alt="create" />
            </Button>
          </Tooltip> */}
        </div>
      </Flex>
      {treeItems && treeItems.length > 0 ? (
        <Suspense fallback={<Skeleton />}>
          <TreeView data={treeItems} editorRef={editorRef} />
        </Suspense>
      ) : (
        <Text pl="2em" pr="2em" color="text.inactive">
          Click <strong>Add</strong> to create a new note
        </Text>
      )}
    </>
  );
};

export default Notes;
