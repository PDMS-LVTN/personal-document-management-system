import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { Suspense, useEffect } from "react";
import { TreeView } from "../components/TreeView";
import { useApp } from "../store/useApp";
import { useOutletContext } from "react-router-dom";
import { ContextType } from "../layouts/TreeAndEditorContainer";
import { useFavorite } from "../hooks/useFavorite";

function Favorite() {
  const ref = useOutletContext<ContextType>();
  const { getFavoriteNotes } = useFavorite();
  const treeItems = useApp((state) => state.treeItems);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    getFavoriteNotes(controller, isMounted);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <Flex justify="space-between" mb="1em" pl="2em" pr="2em" id="notes">
        <Text fontSize="2xl" fontWeight="600">
          Favorite
        </Text>
      </Flex>
      {treeItems && treeItems.length > 0 ? (
        <Suspense fallback={<Skeleton />}>
          <TreeView data={treeItems} editorRef={ref} />
        </Suspense>
      ) : (
        <Text pl="2em" pr="2em" color="text.inactive">
          Pick your favorite notes
        </Text>
      )}
    </>
  );
}

export default Favorite;
