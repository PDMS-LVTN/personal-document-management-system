import { tippy } from "@tippyjs/react";
import MentionList from "./MentionList.jsx";
import { ReactRenderer } from "@tiptap/react";
import { useAuthentication } from "@/store/useAuth.js";
import { APIEndPoints } from "@/api/endpoint.js";
import { useApi } from "@/hooks/useApi.js";
import { AxiosRequestConfig } from "axios";
import { useApp } from "@/store/useApp.js";
import { MentionPluginKey } from "@tiptap/extension-mention";

// TODO: alternative text
// TODO: delete linked notes
export const useSuggestion = () => {
  const callApi = useApi();
  const suggestion = {
    char: '@',
    pluginKey: MentionPluginKey,
    //  command?: (props: { editor: Editor; range: Range; props: I }) => void
    command: ({ editor, range, props }) => {
      // increase range.to by one when the next node is of type "text"
      // and starts with a space character
      const nodeAfter = editor.view.state.selection.$to.nodeAfter
      const overrideSpace = nodeAfter?.text?.startsWith(' ')

      if (overrideSpace) {
        range.to += 1
      }
      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: 'mention',
            attrs: props,
          },
          {
            type: 'text',
            text: ' ',
          },
        ])
        .run()

      window.getSelection()?.collapseToEnd()

      const options: AxiosRequestConfig = {
        method: "POST",
        data: { backlink_id: useApp.getState().currentNote.id },
      };
      callApi(`${APIEndPoints.INTERNAL_LINK}/${props.id}`, options);
    },
    allow: ({ state, range }) => {
      const $from = state.doc.resolve(range.from)
      const type = state.schema.nodes['mention']
      const allow = !!$from.parent.type.contentMatch.matchType(type)

      return allow
    },
    // TODO: use debounce
    items: async ({ query }) => {
      const options: AxiosRequestConfig = {
        method: "POST",
        data: { user_id: useAuthentication.getState().auth.id, onlyTitle: true, keyword: query },
      };
      const { responseData } = await callApi(APIEndPoints.FILTER, options);
      return responseData
    },


    render: () => {
      let component;
      let popup;

      return {
        onStart: (props) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },

        onUpdate(props) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === "Escape") {
            popup[0].hide();

            return true;
          }

          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    }
  }

  return suggestion
}
