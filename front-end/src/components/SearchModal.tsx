import {
  Box,
  Button,
  Divider,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import useNotes from "../hooks/useNotes";
import { useNavigate } from "react-router";
import moment from "moment";

const SearchModal = ({ editorRef, close }) => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const { isLoading, actions } = useNotes();
  const navigate = useNavigate();

  const renderResults = (notes) => {
    return notes.map((item, idx) => {
      return (
        <Button
          key={idx}
          w="100%"
          pt={3}
          pb={3}
          mb={2}
          display="flex"
          flexDir="column"
          alignItems="flex-start"
          height="fit-content"
          gap={2}
          onClick={async () => {
            await actions.clickANoteHandler(item.id);
            close();
          }}
        >
          <Text
            width="100%"
            fontWeight="bold"
            mb={1}
            fontSize={13}
            className="line-clamp-1"
            textAlign="left"
          >
            {item.title}
          </Text>
          {/* <Text fontWeight="normal">path</Text> */}
          <Text fontWeight="normal" fontSize={12}>
            Created: {moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </Text>
          <Text fontWeight="normal" fontSize={12}>
            Updated: {moment(item.updated_at).format("YYYY-MM-DD HH:mm:ss")}
          </Text>
        </Button>
      );
    });
  };

  // TODO: get recent notes
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const loadData = async () => {
      const notes = await actions.getAllNotes(controller);
      isMounted && setRecentNotes(notes);
    };
    loadData();

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);
  const debouncedHandleSearch = useCallback(
    debounce(async (keyword) => {
      const res = await actions.handleSearch(keyword);
      setResults(res);
    }, 500),
    []
  );

  const handleInputOnchange = (e) => {
    const { value } = e.target;
    console.log(value == "");
    setKeyword(value.target);
    debouncedHandleSearch(value);
  };

  const handleKeyInput = (e) => {
    if (e.key == "Enter") {
      close();
      navigate("/search", { state: { data: results } });
    }
  };
  return (
    <Box mb={5}>
      <InputGroup>
        <Input
          value={keyword}
          variant="flushed"
          placeholder="What are you looking for?"
          onChange={handleInputOnchange}
          onKeyUp={handleKeyInput}
        />
        <InputRightElement pos="absolute" top={0}>
          <IoIosSearch size={25} color="var(--brand400)" />
        </InputRightElement>
      </InputGroup>
      <Divider orientation="horizontal" mt={3} mb={3} />
      {/* BUG: recentNotes not rendered */}
      <Box overflowY="auto" maxHeight="xl">
        {isLoading ? (
          <Spinner />
        ) : results && results.length ? (
          renderResults(results)
        ) : keyword != "" ? (
          <Text>No notes found</Text>
        ) : (
          renderResults(recentNotes)
        )}
      </Box>
    </Box>
  );
};

export default SearchModal;
