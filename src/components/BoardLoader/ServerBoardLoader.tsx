import { useEffect, useRef, useState } from "react";
import { useBoardFetch, responseDataType, useUpdateBoard, useInsertBoard } from "../../api/mysqlDBapi";
import { useBoardLink } from "./hooks/HandleLinks";
import { useTools } from "../ToolsContext";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { BoardData, useloadBoardData } from "./hooks/HandleBoardLoad";

const  ServerBoardLoader: React.FC = () => {
    type BoardPathType = {
        url: string;
        title: string;
    }
    //gets id from current link if it exists
    const {baseLink, boardPath, boardIDlink} = useBoardLink();
    const [loading, setLoading] = useState(false);
    const {toolIsActive, noteBlocks, imageBlocks, setNoteBlocks, setImageBlocks} = useTools();
    //fetches board data from DB for board id in current link
    const { responseData, fetchError } = useBoardFetch(boardIDlink); 
    

    const [boardID, setBoardID] = useState('');
    const [boardName, setBoardName] = useState('');
    const loadBoardData = useloadBoardData();
    const linksLocalStorageName = 'boardLinks';
    const [listOflinks, setListOflinks] = useState<BoardPathType[]>();
    //handle input states
    const [formInput, setFormInput] = useState({
        boardNameinput: '',
    });
    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormInput(prev => ({ ...prev, [name]: value }));
    };

    const [placeholder, setPlaceholder] = useState({
        boardNameInputPlaceholder: '',
    });


    //ref for up to date data from states to avoid empty objects    
    const upToDateDataRef = useRef<BoardData>({
        boardName,
        notes: noteBlocks,
        images: imageBlocks,
    });  
    useEffect(() => {
        upToDateDataRef.current = {
            boardName,
            notes: noteBlocks,
            images: imageBlocks,
        };
    }, [boardName, noteBlocks, imageBlocks]);


    //load board from api
    useEffect(() => {
        if(!responseData && !fetchError) {
            setLoading(true);
            return;
        }
        
        //console.log(responseData, fetchError);
        responseData && applyBoardData(responseData);



        setLoading(false);
    }, [responseData, fetchError]);
    //saving link in local storage
    useEffect(() => {
        
        const savedLinks = getSavedLinksInLocal();
        console.log("Saved Links: ", savedLinks);
    }, [boardID]) // вот это вынести не в юзэффект а в сохранение по кнопке. когда кнопка будет

    //sets all necessary board elements to render
    const applyBoardData = (responseData: responseDataType) => {
        setBoardID(responseData.Data.boardID);
        setBoardName(responseData.Data.boardData.boardName);
        const jsonBoardData = responseData.Data.boardData;
        console.log(responseData, fetchError);
        loadBoardData(jsonBoardData);
    }


    const saveLinkInLocal = () => {
        if(boardAlreadySaved()) return;
        const link = `${boardPath}/${boardIDlink}`;
        //const link = `/${boardIDlink}`;
        const boardName = responseData?.Data.boardData.boardName;
        const boardInfo = {url: link, title: boardName || "no name"};
        //get array of all saved links in localStorage and update array with new link
        const savedLinksArray = getSavedLinksInLocal() || [];


        savedLinksArray.push(boardInfo);

        localStorage.setItem(linksLocalStorageName, JSON.stringify(savedLinksArray));
        console.log(boardInfo);
    }

    const boardAlreadySaved = () => {
        const link = `${boardPath}/${boardIDlink}`;
        const savedLinksArray = getSavedLinksInLocal() || [];
        return savedLinksArray.some(saved => saved.url === link);
    }

    const getSavedLinksInLocal = () => {
        const data = localStorage.getItem(linksLocalStorageName);
        
        if(data) {
            const list = JSON.parse(data) as BoardPathType[];
            setListOflinks(list);
            return list;
        }
        return null;
    }

    //inserting new board to db
    const navigate = useNavigate();
    const { createBoard, responseCreateData, fetchCreateError} = useInsertBoard();
    const createNewBoard = () => {
        if(formInput.boardNameinput == "") {
            setPlaceholder(prev => ({
                ...prev,
                boardNameInputPlaceholder: 'ENTER BOARD NAME FIRST',
            }));
            return;
        }

        const boardJsonData = {
            boardName: formInput.boardNameinput,
            notes: {},
            images: {}
        }
        console.log("Trying to create board: ", boardJsonData);
        createBoard(boardJsonData);
    }
    useEffect(() => {
        if(!responseCreateData && !fetchCreateError) return;
        console.log("Create Board response: ", {responseCreateData, fetchCreateError});

        //redirect to new board
        if(!responseCreateData || !responseCreateData.Data) return;
        const link = `/board/${responseCreateData.Data}`;

        setFormInput({ boardNameinput: '' });
        navigate(link);


    }, [responseCreateData, fetchCreateError])
    
    // will call update current board on timer and or on ctrl + s
    const { updateBoard, responseUpdateData, fetchUpdateError } = useUpdateBoard();
    const updateCurrentBoard = () => {
        
        const boardJsonData = {
            boardName,
            notes: noteBlocks,
            images: imageBlocks,
        };
        updateBoard(boardIDlink, boardJsonData);
    };
    useEffect(() => {
        if(!responseUpdateData && !fetchUpdateError) return;
        console.log("Update response: ", {responseUpdateData, fetchUpdateError});
    }, [responseUpdateData, fetchUpdateError]);
    //

    //keyboard listener
    const handleKeyboard = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
            event.preventDefault();
            console.log('ctrl + s');
            updateCurrentBoard();
        }
    }
    useEffect(() => {
        window.addEventListener("keydown", handleKeyboard);
        return () => {
            window.removeEventListener("keydown", handleKeyboard);
        };
    }, [boardName, noteBlocks, imageBlocks]);
    //

    // warning on page unload. 
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            updateBoard(boardIDlink, upToDateDataRef.current);
            e.preventDefault();
            e.returnValue = ""; 
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [boardIDlink]);


    //save on timer
    useEffect(() => {
        if(!boardPath || !boardIDlink) return;
        
        const timer = setInterval(() =>{
            console.log("Time to autosave your progress");
            updateBoard(boardIDlink, upToDateDataRef.current);
        }, 300000);

        return () => clearInterval(timer);
    }, [boardPath, boardIDlink]);


    //create new board




    return (
        <>
        <div className="server-loader-boards">
            <input
                type="text"
                name="boardNameinput"
                placeholder={placeholder.boardNameInputPlaceholder}
                value={formInput.boardNameinput}
                onChange={inputHandler}
            />
            <button className="full-size-button" onClick={createNewBoard}>Create new board</button>
        </div>
        <div className="boardList-server-container">
            <div className="description-text">
                <p>Save current link to this board</p>
            </div>
            <button onClick={saveLinkInLocal}>Save</button>
            <div className="description-text">
                <p>Saved board links</p>
            </div>
            <div className="list">
                {listOflinks?.map((item, index) => (
                    <Link key={index} to={`/${item.url}`}>
                        {item.title}
                    </Link>
                ))}
            </div>

        </div>
        </>
    )
}
export default ServerBoardLoader;