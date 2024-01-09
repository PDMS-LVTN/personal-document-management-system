import { Stack, Button } from "@chakra-ui/react";
import BookmarkIcon from "../assets/bookmark-icon.svg";
import HelpIcon from "../assets/help-icon.svg";
import NoteIcon from "../assets/note-icon.svg";
import StarIcon from "../assets/star-icon.svg";
import { useState } from "react";

const SideBar = () => {
  const [selectedItem, setSelectedItem] = useState(0);
  const sideBarList = [
    {
      text: "Notes",
      leftIcon: <img src={NoteIcon}/>,
      leftIconColor: <img src={NoteIcon} style={{filter: "brightness(0) saturate(100%) invert(14%) sepia(74%) saturate(5369%) hue-rotate(259deg) brightness(67%) contrast(111%)"}}/>
    },
    {
      text: "Favorites",
      leftIcon: <img src={StarIcon} />,
      leftIconColor: <img src={StarIcon} style={{filter: "brightness(0) saturate(100%) invert(14%) sepia(74%) saturate(5369%) hue-rotate(259deg) brightness(67%) contrast(111%)"}}/>,
    },
    {
      text: "Tags",
      leftIcon: <img src={BookmarkIcon} />,
      leftIconColor: <img src={BookmarkIcon} style={{filter: "brightness(0) saturate(100%) invert(14%) sepia(74%) saturate(5369%) hue-rotate(259deg) brightness(67%) contrast(111%)"}}/>,
    },
    {
      text: "Help",
      leftIcon: <img src={HelpIcon} />,
      leftIconColor: <img src={HelpIcon}style={{filter: "brightness(0) saturate(100%) invert(14%) sepia(74%) saturate(5369%) hue-rotate(259deg) brightness(67%) contrast(111%)"}}/>,
    },
  ];

  return (
    <Stack direction="column" mt="4.5em" spacing={0}>
      {sideBarList.map((e, idx) => {
        return (
          <Button
            key={e.text}
            leftIcon={selectedItem === idx ? e.leftIconColor : e.leftIcon}
            color={selectedItem === idx ? "brand.600" : "text.inactive"}
            variant="ghost"
            justifyContent="flex-start"
            borderRadius={0}
            onClick={() => {
              setSelectedItem(idx);
            }}
            bgColor={selectedItem === idx ? "brand.50" : ""}
          >
            {e.text}
          </Button>
        );
      })}
      ;
    </Stack>
  );
};

export default SideBar;
