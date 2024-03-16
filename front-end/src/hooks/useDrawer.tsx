/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button } from "@chakra-ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { useCallback, useMemo, useState } from "react";
// import Modal from '../ui/Modal';

export default function useDrawer(
  size?: string
  //   placement: DrawerPlacement = "right"
): [
  JSX.Element | null,
  (title: string, showDrawer: (onClose: () => void) => JSX.Element) => void
] {
  const [drawerContent, setDrawerContent] = useState<null | {
    closeOnClickOutside: boolean;
    content: JSX.Element;
    title: string;
  }>(null);

  const onClose = useCallback(() => {
    setDrawerContent(null);
  }, []);

  const drawer = useMemo(() => {
    if (drawerContent === null) {
      return null;
    }
    const { title, content, closeOnClickOutside } = drawerContent;
    return (
      <Drawer
        // placement={placement}
        isOpen={true}
        onClose={onClose}
        closeOnOverlayClick={closeOnClickOutside}
        size={size}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">{title}</DrawerHeader>
          <DrawerBody>{content}</DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }, [drawerContent, onClose]);

  const showDrawer = useCallback(
    (
      title: string,
      // eslint-disable-next-line no-shadow
      getContent: (onClose: () => void) => JSX.Element,
      closeOnClickOutside = false
    ) => {
      setDrawerContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
      });
    },
    [onClose]
  );

  return [drawer, showDrawer];
}
