/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useCallback, useMemo, useState } from "react";

export default function useModal(
  size?: string
): [
  JSX.Element | null,
  (
    title: string,
    getContent: (onClose: () => void) => JSX.Element,
    closeOnClickOutside?: boolean
  ) => void
] {
  const [modalContent, setModalContent] = useState<null | {
    closeOnClickOutside: boolean;
    content: JSX.Element;
    title: string;
  }>(null);

  const onClose = useCallback(() => {
    setModalContent(null);
  }, []);

  const modal = useMemo(() => {
    if (modalContent === null) {
      return null;
    }
    const { title, content, closeOnClickOutside } = modalContent;
    return (
      <Modal
        isOpen={true}
        onClose={onClose}
        closeOnOverlayClick={closeOnClickOutside}
        size={size}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent pb={5}>
          <ModalHeader w="90%">{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{content}</ModalBody>
        </ModalContent>
      </Modal>
    );
  }, [modalContent, onClose]);

  const showModal = useCallback(
    (
      title: string,
      // eslint-disable-next-line no-shadow
      getContent: (onClose: () => void) => JSX.Element,
      closeOnClickOutside = false
    ) => {
      setModalContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
      });
    },
    [onClose]
  );

  return [modal, showModal];
}
