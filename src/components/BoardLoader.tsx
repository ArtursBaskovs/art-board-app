import React, { useEffect, useState } from "react";

const BoardLoader: React.FC = () => {
// maybe try routing here. like opening different types of forms.
// like if you wanna save locally or somewhere else. Or if you wanna save or load.
// maybe the board should be in the URL and then routing opens different variations, idk. probably exactly that.
// forget the drawing tool. that’s the final stage anyway.
// tomorrow figure out the form, then everything else.

    return (
        <>
        <div className="saveBoard-container">
            <div className="saveLocally">
                <p>Download board json file</p>
                <input type="text" placeholder="Enter board name" />
                <button>Browse</button>
            </div>

            <div className="saveInDB">
                <p>Save this board on... io. You will get a link</p>
                <input type="text" placeholder="Enter board name" />
                <button>Save on ..</button>
            </div>
            
        </div>
        <div className="uploadBoard-container">
            <div className="localUpload">
                <p>Upload your .json board file</p>
                <button>Browse</button>
            </div>
            <input type="text" placeholder="Enter your board link from..." name="" id="" />
            <div className="listOfCashedBoards"></div>
        </div>
        </>
    )
}
export default BoardLoader;