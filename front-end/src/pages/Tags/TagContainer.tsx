import { useEffect, useState } from "react";
import { Tags } from "./Tags";
import { useTags } from "../../hooks/useTags";
import { Button, Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import { IoMdPricetag } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { ContextType } from "../../layouts/TreeAndEditorContainer";
import { useApp } from "../../store/useApp";

const TagContainer = () => {
  const { getAllTags } = useTags();
  const navigate = useNavigate();
  const [isShowNotes, setIsShowNotes] = useState(false);
  const { ref } = useOutletContext<ContextType>();
  const { deleteTag } = useTags();
  const location = useLocation();
  const setCurrentTags = useApp((state) => state.setCurrentTags);
  const currentTags = useApp((state) => state.currentTags);
  const allTags = useApp((state) => state.allTags);
  const setAllTags = useApp((state) => state.setAllTags);
  const toast = useToast();

  const handleDeleteTag = async (tagId) => {
    const { responseError } = await deleteTag(tagId);
    if (responseError) {
      toast({
        title: `Some error happened! 😢`,
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: `Your tag is deleted`,
        status: "success",
        isClosable: true,
      });
      setAllTags(allTags.filter((tag) => tag.id !== tagId));
      setCurrentTags(currentTags.filter((tag) => tag.id !== tagId));
    }
  };

  useEffect(() => {
    console.log("tag container mounts");
    let isMounted = true;
    const controller = new AbortController();
    const loadData = async () => {
      const { tags } = await getAllTags(controller);
      isMounted && setAllTags(tags);
    };
    loadData();

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);

  useEffect(() => {
    console.log("here");
    if (!location.state || location.state?.isGoBack) setIsShowNotes(false);
  }, [location.state]);

  const renderResults = (res) => {
    return res.map((item, idx) => {
      return (
        <Flex
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          // pr={3}
          key={idx}
          _hover={{ backgroundColor: "gray.200" }}
        >
          <Button
            // variant="ghost"
            borderRadius={0}
            w="100%"
            pt={3}
            pb={3}
            pl="2em"
            pr="2em"
            backgroundColor={'transparent'}
            display="flex"
            justifyContent="flex-start"
            height="40px"
            alignItems="center"
            gap={2}
            onClick={() => {
              navigate(`${item.id}`, { state: { tagName: item.value } });
              setIsShowNotes(true);
            }}
          >
            <span className="mr-3">
              <IoMdPricetag color="var(--brand300)" size="24px" />
            </span>
            {/* <IoMdPricetag size={30} color="#7540EE" /> */}
            <Text fontWeight="normal" fontSize={"14px"}>{item.label}</Text>
            
          </Button>
          <IconButton
            marginLeft={"auto"}
            marginRight={5}
            isRound
            aria-label="Delete tag"
            backgroundColor={"gray.200"}
            _hover={{ backgroundColor: "gray.300" }}
            size="sm"
            alignSelf={"revert"}
            icon={<IoClose />}
            onClick={() => handleDeleteTag(item.id)}
          />
          
        </Flex>
      );
    });
  };

  if (isShowNotes) return <Outlet context={{ ref }} />;
  return <Tags renderResults={renderResults} />;
};

export default TagContainer;
