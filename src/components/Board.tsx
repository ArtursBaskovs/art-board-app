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
    const {noteBlocks, handleNoteInput, mutateNoteBlocksState, getCurrentElementPosition, currentCursor, noteTool} = useTools();
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
    //it was useless, maybe I will find usage later
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
                //passing not unsable arguments, because on second function call i don`t need them, I have stored what needed in reference var
                onClick={() => noteTool({ id: "9999", className: "notNote", value: "", posX: '10', posY: '10' })} 
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