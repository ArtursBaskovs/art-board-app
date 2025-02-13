import React, { useState } from "react";
import IdeasForm from "./IdeasForm/IdeasForm";
import Tools from "./Tools";


const SideBar: React.FC = () => {
    const [ideasFromIsVisible, setIdeasFormIsVisible] = useState(false);

    const togleFormBlock = () => {
        setIdeasFormIsVisible((prevState) => !prevState);
    }

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