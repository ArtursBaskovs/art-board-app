import React, { useEffect, useState } from "react";


type ImageLinkProp = {
    postLink: (link: string) => void; 
    isLinkFormVisible: boolean;
    cancelStatus: () => void;
};
const ImageLinkForm: React.FC<ImageLinkProp> = (props) => {
    const [inputValue, setInputValue] = useState<string>("");
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }
    const handleFormSubmit = () => {
        props.postLink(inputValue);
        setInputValue('');
    }
    const handleCancel = () => {
        props.cancelStatus();
        setInputValue('');
    }

    return (
        <>
            <div className="imageLinkForm" style={{ display: props.isLinkFormVisible ? 'flex' : 'none' }}>
                <input type="text" value={inputValue} onChange={handleInput}/>
                <button onClick={handleFormSubmit}>+</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </>
    )
}

export default ImageLinkForm;