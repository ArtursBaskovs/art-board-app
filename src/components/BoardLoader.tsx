import React, { useEffect, useState } from "react";
import { useTools } from "./ToolsContext";

const BoardLoader: React.FC = () => {
//all board data will be saved in indexedDB for long term. 
// In localStorage will be saved board latest data 

    const {toolIsActive, noteBlocks, imageBlocks, setNoteBlocks, setImageBlocks} = useTools();
    const [choice, setChoice] = useState('');
    const [formInput, setFormInput] = useState({
        boardNameLocal: '',
        boardNameDB: '',
        boardLink: '',
    });
    const [warningMsg, setWarningMsg] = useState('');
    let fileReader: FileReader;
    const [currentBoard, setCurrentBoard] = useState('');
    const [boardList, setBoardList] = useState<string[]>([]);
    const [latestBoard, setLatestBoard] = useState('');


    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormInput(prev => ({ ...prev, [name]: value }));
    };
    const choiceHandler = (whatChoice: string) => {
        if(whatChoice == 'save') setChoice('save');
        if(whatChoice == 'upload') setChoice('upload'); 
    }

    //gets all data from objects in states for all html blocks on board
    const gatherBoardJsonData = (boardName: string) => {
        const boardJsonData = {
            boardName,              
            notes: noteBlocks,      
            images: imageBlocks,    
        };
        console.log(boardJsonData);
        return boardJsonData;
    }
    const exportJsonFile = (jsonData: {}) => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(jsonData)
          )}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = jsonString;
        downloadLink.download = formInput.boardNameLocal + ".json";
        downloadLink.click();
    }

    
    const uploadFromLocal = () => {
        const input = document.createElement("input"); //creatimg fake input that acts like input which accepts file
        input.type = "file";
        input.accept = "application/json";
        
        
        input.onchange = (e: Event) => { //event that works on that fake input for processing a file
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            
            if (!file) return;
            fileReader = new FileReader();
            fileReader.onloadend = () => {
                const fileContent = fileReader.result; //file content is here
                loadBoardData(fileContent as string);
            };
            fileReader.readAsText(file);
        }
        input.click();  
    };
    type BoardData = {
        boardName: string;
        images: {};
        notes: {};
    };
    //will be used to load from any source
    const loadBoardData = (content: string) => {
        const jsonData: BoardData = JSON.parse(content);
        console.log(jsonData.boardName);
        
        //populates one of state that containes note images or other type of html blocks
        if(jsonData.boardName) {
            setCurrentBoard(jsonData.boardName);
        } else {
            setCurrentBoard("unknown board");
        }
        if(jsonData.notes) {
            setNoteBlocks(jsonData.notes);
        } else {
            console.warn("No notes was found in ", jsonData.boardName, ".json");
        }
        if(jsonData.images) {
            setImageBlocks(jsonData.images)
        } else {
            console.warn("No images was found in ", jsonData.boardName, ".json");
        }

    }
    
    const saveBoardLocally = () => {
        if(formInput.boardNameLocal == '') {
            setWarningMsg("Enter board name before saving on your pc.");
            return;
        }
        const jsonData = gatherBoardJsonData(formInput.boardNameLocal);
        exportJsonFile(jsonData);
        saveBoardInIndexedDB(jsonData);
    }
    const saveBoardInIndexedDB = (boardJsonData: BoardData) => {
        if(boardJsonData.boardName === '') {
            console.log("Won`t save empty board in indexed DB");
            return;
        }
        let openRequest = indexedDB.open("boardsDB", 2);
        openRequest.onupgradeneeded = (event) => {
            const openedDB = (event.target as IDBOpenDBRequest).result;
            //openedDB.createObjectStore('userBoards', { keyPath: "boardName", autoIncrement: true});
            if (!openedDB.objectStoreNames.contains('userBoards')) {
                openedDB.createObjectStore('userBoards', { keyPath: "boardName", autoIncrement: true });
            }
        }
        openRequest.onsuccess = () => {
            const openedDB = openRequest.result;
            const dbTransaction = openedDB.transaction('userBoards', 'readwrite');
            const store = dbTransaction.objectStore('userBoards');

            store.put(boardJsonData);

            dbTransaction.oncomplete = () => {
                console.log("Json board data was saved in IndexedDB");
            }
            dbTransaction.onerror = () => {
                console.error("Error saving json board data:", dbTransaction.error);
            }
        }
          
    }

    const getIndexedDBboards = async (getWhat: string): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            let openRequest = indexedDB.open("boardsDB", 2);
            openRequest.onupgradeneeded = (event) => {
                const openedDB = (event.target as IDBOpenDBRequest).result;
                if (!openedDB.objectStoreNames.contains('userBoards')) {
                    openedDB.createObjectStore('userBoards', { keyPath: "boardName", autoIncrement: true });
                }
            };
            openRequest.onsuccess = () => {
                const openedDB = openRequest.result;
                const dbTransaction = openedDB.transaction('userBoards', 'readonly');
                const store = dbTransaction.objectStore('userBoards')

                if(getWhat == 'getAll') {
                    const getAllBoards = store.getAll();
                    getAllBoards.onsuccess = () => {
                        const jsonData = getAllBoards.result;
                        resolve(jsonData);
                    }
                    getAllBoards.onerror = () => {
                        console.error("Could not get boards: ", dbTransaction.error);
                    }
                } else {
                    //if not all boards then specific board from parameter
                    const getBoard = store.get(getWhat);
                    getBoard.onsuccess = () => {
                        const jsonData = getBoard.result;
                        resolve(jsonData);
                    }
                    getBoard.onerror = () => {
                        console.error("Could not get data for this board: ", dbTransaction.error);
                    }
                }


            }
        });
    }

    //load board from indexed db on page open
    const fetchBoardAsync = async (boardName: string) => {
        const boardJsonData = await getIndexedDBboards(boardName) as string;
        const boardStr = JSON.stringify(boardJsonData);
        //console.log(boardStr);
        loadBoardData(boardStr);
    };
    const getBoardList = async () => {
        const boardsJsonData = await getIndexedDBboards('getAll') as BoardData[];
        //const boardsStr = JSON.stringify(boardsJsonData);
        const listOfBoards = boardsJsonData.map(board => board.boardName);
        setBoardList(listOfBoards);
    }
    useEffect(() => {
        getBoardList();
        const savedInLocal = localStorage.getItem('savedOnPageClose');
        if(savedInLocal) {
            const jsonData = JSON.parse(savedInLocal) as BoardData;
            saveBoardInIndexedDB(jsonData);
            fetchBoardAsync(jsonData.boardName);
        }
    }, []);

    const saveCurrentBoard = () => {
        const jsonData = gatherBoardJsonData(currentBoard);
        console.log(jsonData);
        saveBoardInIndexedDB(jsonData);
    } 
    const switchBoard = (boardName: string) => {
        //save current board first
        saveCurrentBoard();
        //load another one after
        fetchBoardAsync(boardName);
        setCurrentBoard(boardName); //?????
    }
    
    //updates data of current board in local store each time something changes on board
    //  for savind progress in case browser will be closed
    useEffect(() => {
        const jsonData = gatherBoardJsonData(currentBoard);
        localStorage.setItem('savedOnPageClose', JSON.stringify(jsonData));
    }, [noteBlocks, imageBlocks, currentBoard]);


    return (
        <>
        <div className="board-loader-boards">
            <p className="name">Board name: {currentBoard}</p>
            <p className="advice">Board is saved in your browser or you can save it on pc</p>
            <div className="boardList-container">
                { boardList.map(boardName => <button key={boardName} onClick={() => switchBoard(boardName)}>{boardName}</button>)}
            </div>
        </div>
        <div className="loader-choice">
            <button 
                onClick={() => choiceHandler('save')}
                className={choice === 'save' ? 'active-true' : ''}
            >
                save
            </button>
            <button 
                onClick={() => choiceHandler('upload')}
                className={choice === 'upload' ? 'active-true' : ''}
            >
                upload
            </button>
        </div>

        { choice == 'save' &&
            <div className="saveBoard-container">
                <div className="saveLocally">
                    <p>Download board json file</p>
                    
                    <input
                        type="text"
                        name="boardNameLocal"
                        placeholder="Enter board name"
                        value={formInput.boardNameLocal}
                        onChange={inputHandler}
                    />
                    <button onClick={saveBoardLocally}>Save</button>
                    <p className="warning-text">{warningMsg}</p>
                </div>
                {/*
                <div className="saveInDB">
                    <p>Save this board on... io. You will get a link</p>
                    <input
                        type="text"
                        name="boardNameDB"
                        placeholder="Enter board name"
                        value={formInput.boardNameDB}
                        onChange={inputHandler}
                    />
                    <button>Save on ..</button>
                </div> */}
                
            </div>
        }
        { choice == 'upload' &&
            <div className="uploadBoard-container">
                <div className="localUpload">
                    <p>Upload your .json board file</p>
                    <button onClick={uploadFromLocal}>Upload</button>
                </div>
                {/*<input
                    type="text"
                    name="boardLink"
                    placeholder="Enter your board link from..."
                    value={formInput.boardLink}
                    onChange={inputHandler}
                /> */}
            </div>
        }
        </>
    )
}
export default BoardLoader;