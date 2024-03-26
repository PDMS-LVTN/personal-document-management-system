type SimpleData = { id: string; title: string; childNotes?: SimpleData[] };

export class SimpleTree<T extends SimpleData> {
    root: SimpleNode<T>;
    constructor(data: T[]) {
        this.root = createRoot<T>(data);
    }

    get data() {
        return this.root.childNotes?.map((node) => node.data) ?? [];
    }

    create(args: { parentId: string | null; index: number; data: T }) {
        const parent = args.parentId ? this.find(args.parentId) : this.root;
        if (!parent) return null;
        parent.addChild(args.data, args.index);
    }

    move(args: { id: string; parentId: string | null; index: number }) {
        const src = this.find(args.id);
        const parent = args.parentId ? this.find(args.parentId) : this.root;
        if (!src || !parent) return;
        parent.addChild(src.data, args.index);
        src.drop();
    }

    update(args: { id: string; changes: Partial<T> }) {
        const node = this.find(args.id);
        if (node) node.update(args.changes);
    }

    drop(args: { id: string }) {
        const node = this.find(args.id);
        if (node) node.drop();
    }

    find(id: string, node: SimpleNode<T> = this.root): SimpleNode<T> | null {
        if (!node) return null;
        if (node.id === id) return node as SimpleNode<T>;
        if (node.childNotes) {
            for (let child of node.childNotes) {
                const found = this.find(id, child);
                if (found) return found;
            }
            return null;
        }
        return null;
    }
}

function createRoot<T extends SimpleData>(data: T[]) {
    const root = new SimpleNode<T>({ id: "ROOT" } as T, null);
    root.childNotes = data.map((d) => createNode(d as T, root));
    return root;
}

function createNode<T extends SimpleData>(data: T, parent: SimpleNode<T>) {
    const node = new SimpleNode<T>(data, parent);
    if (data.childNotes)
        node.childNotes = data.childNotes.map((d) => createNode<T>(d as T, node));
    return node;
}

class SimpleNode<T extends SimpleData> {
    id: string;
    childNotes?: SimpleNode<T>[];
    constructor(public data: T, public parent: SimpleNode<T> | null) {
        this.id = data.id;
    }

    hasParent(): this is this & { parent: SimpleNode<T> } {
        return !!this.parent;
    }

    get childIndex(): number {
        return this.hasParent() ? this.parent.childNotes!.indexOf(this) : -1;
    }

    addChild(data: T, index: number) {
        const node = createNode(data, this);
        this.childNotes = this.childNotes ?? [];
        this.childNotes.splice(index, 0, node);
        this.data.childNotes = this.data.childNotes ?? [];
        this.data.childNotes.splice(index, 0, data);
    }

    removeChild(index: number) {
        this.childNotes?.splice(index, 1);
        this.data.childNotes?.splice(index, 1);
    }

    update(changes: Partial<T>) {
        if (this.hasParent()) {
            const i = this.childIndex;
            this.parent.addChild({ ...this.data, ...changes }, i);
            this.drop();
        }
    }

    drop() {
        if (this.hasParent()) this.parent.removeChild(this.childIndex);
    }
}