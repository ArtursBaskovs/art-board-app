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
    const {
        noteBlocks, 
        handleNoteInput,
        mutateNoteBlocksState,
        getCurrentElementPosition,
        currentCursor,
        noteTool,
        temporaryData
    } = useTools();
    const refBoard = useRef<HTMLDivElement | null>(null);
    const refField = useRef<HTMLDivElement | null>(null);
    const [xPositionOffset, setXPositionOffset] = useState<number | null>(null);
    const [yPositionOffset, setYPositionOffset] = useState<number | null>(null);
    const [boardPadding, setBoardPadding] = useState<Padding>({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    });

    useEffect(() => {
        const board = document.getElementById("board1");
        if (board) {
            board.scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "center",
          });
        }
      }, []);


    const updateNoteData = (event: React.MouseEvent<HTMLElement>) => {
        const {posX, posY} = getCurrentElementPosition(event);
        const currentDivKey = event.currentTarget.id;
        
        const updatedObj = {...noteBlocks};
        const currentObjByKey = updatedObj[currentDivKey];

        currentObjByKey.posX = posX;
        currentObjByKey.posY = posY;
        
        mutateNoteBlocksState(currentObjByKey);
        //console.log(posX + "<=x y=>" + posY);
        //console.log(noteBlocks); 
    }

    const handleBoardDrag = (event: React.MouseEvent<HTMLElement>) => {
        const {posX, posY} = getCurrentElementPosition(event);
    }


    const getBoardSize = () => {
        const board = refBoard.current;
        let width = "";
        let height = "";
        if (board) {
            const width = window.getComputedStyle(board).getPropertyValue("width"); 
            const height = window.getComputedStyle(board).getPropertyValue("height"); 
            return {
                width,
                height
            };
        }
        return { width: 0, height: 0 }; 
    }
    const updateContraintFieldSize = () => {
        const {width, height} = getBoardSize();
        const expandBy = 2;
        const expandWidth = parseInt(String(width), 10) * expandBy;
        const expandHeight = parseInt(String(height), 10) * expandBy;
        const field = refField.current;
        if (field) {
            field.style.width = `${expandWidth}px`; 
            field.style.height = `${expandHeight}px`;
        }
    }
    //maybe add button to expand board later
    useEffect(() => {
        updateContraintFieldSize();
    }, []);

    const handleToolClickOnBoard = (event: React.MouseEvent<HTMLElement>) => {
        const posX = event.nativeEvent.offsetX;
        const posY = event.nativeEvent.offsetY;
        //I get temporary data only when I create note from ideasForm
        //console.log('temporaryData.current type:', typeof temporaryData, " its "+ temporaryData );
        if (temporaryData.current && typeof temporaryData.current === 'object' && 'id' in temporaryData.current) { 
            temporaryData.current = {
                ...temporaryData.current,
                posX: `${posX}`,
                posY: `${posY}`,
            };
            console.log("temporaryData.current before check:", temporaryData.current);
            console.log("Does it have an ID?", temporaryData.current?.id);
            noteTool(temporaryData.current); 
            temporaryData.current = null;

        } else {
            const objectCount = Object.values(noteBlocks).length + 1;
            const objName = `${objectCount}nd_note`;

            noteTool({
                id: objName,
                className: 'note-block',
                value: '',
                posX: `${posX}`,
                posY: `${posY}`,
            });
            temporaryData.current = null;
        }
        console.log(noteBlocks);
    }

    return (
        <div 
            className="contraint-field" ref={refField}
            style={{ cursor: `url(${currentCursor}) 16 16, auto` }}
        >
            <motion.div 
                id="board1"
                drag className="board-container" 
                dragMomentum={false} 
                dragConstraints={refField}
                ref={refBoard}
                onMouseUp={(event) => handleBoardDrag(event)}
                onClick={(event) => handleToolClickOnBoard(event)} 
            >
                

                {Object.values(noteBlocks).map((note, index) => {
                    //addToInputs(note.id, note.value);
                    return (
                        <motion.div drag dragConstraints={refBoard} dragMomentum={false}
                            key={note.id}
                            id={note.id}
                            className={note.className} 
                            initial={{ x: Number(note.posX), y: Number(note.posY) }}
                            onMouseDown={(event) => updateNoteData(event)}
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
        </div>
    );
}
export default Board;