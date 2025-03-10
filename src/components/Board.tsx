import React, { useEffect, useRef, useState } from "react";
import { useTools } from "./ToolsContext";
import { motion } from "motion/react"

const Board: React.FC = () => {
    const {noteBlocks, handleNoteInput, mutateNoteBlocksState} = useTools();
    const constraintsRef = useRef(null);

    const getNewElementPosition = (event: React.MouseEvent<HTMLDivElement>) => {
        const currentElement = event.currentTarget;
        const styleTransformValue = window.getComputedStyle(currentElement).getPropertyValue("transform"); 
        const transformData = styleTransformValue.split(`,`);
        const posX = transformData[4].trim();
        const posY = transformData[5].replace("/)", "").trim();
        //console.log(posX + " " + posY);

        return {
            posX,
            posY
        }
    }

    const updateNoteData = (event: React.MouseEvent<HTMLDivElement>) => {
        const {posX, posY} = getNewElementPosition(event);
        const currentDivKey = event.currentTarget.id;
        //console.log(currentDivKey);
        const updatedObj = {...noteBlocks};
        const currentObjByKey = updatedObj[currentDivKey];

        currentObjByKey.posX = posX
        currentObjByKey.posY = posY;
        
        mutateNoteBlocksState(currentObjByKey);
        console.log(noteBlocks); 
    }



    
    return (
        <div className="board-container" ref={constraintsRef}>
            {Object.values(noteBlocks).map((note, index) => {
                //addToInputs(note.id, note.value);
                return (
                    <motion.div drag dragConstraints={constraintsRef} dragMomentum={false}
                        key={note.id}
                        id={note.id}
                        className={note.className} 
                        style={{position: "absolute", left: note.posX, top: note.posY}}
                        onMouseUp={(event) => updateNoteData(event)}
                    >
                        <textarea 
                            rows={10} 
                            name={note.id}
                            value={note.value}
                            onChange={handleNoteInput}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}
export default Board;