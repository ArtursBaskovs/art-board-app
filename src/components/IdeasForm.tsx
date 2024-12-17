
import React from "react";
import SearchIcon from "../assets/images/searchIcon";

const IdeasForm: React.FC = () => {
    return (
        <>
        
        <form className="ideasForm">
        <small>Write or generate themes of your future artwork</small>
            <label>
                theme1:
                <input type="text"/>
            </label>

            <label>
                theme2:
                <input type="text"/>
            </label>

            <label>
                theme3:
                <input type="text"/>
            </label>

            <label>
                theme4:
                <input type="text"/>
            </label>
            
            <div className="btn-container">
                <button>Generate</button>
                <button style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <SearchIcon size={30} ></SearchIcon>
                    References
                </button>
            </div>
        </form>
        </>
    )
}

export default IdeasForm;