import React, { useEffect, useRef, useState } from "react";
import { useTools } from "./ToolsContext";
import { motion, useMotionValue } from "motion/react"

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
    const dotTopLeft = useRef<HTMLButtonElement | null>(null);
    const startingPos = useRef({ x: '', y: '' });

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

    //updates position data on click and after click release
    const updateNoteData = (event: React.MouseEvent<HTMLElement>) => {
        const {posX, posY} = getCurrentElementPosition(event);
        const currentDivKey = event.currentTarget.id;
        
        const updatedObj = {...noteBlocks};
        const currentObjByKey = updatedObj[currentDivKey];

        currentObjByKey.posX = posX;
        currentObjByKey.posY = posY;
        
        mutateNoteBlocksState(currentObjByKey);
        //console.log(posX + "<=x y=>" + posY);
        console.log(noteBlocks); 
    }

    const handleBoardDrag = (event: React.MouseEvent<HTMLElement>) => {
        const {posX, posY} = getCurrentElementPosition(event);
    }


    const getBoardSize = () => {
        const board = refBoard.current;
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
                height: 220,
                width: 220
            });
            temporaryData.current = null;
        }
        //console.log(noteBlocks);
    }

    const removeBlock = (id: string, className: string) => {
        if(className == noteBlocks[id].className && noteBlocks[id]) {
            console.log("will remove block with id:", id, " which class is", className);
            mutateNoteBlocksState(noteBlocks[id], 'remove');
        }
    }
    const blockSizePositionUpdate = (
        blockID: string,
        { posX, posY, height, width }: { 
            posX?: string, 
            posY?: string, 
            height?: number, 
            width?: number 
        }
      ) => {
        const currentElementKey = blockID;
        
        const updatedObj = {...noteBlocks};
        const currentObjByKey = {...updatedObj[currentElementKey]};
       
        if(posX !== undefined) currentObjByKey.posX = posX;
        if(posY !== undefined) currentObjByKey.posY = posY; 
        if(height !== undefined) currentObjByKey.height = height;
        if(width !== undefined) currentObjByKey.width = width;

        mutateNoteBlocksState(currentObjByKey);
        //console.log("new posY:", posY, " w:", width);
    }
    //handles dot drags on resizible block
    const handleDrag = React.useCallback(
      (blockID: string, dragSide: string, blockHeight: number, blockWidth: number, posX: string, posY: string,
      event: MouseEvent | TouchEvent | PointerEvent, 
      info: { delta: { x: number; y: number } }
    ) => {
        
        //let newHeight = blockHeight + info.delta.y;
        let newHeight = blockHeight; 
        let newY = parseFloat(posY);
        let newX = parseFloat(posX);
        let newWidth = blockWidth;
        //change position and size depending on which button is dragged
        if(dragSide == 'top') {
            newHeight = newHeight - info.delta.y; 
            newY = newY + info.delta.y;
            blockSizePositionUpdate(blockID, {height: newHeight, posY: `${newY}`});
        }
        if(dragSide == 'bottom') {
            newHeight = newHeight + info.delta.y; 
            //newY = newY + info.delta.y;
            blockSizePositionUpdate(blockID, {height: newHeight});
        }
        if(dragSide == 'right') {
            newWidth = newWidth + info.delta.x;
            blockSizePositionUpdate(blockID, {width: newWidth});
        }
        if(dragSide == 'left') {
            newWidth = newWidth - info.delta.x;
            newX = newX + info.delta.x;
            blockSizePositionUpdate(blockID, {width: newWidth, posX: `${newX}`});
        }
        
    }, [noteBlocks]);

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
                            layout
                            key={note.id}
                            id={note.id}
                            className={`${note.className} has-tools`} 
                            //initial={{ x: Number(note.posX), y: Number(note.posY) }}
                            animate={{ x: Number(note.posX), y: Number(note.posY)}} 
                            transition={{
                                type: "tween", duration: 0,
                                layout: { duration: 0} 
                              }}
                            style={{ width: note.width, height: note.height }}
                            onMouseDown={(event) => updateNoteData(event)}
                            onMouseUp={(event) => updateNoteData(event)}
                        >
                            <motion.div 
                                className="resizible" 
                                //animate={{width: 220, height: note.height}}
                                //transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <motion.button 
                                    className="corner-dot top" 
                                    drag='y'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(note.id, "top", note.height, note.width, note.posX, note.posY, event, info)}
                                >
                                </motion.button>
                                <motion.button 
                                    className="corner-dot right"
                                    drag='x'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(note.id, "right", note.height, note.width, note.posX, note.posY, event, info)}
                                >    
                                </motion.button>
                                <motion.button 
                                    className="corner-dot bottom" 
                                    drag='y'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(note.id, "bottom", note.height, note.width, note.posX, note.posY, event, info)}
                                >
                                </motion.button>
                                <motion.button 
                                    className="corner-dot left"
                                    drag='x'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(note.id, "left", note.height, note.width, note.posX, note.posY, event, info)}
                                >
                                </motion.button>

                                <div className="block-tool-container">
                                    <button onClick={() => removeBlock(note.id, note.className)}>X</button>
                                </div>
                                <div className="block-content">
                                    <textarea
                                        style={{height: note.height - 70}} 
                                        name={note.id}
                                        value={note.value}
                                        onChange={handleNoteInput}
                                    />
                                </div>
                            </motion.div>


                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
export default Board;