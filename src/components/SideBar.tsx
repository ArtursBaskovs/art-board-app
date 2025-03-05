import React, { useState } from "react";
import IdeasForm from "./IdeasForm/IdeasForm";
import Tools from "./Tools";
import { ToolsProvider, useTools } from './ToolsContext';
import Board from "./Board";


const SideBar: React.FC = () => {
    
  
    //const tools = useTools();
    return (
        <div className="sideBar-container">
            <aside className="sideBar">
                <nav className="sideBar_nav">
                    
                        
                        <Tools ></Tools>
                        <div className="idea-tool-window">
                            <IdeasForm></IdeasForm>
                        </div>
                    
                </nav>
            </aside>
        </div>
    )
}

export default SideBar;