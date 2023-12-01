import { Stack, Button } from "@chakra-ui/react";
import BookmarkIcon from "../assets/bookmark-icon.svg";
import HelpIcon from "../assets/help-icon.svg";
import NoteIcon from "../assets/note-icon.svg";
import StarIcon from "../assets/star-icon.svg";

const SideBar = () => {
    
  return (
    <Stack direction="column" mt="4em">
      <Button
        leftIcon={<img src={NoteIcon} />}
        colorScheme="brand"
        variant="ghost"
        justifyContent="flex-start"
      >
        Notes
      </Button>
      <Button
        leftIcon={<img src={StarIcon} />}
        colorScheme="brand"
        variant="ghost"
        justifyContent="flex-start"
      >
        Favorites
      </Button>
      <Button
        leftIcon={<img src={BookmarkIcon} />}
        colorScheme="brand"
        variant="ghost"
        justifyContent="flex-start"
      >
        Tags
      </Button>
      <Button
        leftIcon={<img src={HelpIcon} />}
        colorScheme="brand"
        variant="ghost"
        justifyContent="flex-start"
      >
        Help
      </Button>
    </Stack>
  );
};

export default SideBar;
