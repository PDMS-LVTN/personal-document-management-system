import { Stack, Button } from "@chakra-ui/react";
import HelpIcon from "../assets/help-icon.svg";
import NoteIcon from "../assets/note-icon.svg";
import StarIcon from "../assets/star-icon.svg";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoPricetagOutline } from "react-icons/io5";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(location.pathname);
  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location.pathname]);
  const sideBarList = [
    {
      text: "Notes",
      path: "/notes",
      leftIcon: <img src={NoteIcon} />,
      leftIconColor: (
        <img
          src={NoteIcon}
          style={{
            filter:
              "brightness(0) saturate(100%) invert(14%) sepia(74%) saturate(5369%) hue-rotate(259deg) brightness(67%) contrast(111%)",
          }}
        />
      ),
    },
    {
      text: "Favorites",
      path: "/favorite",
      leftIcon: <img src={StarIcon} />,
      leftIconColor: (
        <img
          src={StarIcon}
          style={{
            filter:
              "brightness(0) saturate(100%) invert(14%) sepia(74%) saturate(5369%) hue-rotate(259deg) brightness(67%) contrast(111%)",
          }}
        />
      ),
    },
    {
      text: "Tags",
      path: "/tags",
      leftIcon: (
        <IoPricetagOutline
          color="var(--chakra-colors-text-inactive)"
          size={25}
        />
      ),
      leftIconColor: <IoPricetagOutline color="var(--brand600)" size={25} />,
    },
    {
      text: "Help",
      path: "/help",
      leftIcon: <img src={HelpIcon} />,
      leftIconColor: (
        <img
          src={HelpIcon}
          style={{
            filter:
              "brightness(0) saturate(100%) invert(14%) sepia(74%) saturate(5369%) hue-rotate(259deg) brightness(67%) contrast(111%)",
          }}
        />
      ),
    },
  ];

  return (
    <Stack direction="column" mt="4.5em" spacing={0}>
      {sideBarList.map((e, idx) => {
        return (
          <Button
            key={idx}
            leftIcon={selectedItem === e.path ? e.leftIconColor : e.leftIcon}
            color={selectedItem === e.path ? "brand.600" : "text.inactive"}
            variant="ghost"
            justifyContent="flex-start"
            borderRadius={0}
            onClick={() => {
              navigate(e.path, { state: { mode: "tags" } });
            }}
            bgColor={selectedItem === e.path ? "brand.50" : ""}
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
