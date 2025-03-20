import { createContext, ReactNode, useContext, useRef, useState } from "react";
import cursors from "../assets/cursors/note.svg";
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
    getCurrentElementPosition: (event: React.MouseEvent<HTMLElement>) => {posX: string, posY: string};
    currentCursor: string;
    toolCursorHandler: (toolName: string) => void;
    cursors: Record<string, string>;
    noteTool: (arrayOfObjects: NoteBlock) => void;
}

//undifiend bc context requires garanteed value
export const ToolsContext = createContext<ToolsContextType | null>(null);

//provider will containt each tool function to share with children components
export const ToolsProvider = ({ children }: { children: ReactNode }) => {
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    //object for generating note hmtl elements
    const [noteBlocks, setNoteBlocks] = useState<{[key: string]: NoteBlock}>({});
    const cursors: Record<string, string> = {
        default: '/def.svg',
        note: '/cursors/note.svg',
    };
    const [currentCursor, setCurrentCursor] = useState<string>(cursors.default);
    const temporaryData = useRef<any>(null);
    
    const mutateNoteBlocksState = (object: NoteBlock) => {
        setNoteBlocks(prevBlocks => ({
            ...prevBlocks,
            [object.id]: object, //object key is same with object id prop. So specify target object by id prop inside it
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

    const getCurrentElementPosition = (event: React.MouseEvent<HTMLElement>) => {
        const currentElement = event.currentTarget;
        const styleTransformValue = window.getComputedStyle(currentElement).getPropertyValue("transform"); 
        const transformData = styleTransformValue.split(`,`);

        if (transformData.length < 6) return { posX: "0", posY: "0" }; //to avoid error with trim undifiend data or something like that
        const posX = transformData[4].trim();
        const posY = transformData[5].replace(")", "").trim();

        return {
            posX,
            posY
        }
    }
    
    //section where cursor changes depending of selected tool. 
    // Then i get clicking position to place generated object where clicked
    const toolCursorHandler = (toolName: string) => {
        console.log(toolName);
        setCurrentCursor(toolName);
        if(toolName != cursors.default) {
            getClickPosition();
        }
    }
    //creates note with data it recieves after click on board
    const noteTool = (object: NoteBlock) => {
        if(currentCursor != cursors.note) temporaryData.current = object; //store temporary data for second call of this function
        if(currentCursor == cursors.note) {
            getClickPosition(); //position where clicked on board
            mutateNoteBlocksState(temporaryData.current);
            setCurrentCursor(cursors.default);
        }
    }
    const getClickPosition = () => {

    }

    return (
        <ToolsContext.Provider value={{ 
            ideasFormVisibilityToggle, 
            isFormVisible, 
            noteBlocks, 
            mutateNoteBlocksState, 
            handleNoteInput,
            getCurrentElementPosition,
            toolCursorHandler,
            currentCursor,
            cursors,
            noteTool
        }}>
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
