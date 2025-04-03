import { createContext, ReactNode, useContext, useRef, useState } from "react";
import cursors from "../assets/cursors/note.svg";
interface htmlBlock {
    id: string;
    className: string;
    value: string;
    posX: string;
    posY: string;
    height: number;
    width: number;
}

interface ToolsContextType {
    ideasFormVisibilityToggle: (isVisible: boolean) => void;
    isFormVisible: boolean;
    noteBlocks: { [key: string]: htmlBlock }; 
    mutateNoteBlocksState: (arrayOfObjects: htmlBlock, doWhat?: "remove") => void;
    handleNoteInput: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    getCurrentElementPosition: (event: React.MouseEvent<HTMLElement>) => {posX: string, posY: string};
    currentCursor: string;
    toolCursorHandler: (toolName: string) => void;
    cursors: Record<string, string>;
    noteTool: (arrayOfObjects: htmlBlock) => void;
    temporaryData: React.MutableRefObject<htmlBlock | null>;
}

//undifiend bc context requires garanteed value
export const ToolsContext = createContext<ToolsContextType | null>(null);

//provider will containt each tool function to share with children components
export const ToolsProvider = ({ children }: { children: ReactNode }) => {
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    //object for generating note hmtl elements
    const [noteBlocks, setNoteBlocks] = useState<{[key: string]: htmlBlock}>({});
    const cursors: Record<string, string> = {
        default: '/def.svg',
        note: '/cursors/note.svg',
    };
    const [currentCursor, setCurrentCursor] = useState<string>(cursors.default);
    const temporaryData = useRef<htmlBlock | null>(null);

    //will add new object by default
    const mutateNoteBlocksState = (object: htmlBlock, doWhat?: "remove") => {
        if (doWhat === "remove") {
            const updBlocks = { ...noteBlocks };
            delete updBlocks[object.id];
            setNoteBlocks(updBlocks);
            return;
        }
        if (doWhat === "edit") {
            
        }
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

    const ideasFormVisibilityToggle = (isVisible: boolean) => {
        //setIsFormVisible((prevVisibility) => !prevVisibility);
        setIsFormVisible((prevVisibility) => isVisible);
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
    }

    
    //creates note with data it recieves after click on board
    const noteTool = (object: htmlBlock) => {
        //when note is created with ideas form
        if(currentCursor != cursors.note) temporaryData.current = object; //store temporary data for second call of this function
        if(currentCursor == cursors.note && temporaryData.current != null) { //second call after cursor becomes note tool
            mutateNoteBlocksState(temporaryData.current);
            setCurrentCursor(cursors.default);
            //temporaryData.current = {};
        }
        //when note is created using only note tool
        if(currentCursor == cursors.note && temporaryData.current == null) {
            console.log("TRYING note tool", object);
            mutateNoteBlocksState(object);
        }
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
            noteTool,
            temporaryData
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
