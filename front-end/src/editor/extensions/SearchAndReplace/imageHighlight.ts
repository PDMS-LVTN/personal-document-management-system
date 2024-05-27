import { Extension, Range } from "@tiptap/core";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import {
    Plugin,
    PluginKey,
} from "@tiptap/pm/state";
import { Node as PMNode } from "@tiptap/pm/model";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        imageHighlight: {
            setHighlightedImage: (searchTerm: string[]) => ReturnType;
        };
    }
}

interface ProcessedSearches {
    decorationsToReturn: DecorationSet;
    results: Range[];
}

function sourceIncludeId(src: string, ids: string[]) {
    for (const id of ids) {
        if (src.includes(id)) {
            return true
        }

    }

    return false
}

function processSearches(
    doc: PMNode,
    searchTerm: string[],
    searchResultClass: string,
): ProcessedSearches {
    const decorations: Decoration[] = [];
    const results: Range[] = [];

    if (!searchTerm || searchTerm.length == 0) {
        return {
            decorationsToReturn: DecorationSet.empty,
            results: [],
        };
    }

    doc?.forEach((node, offset) => {
        if (node.type.name === 'imageBlock' && sourceIncludeId(node.attrs.src, searchTerm)) {
            results.push({ from: offset, to: offset + node.nodeSize })
        }
    });

    for (let i = 0; i < results.length; i += 1) {
        const r = results[i];
        const className = searchResultClass;
        const decoration: Decoration = Decoration.node(r.from, r.to, {
            class: className,
        });

        decorations.push(decoration);
    }

    // console.log(results)

    return {
        decorationsToReturn: DecorationSet.create(doc, decorations),
        results,
    };

}

export interface ImageHighlightOption {
    searchResultClass: string;
}

export interface ImageHighlightStorage {
    searchTerm: string[];
    results: Range[];
}

export const imageHighlightPluginKey = new PluginKey(
    "imageHighlightPlugin",
);

export const ImageHighlight = Extension.create<
    ImageHighlightOption,
    ImageHighlightStorage
>({
    name: "imageHighlight",

    addOptions() {
        return {
            searchResultClass: "search-result",
        };
    },

    addStorage() {
        return {
            searchTerm: [],
            results: [],
        };
    },

    addCommands() {
        return {
            setHighlightedImage:
                (searchTerm: string[]) =>
                    ({ editor }) => {
                        editor.storage.imageHighlight.searchTerm = searchTerm;

                        return false;
                    },
        };
    },

    addProseMirrorPlugins() {
        const editor = this.editor;
        const { searchResultClass } = this.options;

        return [
            new Plugin({
                key: imageHighlightPluginKey,
                state: {
                    init: () => DecorationSet.empty,
                    apply({ doc }) {
                        const {
                            searchTerm,
                        } = editor.storage.imageHighlight;

                        if (!searchTerm || searchTerm.length == 0) {
                            editor.storage.imageHighlight.results = [];
                            return DecorationSet.empty;
                        }

                        const { decorationsToReturn, results } = processSearches(
                            doc,
                            searchTerm,
                            searchResultClass,
                        );

                        editor.storage.imageHighlight.results = results;

                        return decorationsToReturn;
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                },
            }),
        ];
    },
});

export default ImageHighlight;