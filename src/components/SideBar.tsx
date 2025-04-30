import React, { useState } from "react";
import IdeasForm from "./IdeasForm/IdeasForm";
import Tools from "./Tools";
import { ToolsProvider, useTools } from './ToolsContext';
import Board from "./Board";
import BoardLoader from "./BoardLoader";


const SideBar: React.FC = () => {
    
    const {toolIsActive} = useTools();
    
    return (
        <div className="sideBar-container">
            <aside className="sideBar">
                <nav className="sideBar_nav">
                    
                        
                        <Tools ></Tools>
                        <div className="idea-tool-window">
                            <IdeasForm></IdeasForm>
                        </div>
                        <div className="bord-loader-window">
                            <BoardLoader></BoardLoader>
                        </div>
                    
                </nav>
            </aside>
        </div>
    )
}

export default SideBar;