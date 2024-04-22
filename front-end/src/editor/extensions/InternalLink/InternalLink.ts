import Mention from '@tiptap/extension-mention'
import { ReactNodeViewRenderer } from '@tiptap/react'
import LinkView from './LinkView'

export const InternalLink = Mention.extend({
    addNodeView() {
        return ReactNodeViewRenderer(LinkView)
    },
})

export default InternalLink
