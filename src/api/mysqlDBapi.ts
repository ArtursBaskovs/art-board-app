
import { BoardData } from "@components/BoardLoader/hooks/HandleBoardLoad";
import { useEffect, useRef, useState } from "react";
const BASE_URL = import.meta.env.VITE_DB_API_BASE_URL;
//const BASE_URL = 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_DB_API_KEY;

export type responseDataType = {
    Message: string;
    Data: {
        boardID: string;
        boardData: BoardData;
    };
}
export const useInsertBoard = () => {
    const [responseData, setResponseData] = useState<responseDataType | null>(null);
    const [fetchError, setFetchError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const createBoard = (boardData: BoardData) => {
        makeApiRequest(abortControllerRef, "doesntMatter", "POST", setResponseData, setFetchError, boardData);
    };

    return {
        createBoard,
        responseCreateData: responseData,
        fetchCreateError: fetchError
    };
}
export const useUpdateBoard = () => {
    const [responseData, setResponseData] = useState<responseDataType | null>(null);
    const [fetchError, setFetchError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const updateBoard = (boardID: string | null, boardData: BoardData) => {
        if (!boardID) {
            console.log("No board ID");
            return;
        }

        makeApiRequest(abortControllerRef, boardID, "PATCH", setResponseData, setFetchError, boardData);
    };

    return {
        updateBoard,
        responseUpdateData: responseData,
        fetchUpdateError: fetchError
    };
};

export const useBoardFetch = (boardID: string | null) => {
    const [responseData, setResponseData] = useState<responseDataType | null>(null);
    const [fetchError, setFetchError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!boardID) {
            console.log("No board id recieved");
            return;
        };
        makeApiRequest(abortControllerRef, boardID, "GET", setResponseData, setFetchError);
    }, [boardID]);

    return {responseData, fetchError};
};

const makeApiRequest = async (
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  boardID: string,
  method: string,
  setResponseData: (data: any) => void,
  setFetchError: (error: any) => void,
  boardData?: BoardData
) => {
    //aborts fetching if this fetch was called again
    if(abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try{
        console.log("Request to: " + BASE_URL);
        const response = await fetch(`${BASE_URL}/boards/${boardID}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
            },
            ...(boardData && { body: JSON.stringify(boardData) }),
            signal: abortControllerRef.current?.signal,
        });

        const jsonData = await response.json();
        setResponseData(jsonData);
    } catch (error: any) {
        if (error.name === 'AbortError') {
            return;
        }
        setFetchError(error);
    }
};