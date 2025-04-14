import React, { useEffect, useState } from "react";
import StickyNoteIcon from "../assets/images/StickyNoteIcon";
import ColorPaletteIcon from "../assets/images/ColorPaletteIcon";
import PencilIcon from "../assets/images/PencilIcon";
import ImageIcon from "../assets/images/ImageIcon";
import TextIcon from "../assets/images/TextIcon";
import CursorIcon from "../assets/images/CursorIcon";
import { useTools } from "./ToolsContext";
import SearchIcon from "../assets/images/SearchIcon";



const Tools: React.FC = () => {

    //tools context imports | Завтра вспомни че это и эту фигню используй в форме с другим импортом для скрытия и показвания
    const {toolIsActive, setToolIsActive, switchToolButtonsActivity, ideasFormVisibilityToggle, cursors, currentCursor, toolCursorHandler, isFormVisible} = useTools();

    const toolButtonHandler = (buttonName: string) => {
        const toolsKeys = Object.keys(toolIsActive);
        if (!toolsKeys.includes(buttonName)) {
            console.warn(buttonName + " does not exist list of tools");
            return;
        }
        switchToolButtonsActivity(buttonName);
        const localIsToolActive = !toolIsActive[buttonName]; //use state async nature does not allow me to use updated value further in this function

        //changing cursor depending on whick tool is activating or deactivating by one of tool button
        /* I was checking if values are correct
        const keyOfThisToolCursor = Object.keys(cursors).find(key => cursors[key] == buttonName);
        console.log(toolIsActive[buttonName]);
        console.log("cursor for this tool is " + keyOfThisToolCursor + " its path is " + cursors[`${buttonName}`] + " it is active? - " + localIsToolActive);
        */
        if(localIsToolActive && cursors[buttonName]) {
            toolCursorHandler(cursors[buttonName]);
        } else {
            toolCursorHandler(cursors.default);
            console.log(cursors.default);
        }
    }



    return (
        <div className="tools-container">
            <button className={`icon-btn active-${toolIsActive.generateIdea}`}
            onClick={() => {
                ideasFormVisibilityToggle(!isFormVisible); 
                toolButtonHandler('generateIdea');
            }}>
                <SearchIcon />
            </button>

            <button className={`icon-btn ${toolIsActive}`}
                onClick={() => {
                    toolButtonHandler('prencil');
                }}>
                <PencilIcon />
            </button>

            <button className={`icon-btn active-${toolIsActive.defaultPointer}`}
                onClick={() => {
                    toolButtonHandler('defaultPointer');
                }}>
                🦶
            </button>

            <button className={`icon-btn active-${toolIsActive.note}`}
                onClick={() => {
                    toolButtonHandler('note');
                }}>
                <StickyNoteIcon />
            </button>

            <button className={`icon-btn ${toolIsActive}`}
                onClick={() => {
                    toolButtonHandler('text');
                }}>
                <TextIcon />
            </button>

            <button className={`icon-btn active-${toolIsActive.image}`}
                onClick={() => {
                   toolButtonHandler('image');
                }}>
                <ImageIcon />
            </button>

            <button className={`icon-btn ${toolIsActive}`}
                onClick={() => {
                    toolButtonHandler('select');
                }}>
                <CursorIcon />
            </button>
        </div>
    )
}

export default Tools;