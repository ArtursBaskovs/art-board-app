import React, { useEffect, useRef, useState } from "react";
import { useTools } from "./ToolsContext";
import { motion } from "motion/react"

interface Padding {
    top: number,
    right: number,
    bottom: number,
    left: number
}
const Board: React.FC = () => {
    const {noteBlocks, handleNoteInput, mutateNoteBlocksState} = useTools();
    const constraintsRef = useRef(null);
    const [xPositionOffset, setXPositionOffset] = useState<number | null>(null);
    const [yPositionOffset, setYPositionOffset] = useState<number | null>(null);
    const [boardPadding, setBoardPadding] = useState<Padding>({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    });

    const getElementPosition = (event: React.MouseEvent<HTMLDivElement>) => {
        const currentElement = event.currentTarget;
        const styleTransformValue = window.getComputedStyle(currentElement).getPropertyValue("transform"); 
        const transformData = styleTransformValue.split(`,`);
        const posX = transformData[4].trim();
        const posY = transformData[5].replace(")", "").trim();
        //console.log(posX + " " + posY);

        return {
            posX,
            posY
        }
    }

    const updateNoteData = (event: React.MouseEvent<HTMLDivElement>) => {
        const {posX, posY} = getElementPosition(event);
        const currentDivKey = event.currentTarget.id;
        //console.log(currentDivKey);
        const updatedObj = {...noteBlocks};
        const currentObjByKey = updatedObj[currentDivKey];

        currentObjByKey.posX = posX;
        currentObjByKey.posY = posY;
        
        mutateNoteBlocksState(currentObjByKey);
        console.log(noteBlocks); 
    }

    const expandBoard = (posX: string, posY:string) => {
        //console.log(posY)
        const x: number = +posX;
        const y: number = +posY;
        //left and right padding changhe when dragging further than before to left or right
        if(x > 0 && x > boardPadding.left) {
            setBoardPadding(prevPadding => ({
                ...prevPadding, 
                left: x
            }));
            //console.log('+ ' + boardPadding.left)
        }
        
        if(x < 0 && x < boardPadding.right) {
            setBoardPadding(prevPadding => ({
                ...prevPadding, 
                right: x
            }));
            //console.log('- ' + boardPadding.right)
        }
        //top and bottom padding changhe when dragging further than before to top or bottom
        if(y > 0 && y > boardPadding.top) {
            setBoardPadding(prevPadding => ({
                ...prevPadding, 
                top: y
            }));
            console.log('+ ' + boardPadding.top)
        }
        if(y < 0 && y < boardPadding.bottom) {
            setBoardPadding(prevPadding => ({
                ...prevPadding, 
                bottom: y
            }));
            console.log('- ' + boardPadding.bottom)
        }
        
        
    }
    const handleBoardDrag = (event: React.MouseEvent<HTMLDivElement>) => {
        const {posX, posY} = getElementPosition(event);

        expandBoard(posX, posY);
    }
//почему-то не меняется падинг в стиле, только один раз, потом разберусь
    
    return (
        <motion.div 
            drag className="board-container" 
            dragMomentum={false} 
            ref={constraintsRef}
            onMouseUp={(event) => handleBoardDrag(event)}
            style={{
                padding: `${boardPadding.top}px ${boardPadding.right}px ${boardPadding.bottom}px ${boardPadding.left}px`
            }}
        >
${boardPadding.top}

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
        </motion.div>
    );
}
export default Board;