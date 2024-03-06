// import { ButtonWithTooltip } from '.././primitives/toolbar'
// import { openLinkEditDialog$ } from '../../link-dialog'
// import { useCellValue, usePublisher } from '@mdxeditor'
// import { iconComponentFor$ } from '../../core'

import { ButtonWithTooltip } from "@mdxeditor/editor";
import { MdAttachFile } from "react-icons/md";

/**
 * A toolbar component that opens the link edit dialog.
 * For this component to work, you must include the `linkDialogPlugin`.
 * @group Toolbar Components
 */
export const InsertFile = () => {
  //   const openLinkDialog = usePublisher(openLinkEditDialog$)
  return (
    <ButtonWithTooltip
      title="Insert file"
      onClick={() => {
        // openLinkDialog()
      }}
    >
      <MdAttachFile size={20} />
    </ButtonWithTooltip>
  );
};