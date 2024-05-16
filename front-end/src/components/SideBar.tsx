import { Stack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, StickyNote, Tag, Users } from "lucide-react";

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
        <StickyNote color="var(--chakra-colors-text-inactive)" size={20} />
      ),
      leftIconColor: <StickyNote color="var(--brand600)" size={20} />,
    },
    {
      text: "Favorites",
      path: "/favorite",
      leftIcon: <Star color="var(--chakra-colors-text-inactive)" size={20} />,
      leftIconColor: <Star color="var(--brand600)" size={20} />,
    },
    {
      text: "Tags",
      path: "/tags",
      leftIcon: <Tag color="var(--chakra-colors-text-inactive)" size={20} />,
      leftIconColor: <Tag color="var(--brand600)" size={20} />,
    },
    {
      text: "Shared",
      path: "/shared",
      leftIcon: <Users color="var(--chakra-colors-text-inactive)" size={22} />,
      leftIconColor: <Users color="var(--brand600)" size={22} />,
    },
  ];

  return (
    <Stack direction="column" mt="5.7em" spacing={0}>
      {sideBarList.map((e, idx) => {
        return (
          <Button
            key={idx}
            fontWeight={"500"}
            fontSize={"14px"}
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
