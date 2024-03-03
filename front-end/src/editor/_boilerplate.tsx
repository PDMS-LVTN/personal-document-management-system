import {
  diffSourcePlugin,
  markdownShortcutPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
} from "@mdxeditor/editor";
import { CustomToolbar } from "./CustomToolbar";

export const tempState = {waitingImage: []}

const simpleImageUploadHandler = (image: File) => {
  // console.log(image);
  const ext = image.name.substring(image.name.indexOf('.'))
  const url = URL.createObjectURL(image)
  console.log(url)
  const pos = url.lastIndexOf('/');
  const fileName = url.substring(pos + 1);

  const newFile = new File([image], fileName + ext, {type: image.type});
  console.log(newFile)
  tempState.waitingImage.push(newFile)
  return Promise.resolve(url);
};

export const ALL_PLUGINS = [
  toolbarPlugin({ toolbarContents: () => <CustomToolbar /> }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4, 5, 6] }),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin({
    imageUploadHandler: simpleImageUploadHandler,
    imageAutocompleteSuggestions: [
      "https://picsum.photos/200/300",
      "https://picsum.photos/200",
    ],
  }),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: "JavaScript",
      css: "CSS",
      txt: "text",
      tsx: "TypeScript",
    },
  }),
  directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
  diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
  markdownShortcutPlugin(),
];
