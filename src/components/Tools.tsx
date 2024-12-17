import React from "react";
import StickyNoteIcon from "../assets/images/StickyNoteIcon";
import ColorPaletteIcon from "../assets/images/ColorPaletteIcon";
import PencilIcon from "../assets/images/PencilIcon";
import ImageIcon from "../assets/images/ImageIcon";
import TextIcon from "../assets/images/TextIcon";
import CursorIcon from "../assets/images/CursorIcon";




const Tools: React.FC = () => {
    return (
        <div className="tools-container">
            <button className="icon-btn">
                <PencilIcon />
            </button>

            <button className="icon-btn">
                <ColorPaletteIcon />
            </button>

            <button className="icon-btn">
                <StickyNoteIcon />
            </button>

            <button className="icon-btn">
                <TextIcon />
            </button>

            <button className="icon-btn">
                <ImageIcon />
            </button>

            <button className="icon-btn">
                <CursorIcon />
            </button>
        </div>
    )
}

export default Tools;