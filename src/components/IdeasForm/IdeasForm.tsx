
import React, { useState } from "react";
import SearchIcon from "../../assets/images/SearchIcon";
import { getGenerationResult } from "./ideaGeneration";

interface GeneratedIdea {
    shortIdea: string;
    example: string;
}
const IdeasForm: React.FC = () => {
    
    const [inputValues, setInputValues] = useState<{
        [key: string]: string;
      }>({
        AddTopic: '',
        Mood: '',
        Setting: '',
        Creature: '',
        Place: '',
      });
    //array of topics
    const [topics, setTopics] = useState<string[]>([
        "Mood",
        "Setting",
        "Creature",
        "Place",
    ]);
    const [topicElements, setTopicElements] = useState<string[]>([]);

    const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
    

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {name, value} = event.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
  
    //тогда останется просто использовать json который генерируется и вствлять ответы в поля ввода. затем кнопка показать больше инфы или типа того
    // и наконец кнопка сохранить которая выведет куда то весь текст который был в полях ввода. возможно стоит добовлять кнопку для каждого поля отдельно хз
    //и наверно стоит сделать эту секцию как то отдельно чтобы компактнее хз

    //creates new element for topic, adds it to topic array
    const addNewTopicBtn = () => {
        //not sure that i need separate topic list and topic element list
        addTopicToArray(inputValues.AddTopic)
        setTopicElements((prevElement) => [...prevElement, inputValues.AddTopic]);  

        //replace spaces with _ for safer input names
        const inputNameNoSpaces = inputValues.AddTopic.replace(/ /g, "_");
        setInputValues((prevInputs) => ({
            ...prevInputs, [inputNameNoSpaces]: "",
        }));
        console.log(topicElements);
    }

    const addTopicToArray = (newTopic: string) => {
        setTopics((prevTopics) => [...prevTopics, newTopic]);
    }

    const removeTopicBtn = (key: string) => {
        //remove from list of topics 
        setTopics((prevTopics) => prevTopics.filter(topic => topic !== key));
        //remove from list of html element blocks to disappear 
        setTopicElements((prevTopicElements) => prevTopicElements.filter(topicEl => topicEl !== key));

        //remove from input fields object | not sure that it is necessary to remove fields from useState
    }

    const generateBtnHandler = async () => {
        console.log(topics);
        const generatedIdeasObject = await getGenerationResult(topics);
        fillTextaresWithIdeas(generatedIdeasObject);
        console.log(generatedIdeasObject);
    }

    const fillTextaresWithIdeas = (generatedIdeasObject: Record<string, GeneratedIdea>) => {
        Object.entries(generatedIdeasObject).forEach(([key, value]) => {
            setInputValues((prevValues) => ({
                ...prevValues,
                [key]: `${value.shortIdea}, ${value.example}`,
            }));
        });
    }

    //saved idea will create something on board that contains idea text, removing will be handled in board
    const saveIdeaBtn = () => {
        
    }

    return (
        <>

<form className="ideasForm">
                <small>Write or generate themes of your future artwork</small>
                <label className="addTopic">
                    <p>Add topic:</p>
                    
                    <input 
                        type="text" 
                        name="AddTopic"
                        value={inputValues.AddTopic}
                        onChange={handleInputChange}
                    />
                </label>

                <button type="button" onClick={addNewTopicBtn}>Add</button>
                {topics.map((topic, index) => {
                    const key = topic; 

                    return (
                        <label key={index}>
                            <button 
                                type="button" 
                                key={index}
                                onClick={() => removeTopicBtn(key)}    
                            >-</button>
                                <p>{key}</p>
                                <textarea 
                                    name={key} 
                                    value={inputValues[key as keyof typeof inputValues]}
                                    onChange={handleInputChange}
                                    
                                />
                            <button type="button" onClick={saveIdeaBtn}>Save</button>
                        </label>
                    );
                })}

                <div className="btn-container">
                    <button type="button" onClick={generateBtnHandler}>Generate</button>
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