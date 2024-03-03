import Image from '@tiptap/extension-image'

const CustomImage = Image.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            levels: [1, 2, 3],
        }
    },
})

export { CustomImage }