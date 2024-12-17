import React from "react";
import IdeasForm from "./IdeasForm";
import Tools from "./Tools";


const SideBar: React.FC = () => {
    return (
        <div className="sideBar-container">
            <aside className="sideBar">
                <nav className="sideBar_nav">

                    <IdeasForm></IdeasForm>
                    <Tools></Tools>
                    

                </nav>
            </aside>
        </div>
    )
}

export default SideBar;