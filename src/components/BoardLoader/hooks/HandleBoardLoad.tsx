import { useTools } from "../../ToolsContext";
import { useState } from "react";



export type BoardData = {
    boardName: string;
    images: {};
    notes: {};
};
export const useloadBoardData = () => {
    const {setNoteBlocks, setImageBlocks} = useTools();
    
    //populates states from useTools that containes notes, images or other type of html blocks, then it can be rendered in Board component
    const loadBoardData = (jsonData: BoardData) => {
        if (jsonData.notes) {
        setNoteBlocks(jsonData.notes);
        } else {
        console.warn("No notes found in", jsonData.boardName, ".json");
        }

        if (jsonData.images) {
        setImageBlocks(jsonData.images);
        } else {
        console.warn("No images found in", jsonData.boardName, ".json");
        }
    };

    return loadBoardData;

}

