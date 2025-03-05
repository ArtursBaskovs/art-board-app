import { createContext, ReactNode, useContext, useState } from "react";

interface NoteBlock {
    id: string;
    className: string;
    value: string;
    posX: string;
    posY: string;
}

interface ToolsContextType {
    ideasFormVisibilityToggle: () => void;
    isFormVisible: boolean;
    noteBlocks: { [key: string]: NoteBlock }; 
    mutateNoteBlocksState: (arrayOfObjects: NoteBlock) => void;
    handleNoteInput: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

//undifiend bc context requires garanteed value
export const ToolsContext = createContext<ToolsContextType | null>(null);

//provider will containt each tool function to share with children components
export const ToolsProvider = ({ children }: { children: ReactNode }) => {
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    //object for generating note hmtl elements
    const [noteBlocks, setNoteBlocks] = useState<{[key: string]: NoteBlock}>({});

    const mutateNoteBlocksState = (object: NoteBlock) => {
        setNoteBlocks(prevBlocks => ({
            ...prevBlocks,
            [object.id]: object, 
        }));
    };
    const handleNoteInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {name, value} = event.target;
        //comments to help me to not be confused
        setNoteBlocks((prevObject) => ({
            ...prevObject, //whole object
            [name]: { //getting object under object by its key
                ...prevObject[name], //object under object
                value: value
            }
        }));
    }

    const ideasFormVisibilityToggle = () => {
        setIsFormVisible((prevVisibility) => !prevVisibility);
    };

    return (
        <ToolsContext.Provider value={{ ideasFormVisibilityToggle, isFormVisible, noteBlocks, mutateNoteBlocksState, handleNoteInput }}>
            {children}
        </ToolsContext.Provider>
    );
};

// hook is neaded to check context availability I guess. So i don`t need to do it every time I use context.
export const useTools = () => {
    const toolsContextHook = useContext(ToolsContext);

    if (!toolsContextHook) {
        throw new Error(
            "These components need to be inside ToolsContext provider to use useTools hook"
        );
    }

    return toolsContextHook;
};
