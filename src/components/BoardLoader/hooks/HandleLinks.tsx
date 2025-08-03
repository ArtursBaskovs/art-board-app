import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const useBoardLink = () => {
    const location = useLocation();
    const parts = location.pathname.split("/"); 
    const noEmptyParts = parts.filter(Boolean);
    
    const baseLink = noEmptyParts[0];
    //console.log("PARTS: ", noEmptyParts);
    if(noEmptyParts[0] === 'board' && noEmptyParts[1]) {
        const boardPath = noEmptyParts[0];
        const boardIDlink = noEmptyParts[1];
        return {baseLink, boardPath, boardIDlink};
    } else {
        return { baseLink, boardPath: null, boardIDlink: null };
    }

}