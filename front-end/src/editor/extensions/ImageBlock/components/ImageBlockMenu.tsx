import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import React, { useCallback, useRef } from "react";
import { Instance, sticky } from "tippy.js";
import { v4 as uuid } from "uuid";

import { Toolbar } from "@/editor/components/ui/Toolbar";
import { Icon } from "@/editor/components/ui/Icon";
import { ImageBlockWidth } from "./ImageBlockWidth";
import { MenuProps } from "@/editor/components/menus/types";
import { getRenderContainer } from "@/editor/lib/utils";
import { Button } from "@chakra-ui/react";
import { useApp } from "@/store/useApp";
import useAxiosJWT from "@/hooks/useAxiosJWT";

export const ImageBlockMenu = ({
  editor,
  appendTo,
  showModal,
}: MenuProps & { showModal }): JSX.Element => {
  const menuRef = useRef<HTMLDivElement>(null);
  const tippyInstance = useRef<Instance | null>(null);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "node-imageBlock");
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);
    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive("imageBlock");

    return isActive;
  }, [editor]);

  const onAlignImageLeft = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("left")
      .run();
  }, [editor]);

  const onAlignImageCenter = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("center")
      .run();
  }, [editor]);

  const onAlignImageRight = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("right")
      .run();
  }, [editor]);

  const onWidthChange = useCallback(
    (value: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setImageBlockWidth(value)
        .run();
    },
    [editor]
  );

  const currentNote = useApp((state) => state.currentNote);
  const axiosJWT = useAxiosJWT();

  const onGetText = async () => {
    // TODO: fetch image text
    let text;
    const src: string = editor.getAttributes("imageBlock").src;
    console.log(src.substring(src.lastIndexOf("/") + 1), currentNote.id);
    console.log(currentNote);
    try {
      const response = await axiosJWT.post(
        "image_content/extract_text",
        JSON.stringify({
          note_ID: currentNote.id,
          path: src.substring(src.lastIndexOf("/") + 1),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      text = response.data[0].content;
    } catch (e) {
      console.log(e);
    }
    showModal("Extracted text", (onClose) => {
      return (
        <div className="flex justify-between">
          <p style={{ width: "80%" }}>{text}</p>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(text);
              onClose();
            }}
          >
            <Icon name="Copy" />
          </Button>
        </div>
      );
    });
  };

  return (
    <>
      <BaseBubbleMenu
        editor={editor}
        pluginKey={`imageBlockMenu-${uuid()}`}
        shouldShow={shouldShow}
        updateDelay={0}
        tippyOptions={{
          offset: [0, 8],
          popperOptions: {
            modifiers: [{ name: "flip", enabled: false }],
          },
          getReferenceClientRect,
          onCreate: (instance: Instance) => {
            tippyInstance.current = instance;
          },
          appendTo: () => {
            return appendTo?.current;
          },
          plugins: [sticky],
          sticky: "popper",
        }}
      >
        <Toolbar.Wrapper shouldShowContent={shouldShow()} ref={menuRef}>
          <Toolbar.Button
            tooltip="Align image left"
            active={editor.isActive("imageBlock", { align: "left" })}
            onClick={onAlignImageLeft}
          >
            <Icon name="AlignHorizontalDistributeStart" />
          </Toolbar.Button>
          <Toolbar.Button
            tooltip="Align image center"
            active={editor.isActive("imageBlock", { align: "center" })}
            onClick={onAlignImageCenter}
          >
            <Icon name="AlignHorizontalDistributeCenter" />
          </Toolbar.Button>
          <Toolbar.Button
            tooltip="Align image right"
            active={editor.isActive("imageBlock", { align: "right" })}
            onClick={onAlignImageRight}
          >
            <Icon name="AlignHorizontalDistributeEnd" />
          </Toolbar.Button>
          <Toolbar.Divider />
          <ImageBlockWidth
            onChange={onWidthChange}
            value={parseInt(editor.getAttributes("imageBlock").width)}
          />
          <Toolbar.Divider />
          <Toolbar.Button
            tooltip="Copy text"
            onClick={onGetText}
            disabled={editor
              .getAttributes("imageBlock")
              .src?.includes(`${import.meta.env.VITE_CLIENT_PATH}`)}
          >
            <Icon name="ClipboardType" />
          </Toolbar.Button>
        </Toolbar.Wrapper>
      </BaseBubbleMenu>
    </>
  );
};

export default ImageBlockMenu;
