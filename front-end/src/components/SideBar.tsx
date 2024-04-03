import { Stack, Button } from "@chakra-ui/react";
// import HelpIcon from "../assets/help-icon.svg";
// import NoteIcon from "../assets/note-icon.svg";
// import StarIcon from "../assets/star-icon.svg";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { IoPricetagOutline } from "react-icons/io5";
import { Share2, Star, StickyNote, Tag, Info } from "lucide-react";

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
      leftIcon: (
        <StickyNote color="var(--chakra-colors-text-inactive)" size={25} />
      ),
      leftIconColor: <StickyNote color="var(--brand600)" size={25} />,
    },
    {
      text: "Favorites",
      path: "/favorite",
      leftIcon: <Star color="var(--chakra-colors-text-inactive)" size={25} />,
      leftIconColor: <Star color="var(--brand600)" size={25} />,
    },
    {
      text: "Tags",
      path: "/tags",
      leftIcon: <Tag color="var(--chakra-colors-text-inactive)" size={25} />,
      leftIconColor: <Tag color="var(--brand600)" size={25} />,
    },
    // {
    //   text: "Shared with me",
    //   path: "/shared/note",
    //   leftIcon: <Share2 color="var(--chakra-colors-text-inactive)" size={25} />,
    //   leftIconColor: <Share2 color="var(--brand600)" size={25} />,
    // },
    {
      text: "Help",
      path: "/help",
      leftIcon: <Info />,
      leftIconColor: <Info />,
    },
  ];

  return (
    <Stack direction="column" mt="4.5em" spacing={2}>
      {sideBarList.map((e, idx) => {
        return (
          <Button
            key={idx}
            leftIcon={
              selectedItem.includes(e.path) ? e.leftIconColor : e.leftIcon
            }
            color={
              selectedItem.includes(e.path) ? "brand.600" : "text.inactive"
            }
            variant="ghost"
            justifyContent="flex-start"
            borderRadius={0}
            onClick={() => {
              navigate(e.path);
            }}
            bgColor={selectedItem.includes(e.path) ? "brand.50" : ""}
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
