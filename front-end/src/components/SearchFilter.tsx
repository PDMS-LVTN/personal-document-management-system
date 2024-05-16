import {
  Box,
  Button,
  Divider,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { debounce, set } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import useNotes from "../hooks/useNotes";
import { useTags } from "../hooks/useTags";
import { useNavigate } from "react-router";
import moment from "moment";
import "./index.css";
import { FaStar } from "react-icons/fa6";

const SearchFilter = ({ editorRef, close }) => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const { isLoading, actions } = useNotes(editorRef);
  const { getAllTags } = useTags();
  const [allTags, setAllTags] = useState([]);
  const navigate = useNavigate();
  const sortByOptions = [
    { value: "CreatedNewest", label: "Created: Newest" },
    { value: "CreatedOldest", label: "Created: Oldest" },
    { value: "UpdatedNewest", label: "Updated: Newest" },
    { value: "UpdatedOldest", label: "Updated: Oldest" },
  ];
  const [valueForm, setValueForm] = useState({
    sortBy: "",
    tags: [],
    createdTimeFrom: "",
    createdTimeTo: "",
    updatedTimeFrom: "",
    updatedTimeTo: "",
    keyword: "",
    onlyTitle: true,
    isFavorite: false,
  });

  const handelFilter = async (input) => {
    const valueFormTemp = { ...valueForm, ...input };
    setValueForm(valueFormTemp);
    const res = await actions.handelFilterNotes(valueFormTemp);
    console.log(res);
    setResults(res);
    // close();
    // navigate("/search", { state: { data: res } });
  };

  const handelSubmit = async () => {
    close();
    navigate("/search", { state: { data: results } });
  };

  const handelReset = () => {
    setValueForm({
      sortBy: "",
      tags: [],
      createdTimeFrom: "",
      createdTimeTo: "",
      updatedTimeFrom: "",
      updatedTimeTo: "",
      keyword: "",
      onlyTitle: true,
      isFavorite: false,
    });
  };

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
            fontSize={12}
            className="line-clamp-1"
            textAlign="left"
          >
            {item.title}
          </Text>
          {/* <Text fontWeight="normal">path</Text> */}
          <Text fontWeight="normal" fontSize={11}>
            Created: {moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </Text>
          <Text fontWeight="normal" fontSize={11}>
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
      const { tags } = await getAllTags(controller);
      if (isMounted) {
        setAllTags(tags);
      }
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
    <Box mb={5} pt={5}>
      <Flex>
        <FormControl width="70%">
          <Text fontWeight="700" fontSize="20px" m={4} mb={7} color="brand.500">
            Advanced Filter
          </Text>
          <Box display="flex" alignItems="center" m={4}>
            <FormLabel className="form-label">Keyword</FormLabel>
            <Input
              size="md"
              type="text"
              width={"35%"}
              onChange={(e) => {
                handelFilter({ keyword: e.target.value });
              }}
              value={valueForm.keyword}
              mr={8}
            />

            <Checkbox
              size="lg"
              colorScheme="brand"
              defaultChecked
              onChange={(e) => {
                handelFilter({ onlyTitle: e.target.checked });
              }}
            >
              Only title
            </Checkbox>
          </Box>
          <Box display="flex" alignItems="center" m={4}>
            <FormLabel className="form-label">Sort by</FormLabel>
            <div style={{ width: "35%" }}>
              <Select
                placeholder="Select option"
                onChange={(selected) => {
                  handelFilter({ sortBy: selected });
                }}
                value={valueForm.sortBy}
                options={sortByOptions}
              />
            </div>
          </Box>
          <Box display="flex" alignItems="center" m={4}>
            <FormLabel className="form-label">Created time</FormLabel>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="date"
              width={"35%"}
              onChange={(e) => {
                handelFilter({ createdTimeFrom: e.target.value });
              }}
              value={valueForm.createdTimeFrom}
            />
            <Text width={"4%"} textAlign={"center"}>
              -
            </Text>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="date"
              width={"35%"}
              onChange={(e) => {
                handelFilter({ createdTimeTo: e.target.value });
              }}
              value={valueForm.createdTimeTo}
            />
          </Box>
          <Box display="flex" alignItems="center" m={4}>
            <FormLabel className="form-label">Updated time</FormLabel>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="date"
              width={"35%"}
              onChange={(e) => {
                handelFilter({ updatedTimeFrom: e.target.value });
              }}
              value={valueForm.updatedTimeFrom}
            />
            <Text width={"4%"} textAlign={"center"}>
              -
            </Text>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="date"
              width={"35%"}
              onChange={(e) => {
                handelFilter({ updatedTimeTo: e.target.value });
              }}
              value={valueForm.updatedTimeTo}
            />
          </Box>
          <Box display="flex" alignItems="center" m={4}>
            <FormLabel className="form-label">Tags</FormLabel>
            <div style={{ width: "74%" }}>
              <Select
                isMulti
                name="tags"
                size={"md"}
                options={allTags}
                placeholder="Select some tags"
                onChange={(selected) => {
                  handelFilter({ tags: selected });
                }}
                value={valueForm.tags}
                variant="outline"
              />
            </div>
          </Box>
          <Box display="flex" alignItems="center" m={4}>
            <FormLabel className="form-label"></FormLabel>
            <Button
              colorScheme="brand"
              variant={valueForm.isFavorite ? "solid" : "outline"}
              onClick={(e)=> {handelFilter({ isFavorite: !valueForm.isFavorite })}}
            >
              Favorite
            </Button>
          </Box>
          <Box display="flex" flexDirection="row-reverse" m={5}>
            <Button
              mt={4}
              backgroundColor="brand.400"
              color={"white"}
              type="submit"
              fontWeight={600}
              onClick={handelSubmit}
            >
              Filter
            </Button>
            <Button
              mt={4}
              mr={4}
              backgroundColor="white"
              color="brand.400"
              variant="outline"
              borderColor={"brand.400"}
              type="reset"
              fontWeight={600}
              onClick={handelReset}
            >
              Reset
            </Button>
          </Box>
        </FormControl>

        {/* BUG: recentNotes not rendered */}
        <Box width={"30%"}>
          {isLoading ? (
            <Spinner />
          ) : results && results.length ? (
            <Box m={4}>
              <Text>{results.length} notes found</Text>
              <Divider orientation="horizontal" mt={3} mb={3} />
              <Box overflowY="auto" maxHeight="400px">
                {renderResults(results)}
              </Box>
            </Box>
          ) : (
            <Text m={4}>No note found</Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default SearchFilter;
