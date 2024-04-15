import { cn } from "@/editor/lib/utils";
import { Button, IconButton, Input, Text } from "@chakra-ui/react";
import { debounce } from "lodash";
import { ChevronsDownUp, ChevronsUpDown, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const LinkDisplay = ({ link, type, actions, initialShowContext, id }) => {
  const [showContext, setShowContext] = useState(initialShowContext);
  useEffect(() => {
    setShowContext(initialShowContext);
  }, [initialShowContext]);
  return (
    <div>
      <div className="flex gap-1 items-center mb-2">
        <IconButton
          aria-label="Show more context"
          icon={
            showContext ? (
              <ChevronsDownUp size={12} />
            ) : (
              <ChevronsUpDown size={12} />
            )
          }
          onClick={() => setShowContext(!showContext)}
          size="xs"
        />
        <Button
          size="xs"
          onClick={() => {
            actions.clickANoteHandler(link.id);
          }}
        >
          {link.title}
        </Button>
        <span
          className={cn("inline-block ml-auto text-xs text-gray-400", {
            hidden: type === "head",
          })}
        >
          {link.content.length}
        </span>
      </div>
      {showContext &&
        link.content.map((ref, idx) => {
          return (
            <button
              key={idx}
              className="text-left hover:bg-slate-100 rounded-md p-2 mb-1 w-full text-xs"
              dangerouslySetInnerHTML={{ __html: ref.content }}
              onClick={async () => {
                await actions.clickANoteHandler(link.id);
                if (type === "back") {
                  const linksFoundFromId = document.querySelectorAll(
                    `[data-id="${id}"]`
                  );
                  if (linksFoundFromId && linksFoundFromId.length) {
                    linksFoundFromId[ref.index].scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }
              }}
            />
          );
        })}
    </div>
  );
};

const Links = ({ items, type, actions, ...props }) => {
  const [isSearch, setIsSearch] = useState(false);
  const [isShowAllContext, setIsShowAllContext] = useState(false);
  const [value, setValue] = useState("");
  const [searchResults, setSearchResults] = useState(items);

  useEffect(() => {
    setSearchResults(items);
  }, [items]);

  const debouncedHandleSearch = useCallback(
    debounce(async (keyword: string) => {
      const res = items.filter((link) =>
        link.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchResults(res);
    }, 500),
    [items]
  );

  const handleInputOnchange = (e) => {
    const { value } = e.target;
    setValue(value.target);
    debouncedHandleSearch(value);
  };
  return (
    <>
      <div className="flex gap-1 mb-2 items-center">
        <Text fontWeight="600" fontSize="sm">
          {`${type === "head" ? "Outgoing links" : "Backlinks"} `}
        </Text>
        <div className="ml-auto flex justify-end items-center gap-1">
          <IconButton
            aria-label="Search"
            icon={<Search size={12} />}
            onClick={() => setIsSearch(!isSearch)}
            size="xs"
          />
          <IconButton
            aria-label="Show all contexts"
            icon={
              isShowAllContext ? (
                <ChevronsDownUp size={12} />
              ) : (
                <ChevronsUpDown size={12} />
              )
            }
            onClick={() => setIsShowAllContext(!isShowAllContext)}
            size="xs"
          />
          <span className="inline-block  text-xs text-gray-400">
            {items.length}
          </span>
        </div>
      </div>
      <Input
        placeholder="Search..."
        w="100%"
        className={cn({ hidden: !isSearch })}
        size="xs"
        mb={3}
        onChange={handleInputOnchange}
        value={value}
      />
      {searchResults.length ? (
        searchResults.map((link, index) => {
          return (
            <LinkDisplay
              link={link}
              key={index}
              type={type}
              actions={actions}
              initialShowContext={isShowAllContext}
              id={props.id}
            />
          );
        })
      ) : (
        <span className="text-xs block text-gray-400">No links found</span>
      )}
    </>
  );
};

export default Links;
