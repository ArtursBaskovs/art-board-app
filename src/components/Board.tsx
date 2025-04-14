import React, { useEffect, useRef, useState } from "react";
import { useTools } from "./ToolsContext";
import { motion, useMotionValue } from "motion/react"
import ImageLinkForm from "./ImageLinkForm";

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
        temporaryData,
        cursors,
        imageBlocks,
        mutateImageBlockState,
        imageTool,
        toolIsActive, 
        setToolIsActive, 
        switchToolButtonsActivity,
        toolCursorHandler
    } = useTools();
    const refBoard = useRef<HTMLDivElement | null>(null);
    const refField = useRef<HTMLDivElement | null>(null);
    const dotTopLeft = useRef<HTMLButtonElement | null>(null);
    const startingPos = useRef({ x: '', y: '' });
    const [isWaitingLink, setIsWaitingLink] = useState(false);
    const [isLinkFormVisible, setIsLinkFromVisible] = useState(false);
    const [link, setLink] = useState("");
    const [isLinkRecieved, setIsLinkRecieved] = useState(false);
    const isLinkRecievedRef = useRef<boolean>(false);
    const [imgPosX, setImgPosX] = useState<number | null>(null);
    const [imgPosY, setImgPosY] = useState<number | null>(null);

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
    const updateBlockData = (event: React.MouseEvent<HTMLElement>, blockType: string) => {
        const {posX, posY} = getCurrentElementPosition(event);
        const currentDivKey = event.currentTarget.id;
        
        let updatedObj: typeof noteBlocks | undefined; //type of any blocks, images or note are the same
        if(blockType == "note") updatedObj = {...noteBlocks};
        if(blockType == "image") updatedObj = {...imageBlocks};

        if(!updatedObj) {
            console.log("Got no object: ", updatedObj);
            return;
        }
        const currentObjByKey = updatedObj[currentDivKey];

        currentObjByKey.posX = posX;
        currentObjByKey.posY = posY;
        
        if(currentObjByKey.type == "note") mutateNoteBlocksState(currentObjByKey);
        if(currentObjByKey.type == "image") mutateImageBlockState(currentObjByKey);
        //console.log(posX + "<=x y=>" + posY);
        console.log(imageBlocks); 
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
        
        
        if(currentCursor == cursors.note) {
            placeNote(posX, posY);
            switchToolButtonsActivity('defaultPointer');
            toolCursorHandler(cursors['default']);
        };

        if(currentCursor == cursors.image) { 
            //wait before recieve a link. Will be resolved in useEffect
            console.log(posX, posY);
            setImgPosX(posX);
            setImgPosY(posY);
            setIsLinkFromVisible(true);
            toolCursorHandler(cursors['default']);
            
        }
        //console.log(noteBlocks);
    }
    useEffect(() => {
        if (isLinkRecieved && imgPosX !== null && imgPosY !== null) {
            placeImage(imgPosX, imgPosY);  
            setIsLinkRecieved(false);
        }
    }, [isLinkRecieved, imgPosX, imgPosY]);  
    const handleLinkFormSubmit = (postedLink: string) => {
        setIsLinkFromVisible(false); 
        setLink(postedLink);
        setIsLinkRecieved(true);
    }
    const handleLinkFormCancel = () => {
        setIsLinkFromVisible(false);
        switchToolButtonsActivity('defaultPointer');
    }


    const placeNote = (posX: number, posY: number) => {
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
            //object name based on length for unique key
            const objectCount = Object.values(noteBlocks).length + 1;
            const objName = `${objectCount}nd_note`;

            noteTool({
                id: objName,
                className: 'note-block',
                value: '',
                posX: `${posX}`,
                posY: `${posY}`,
                height: 220,
                width: 220,
                link: "",
                type: "note"
            });
            temporaryData.current = null;
        }
        //console.log(noteBlocks);
    }
    
    const placeImage = (posX: number, posY: number) => {
        const objectCount = Object.values(imageBlocks).length + 1;
        const objName = `${objectCount}nd_image`;
        console.log("placed and image", posX, posY, )
        imageTool({
            id: objName,
            className: 'image-block',
            value: '',
            posX: `${posX}`,
            posY: `${posY}`,
            height: 320,
            width: 320,
            link: `${link}`,
            type: "image"
        })

    }

    const removeBlock = (id: string, className: string) => {
        if(className == noteBlocks[id].className && noteBlocks[id]) {
            console.log("will remove block with id:", id, " which class is", className);
            mutateNoteBlocksState(noteBlocks[id], 'remove');
        }
    }
    const blockSizePositionUpdate = (
        blockID: string,
        objectOfBlocks: typeof noteBlocks,
        { posX, posY, height, width }: { 
            posX?: string, 
            posY?: string, 
            height?: number, 
            width?: number 
        }
      ) => {
        const currentElementKey = blockID;
        
        const updatedObj = {...objectOfBlocks};
        const currentObjByKey = {...updatedObj[currentElementKey]};
       
        if(posX !== undefined) currentObjByKey.posX = posX;
        if(posY !== undefined) currentObjByKey.posY = posY; 
        if(height !== undefined) currentObjByKey.height = height;
        if(width !== undefined) currentObjByKey.width = width;

        if(currentObjByKey.type == "note") mutateNoteBlocksState(currentObjByKey);
        if(currentObjByKey.type == "image") mutateImageBlockState(currentObjByKey);
        //console.log("new posY:", posY, " w:", width);
        //console.log(currentObjByKey.type);
    }
    //handles dot drags on resizible block
    const handleDrag = React.useCallback(
      (blockID: string, dragSide: string, blockHeight: number, blockWidth: number, posX: string, posY: string,
      event: MouseEvent | TouchEvent | PointerEvent, 
      info: { delta: { x: number; y: number } },
      blockType: string
    ) => {
        
        
        let objectOfBlocks: typeof imageBlocks| undefined; //image blocks type is the same as other blocks
        let newHeight = blockHeight; 
        let newY = parseFloat(posY);
        let newX = parseFloat(posX);
        let newWidth = blockWidth;

        if(blockType == "note") objectOfBlocks = noteBlocks;
        if(blockType == "image") objectOfBlocks = imageBlocks;
        console.log(imageBlocks);

        //change position and size depending on which button is dragged
        if(dragSide == 'top' && objectOfBlocks) {
            newHeight = newHeight - info.delta.y; 
            newY = newY + info.delta.y;
            blockSizePositionUpdate(blockID, objectOfBlocks, {height: newHeight, posY: `${newY}`});
        }
        if(dragSide == 'bottom' && objectOfBlocks) {
            newHeight = newHeight + info.delta.y; 
            blockSizePositionUpdate(blockID, objectOfBlocks, {height: newHeight});
        }
        if(dragSide == 'right' && objectOfBlocks) {
            newWidth = newWidth + info.delta.x;
            blockSizePositionUpdate(blockID, objectOfBlocks, {width: newWidth});
        }
        if(dragSide == 'left' && objectOfBlocks) {
            newWidth = newWidth - info.delta.x;
            newX = newX + info.delta.x;
            blockSizePositionUpdate(blockID, objectOfBlocks, {width: newWidth, posX: `${newX}`});
        }
        
    }, [noteBlocks, imageBlocks]);

    return (
        <>
        <ImageLinkForm
            postLink={handleLinkFormSubmit}
            isLinkFormVisible={isLinkFormVisible}
            cancelStatus={handleLinkFormCancel}
        />
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
                            onMouseDown={(event) => updateBlockData(event, note.type)}
                            onMouseUp={(event) => updateBlockData(event, note.type)}
                        >
                            <motion.div 
                                className="resizible" 
                            >
                                <motion.button 
                                    className="corner-dot top" 
                                    drag='y'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(note.id, "top", note.height, note.width, note.posX, note.posY, event, info, "note")}
                                >
                                </motion.button>
                                <motion.button 
                                    className="corner-dot right"
                                    drag='x'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(note.id, "right", note.height, note.width, note.posX, note.posY, event, info, "note")}
                                >    
                                </motion.button>
                                <motion.button 
                                    className="corner-dot bottom" 
                                    drag='y'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(note.id, "bottom", note.height, note.width, note.posX, note.posY, event, info, "note")}
                                >
                                </motion.button>
                                <motion.button 
                                    className="corner-dot left"
                                    drag='x'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(note.id, "left", note.height, note.width, note.posX, note.posY, event, info, "note")}
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
                {Object.values(imageBlocks).map((image, index) => {
                    //addToInputs(note.id, note.value);
                    return (
                        <motion.div 
                            drag 
                            dragConstraints={refBoard} 
                            dragMomentum={false}
                            layout
                            key={image.id}
                            id={image.id}
                            className={`${image.className} has-tools`} 
                            //initial={{ x: Number(note.posX), y: Number(note.posY) }}
                            animate={{ x: Number(image.posX), y: Number(image.posY)}} 
                            transition={{
                                type: "tween", duration: 0,
                                layout: { duration: 0} 
                              }}
                              style={{ 
                                position: "absolute",
                                width: image.width, 
                                height: image.height 
                            }}
                            onMouseDown={(event) => updateBlockData(event, image.type)}
                            onMouseUp={(event) => updateBlockData(event, image.type)}
                        >
                            <motion.div 
                                className="resizible" 
                            >
                                <motion.button 
                                    className="corner-dot top" 
                                    drag='y'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(image.id, "top", image.height, image.width, image.posX, image.posY, event, info, "image")}
                                >
                                </motion.button>
                                <motion.button 
                                    className="corner-dot right"
                                    drag='x'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(image.id, "right", image.height, image.width, image.posX, image.posY, event, info, "image")}
                                >    
                                </motion.button>
                                <motion.button 
                                    className="corner-dot bottom" 
                                    drag='y'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(image.id, "bottom", image.height, image.width, image.posX, image.posY, event, info, "image")}
                                >
                                </motion.button>
                                <motion.button 
                                    className="corner-dot left"
                                    drag='x'
                                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDrag={(event, info) => handleDrag(image.id, "left", image.height, image.width, image.posX, image.posY, event, info, "image")}
                                >
                                </motion.button>

                                <div className="block-tool-container">
                                    <button onClick={() => removeBlock(image.id, image.className)}>X</button>
                                </div>
                                <div 
                                    className="block-content img-block"
                                    style={{
                                        backgroundImage: `url(${image.link})`,
                                        aspectRatio: "16/9", 
                                        backgroundSize: "contain", 
                                        backgroundPosition: "center", 
                                        backgroundRepeat: "no-repeat", 
                                        
                                      }}
                                      
                                      
                                    tabIndex={0}
                                    >
                                </div>
                            </motion.div>


                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
        </>
    );
}
export default Board;