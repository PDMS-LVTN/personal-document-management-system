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
import useAxiosJWT from "../hooks/useAxiosJWT";
import { APIEndPoints } from "../api/endpoint";
import { useAuthentication } from "../store/useAuth";
import { useApp } from "../store/useApp";
import useNotes from "../hooks/useNotes";

const SearchModal = ({ editorRef, close }) => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const axiosJWT = useAxiosJWT();
  const auth = useAuthentication((state) => state.auth);
  const setAuth = useAuthentication((state) => state.setAuth);
  const clean = useApp((state) => state.clean);
  const { isLoading, actions } = useNotes(editorRef);

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
          <Text fontWeight="bold" fontSize="lg" mb={2}>
            {item.title}
          </Text>
          <Text fontWeight="normal">path</Text>
          <Text fontWeight="normal">Created </Text>
          <Text fontWeight="normal">Edited</Text>
        </Button>
      );
    });
  };

  // TODO: get recent notes
  const getRecentNote = async () => {
    try {
      const response = await axiosJWT.post(
        APIEndPoints.ALL_NOTE,
        JSON.stringify({ user_id: auth.id }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      setRecentNotes(response.data);
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        setAuth(undefined);
        clean();
      }
    }
  };
  useEffect(() => {
    getRecentNote();
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
  return (
    <Box mb={5} pos="relative">
      <InputGroup>
        <Input
          value={keyword}
          variant="flushed"
          placeholder="What are you looking for?"
          onChange={handleInputOnchange}
        />
        <InputRightElement pos="absolute" top={0}>
          <IoIosSearch size={25} color="var(--brand400)" />
        </InputRightElement>
      </InputGroup>
      <Divider orientation="horizontal" mt={3} mb={3} />
      {/* BUG: recentNotes not rendered */}
      <Box overflowY="auto">
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
