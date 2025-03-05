import React, { useState } from "react";
import StickyNoteIcon from "../assets/images/StickyNoteIcon";
import ColorPaletteIcon from "../assets/images/ColorPaletteIcon";
import PencilIcon from "../assets/images/PencilIcon";
import ImageIcon from "../assets/images/ImageIcon";
import TextIcon from "../assets/images/TextIcon";
import CursorIcon from "../assets/images/CursorIcon";
import { useTools } from "./ToolsContext";
import SearchIcon from "../assets/images/SearchIcon";



const Tools: React.FC = () => {
    const [toolIsActive, setToolIsActive] = useState<{
        [key: string]: boolean;
    }>({
        generateIdea: false
    });
    //tools context imports | Завтра вспомни че это и эту фигню используй в форме с другим импортом для скрытия и показвания
    const {ideasFormVisibilityToggle} = useTools();

    const toolButtonHandler = (buttonName: string) => {
        const toolsKeys = Object.keys(toolIsActive);
        if (!toolsKeys.includes(buttonName)) {
            console.warn(buttonName + " does not exist list of tools");
            return;
        }

        setToolIsActive(prevObject => ({
            ...prevObject,
            [buttonName]: !prevObject[buttonName], 
        }))
        console.log(toolIsActive[buttonName]);

    }

    return (
        <div className="tools-container">
            <button className={`icon-btn active-${toolIsActive.generateIdea}`}
            onClick={() => {
                ideasFormVisibilityToggle(); 
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

            <button className={`icon-btn ${toolIsActive}`}
                onClick={() => {
                    toolButtonHandler('move');
                }}>
                🦶
            </button>

            <button className={`icon-btn ${toolIsActive}`}
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

            <button className={`icon-btn ${toolIsActive}`}
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