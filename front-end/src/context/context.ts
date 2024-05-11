import { createContext } from 'react';

export const EditContext = createContext({
    editable: true,
    setEditable: (x: boolean) => { },
}
);