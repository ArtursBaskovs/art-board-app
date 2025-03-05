import React, { useEffect, useState } from "react";
import { useTools } from "./ToolsContext";


const Board: React.FC = () => {
    const {noteBlocks, handleNoteInput} = useTools();

    //then handling
    return (
        <div className="board-container">
            {Object.values(noteBlocks).map((note, index) => {
                //addToInputs(note.id, note.value);
                return (
                    <div 
                        key={note.id}
                        className={note.className} 
                        style={{position: "absolute", left: note.posX, top: note.posY}}
                    >
                        <textarea 
                            rows={10} 
                            name={note.id}
                            value={note.value}
                            onChange={handleNoteInput}
                        />
                    </div>
                );
            })}
        </div>
    );
}
export default Board;