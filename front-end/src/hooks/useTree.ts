import { SimpleTree } from "@/lib/data/tree";
import { useMemo, useState } from "react";
import {
    CreateHandler,
    DeleteHandler,
    MoveHandler,
    RenameHandler,
} from "react-arborist";

export type SimpleTreeData = {
    id: string;
    title: string;
    childNotes?: SimpleTreeData[];
};

export function useTree<T>(initialData: T[], actions?) {
    const [data, setData] = useState(initialData);
    const tree = useMemo(
        () =>
            new SimpleTree<// @ts-ignore
                T>(data),
        [data]
    );

    const onMove: MoveHandler<T> = async (args: {
        dragIds: string[];
        parentId: null | string;
        index: number;
    }) => {
        for (const id of args.dragIds) {
            tree.move({ id, parentId: args.parentId, index: args.index });
        }
        setData(tree.data);
    };

    const onRename: RenameHandler<T> = ({ name, id }) => {
        tree.update({ id, changes: { title: name } as any });
        setData(tree.data);
    };

    const onCreate: CreateHandler<T> = async ({ parentId, index, type }) => {
        // const response = await actions.createNote(parentId)
        const id = parentId.split(',')[1]
        const title = parentId.split(',')[2]
        parentId = parentId.split(',')[0] === 'null' ? null : parentId.split(',')[0]
        console.log(id, title, parentId)
        const data = { id: id, title: title } as any;
        if (type === "internal") data.childNotes = [];
        tree.create({ parentId, index, data });
        setData(tree.data);
        return data;
    };

    const onDelete: DeleteHandler<T> = async (args: { ids: string[] }) => {
        args.ids.forEach((id) => tree.drop({ id }));
        setData(tree.data);
    };

    const controller = { onMove, onRename, onCreate, onDelete };

    return [data, setData, controller] as const;
}