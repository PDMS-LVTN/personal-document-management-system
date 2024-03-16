import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { useApp } from "../../store/useApp";
import { Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";

const SearchTag = ({ renderResults }) => {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const allTags = useApp((state) => state.allTags);

  const debouncedHandleSearch = useCallback(
    debounce(async (keyword) => {
      const res = allTags.filter((tag) => tag.label.includes(keyword));
      setSearchResults(res);
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
    <>
      <InputGroup pl="2em" pr="2em" mb={4} w="100%">
        <InputLeftElement pointerEvents="none" ml="2em">
          <IoSearch size="24px" color="var(--brand400)" />
        </InputLeftElement>
        <Input
          m={0}
          value={keyword}
          onChange={handleInputOnchange}
          placeholder="Search your tag"
        />
      </InputGroup>

      {searchResults && searchResults.length ? (
        renderResults(searchResults)
      ) : keyword != "" ? (
        <Text color="text.inactive" ml={10}>
          No tags found
        </Text>
      ) : allTags && allTags.length ? (
        renderResults(allTags)
      ) : (
        <Text color="text.inactive" ml={10}>
          You have no tags
        </Text>
      )}
    </>
  );
};

export default SearchTag;
