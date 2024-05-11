import { IconButton, Text, Tooltip, background } from "@chakra-ui/react";
import { SharedNotesList } from "./SharedNotesList";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthentication } from "@/store/useAuth";
import { usePermission } from "@/hooks/usePermission";
import { Table2 } from "lucide-react";

export const Wrapper = () => {
  const [notes, setNotes] = useState(null);
  const auth = useAuthentication((state) => state.auth);
  const { getAllSharedNotes } = usePermission();
  const navigate = useNavigate();
  useEffect(() => {
    const loadData = async () => {
      const { responseData } = await getAllSharedNotes(auth.email);
      setNotes(responseData);
    };
    loadData();
  }, []);

  if (!notes) return null;

  return (
    <div className="px-8">
      <div className="flex justify-between items-center mb-5">
        <Text fontSize="2xl" fontWeight="600">
          Shared with me
        </Text>
        <Tooltip label="Open in table view">
          <IconButton
            isRound={true}
            variant="ghost"
            _hover={{ background: "brand.400", color: "white" }}
            aria-label="Done"
            color="brand.400"
            icon={<Table2 size="20px" />}
            onClick={() => navigate("/shared/table")}
          />
        </Tooltip>

        {/* <ButtonGroup size="sm" isAttached variant="outline">
          <Button
            backgroundColor={layout === "list" && "brand.300"}
            _hover={{
              background: layout === "list" && "brand.500",
            }}
            onClick={() => setLayout("list")}
          >
            List
          </Button>
          <Button
            backgroundColor={layout === "grid" && "brand.300"}
            _hover={{
              background: layout === "grid" && "brand.500",
            }}
            onClick={() => setLayout("grid")}
          >
            Table
          </Button>
        </ButtonGroup> */}
      </div>

      {/* <div className="flex gap-2 pb-5">
        <Popover placement="top-start">
          <PopoverTrigger>
            <Button size="sm" variant="outline">
              Click me
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Input
                variant="flushed"
                size="sm"
                mb={3}
                placeholder="Search for people"
              />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore.
            </PopoverBody>
            <PopoverFooter>Anyone with the link</PopoverFooter>
          </PopoverContent>
        </Popover>
        <Popover placement="top-start">
          <PopoverTrigger>
            <Button size="sm" variant="outline">
              Date
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Input
                variant="flushed"
                size="sm"
                mb={3}
                placeholder="Basic usage"
              />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore.
            </PopoverBody>
            <PopoverFooter>Anyone with the link</PopoverFooter>
          </PopoverContent>
        </Popover>
      </div> */}
      <SharedNotesList data={notes} />
      <Outlet />
    </div>
  );
};
