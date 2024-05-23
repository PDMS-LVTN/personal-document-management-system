import { Button } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
// import { useEffect, useState } from "react";
import useNotes from "../hooks/useNotes";
// import { ContextType } from "../layouts/TreeAndEditorContainer";
import { useLocation, useOutletContext } from "react-router";
import moment from "moment";

export const Search = () => {
  // const { ref } = useOutletContext<ContextType>();
  // const [searchResults, setSearchResults] = useState([]);
  const { actions } = useNotes();
  const location = useLocation();
  const searchResults = location.state?.data;

  // useEffect(() => {
  //   setSearchResults(location.state.data);
  // }, [location.state.data]);

  return (
    <>
      <Flex justify="space-between" mb="1em" pl="2em" pr="2em" id="notes">
        <Flex flexDir="column" gap={2}>
          <Text fontSize="2xl" fontWeight="600">
            Search results
          </Text>
          <Text>{searchResults?.length || "0"} notes found</Text>
        </Flex>
      </Flex>
      {searchResults && searchResults.length ? (
        searchResults.map((item, idx) => {
          return (
            <Button
              key={idx}
              borderRadius={0}
              w="100%"
              pt={3}
              pb={3}
              mb={2}
              pl="2em"
              pr="2em"
              display="flex"
              flexDir="column"
              alignItems="flex-start"
              height="fit-content"
              // backgroundColor="brand.50"
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
        })
      ) : (
        <Text pl="2em" pr="2em" color="text.inactive">
          No results
        </Text>
      )}
    </>
  );
};
