
import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/images/SearchIcon";
import { getGenerationResult } from "./ideaGeneration";
import { useTools } from "../ToolsContext";

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
    const [isDisabled, setIsDisabled] = useState(false);
    const [countDown, setCountDown] = useState<number>();
    //tool context ////////////////////////////////////////////////
    const {isFormVisible, noteBlocks, mutateNoteBlocksState, currentCursor, toolCursorHandler, cursors, noteTool} = useTools();
    

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {name, value} = event.target;
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
  
    //creates new element for topic, adds it to topic array
    const addNewTopicBtn = () => {
        if(!inputValues.AddTopic.trim()) return;
        //not sure that i need separate topic list and topic element list
        addTopicToArray(inputValues.AddTopic)
        setTopicElements((prevElement) => [...prevElement, inputValues.AddTopic]);  
        
        const inputNameNoSpaces = inputValues.AddTopic.replace(/ /g, "_"); //replace spaces with _ for safer input names
        setInputValues((prevInputs) => ({
            ...prevInputs, [inputNameNoSpaces]: "",
        }));
        setInputValues(prevValue => ({
            ...prevValue,
            AddTopic: ''
        }));
        //console.log(topicElements);
    }


    const addTopicToArray = (newTopic: string) => {
        setTopics((prevTopics) => [...prevTopics, newTopic]);
    }

    const removeTopicBtn = (key: string) => {
        //remove from list of topics 
        setTopics((prevTopics) => prevTopics.filter(topic => topic !== key));
        //remove from list of html element blocks to disappear 
        setTopicElements((prevTopicElements) => prevTopicElements.filter(topicEl => topicEl !== key));

        //remove from input fields object 
        const inputListObject = inputValues;
        delete inputListObject[key];
        setInputValues(inputListObject);
        console.log(inputValues);
    }

    const generateBtnHandler = async () => {
        console.log(inputValues);
        if (noEmptyTopicLeft()) return; //to avoid needless requests when user has all topics filled
        const generatedIdeasObject = await getGenerationResult(topics);
        fillTextaresWithIdeas(generatedIdeasObject);
        setCountDown(10);
        setIsDisabled(true);
    }

    const noEmptyTopicLeft = () => {
        const arrayOfInputsValues = Object.values(inputValues).slice(1); //slices AddTopic field, I want to check only topic fields
        console.log(arrayOfInputsValues);
        return arrayOfInputsValues.every(value => value.trim() != '');
    }
    //to avoid too frequent reauests to openai 
    useEffect(() => {
        //ends this useEffect when interval is done
        if (countDown === 0) {
            setIsDisabled(false);
            return;
        };
        
        let count = countDown;
        const timer = setInterval(() => {
            if(count != undefined) count = count - 1;
            setCountDown(count);
        }, 1000);
        return () => clearInterval(timer);
    }, [countDown]);

    const fillTextaresWithIdeas = (generatedIdeasObject: Record<string, GeneratedIdea>) => {
        //goes trough ideas object and inputs values in text areas with same key name
        Object.entries(generatedIdeasObject).forEach(([key, value]) => {

            //get current text area value and check if it is empty to determine if generated idea should be inputed here
            const valueOfCurrentInput = inputValues[key];
            if(valueOfCurrentInput.trim() == "") {
                //fill text areas with values
                setInputValues((prevValues) => ({
                    ...prevValues,
                    [key]: `${value.shortIdea}, ${value.example}`,
                }));
            }


        });
    }

    const clearText = (inputName: string) => {
        setInputValues({
            ...inputValues,
            [inputName]: ''
        }) 
    }

    //saved idea will create something on board that contains idea text, removing will be handled in board
    const saveIdeaBtn = (key: string, event: React.MouseEvent<HTMLElement>) => {
        const value = inputValues[key];
        const indexForID = Object.values(noteBlocks).length;
        const idName = key.replace(/ /g, "_") + indexForID;
        //const {posX, posY} = getCurrentElementPosition(event);
        //короче после нажатия этой кнопки инфа уносится в в какое то состояние которое ждёт нажатия и получения координат
        //потом я уже там как-то вызываю mutate функцию чтобы создать блок, передаю ей инфу отсюда что выше
        //та функция создания будет требовать параметры для всех
        if(currentCursor == cursors.default) {
            toolCursorHandler(cursors.note);
            
        } 
        console.log(currentCursor);

        const currentBtn = event.currentTarget;
        const coordinates = currentBtn.getBoundingClientRect();
        const posX = coordinates.left;
        const posY = coordinates.top; // не пойдёт такое. Надо сделать так чтобы я кликом выберал куда ставить. Надо узнать как менять курсор чтобы обозначить что я собираюсь ставить
        //mutateNoteBlocksState( {id: idName, className: 'note-block', value: value, posX: `${posX}`, posY: `${posY}`} );
        noteTool( {id: idName, className: 'note-block', value: value, posX: `${posX}`, posY: `${posY}`} );
        //console.log(noteBlocks);
        console.log(posX, posY);
        
        
    }

    return (
        <>

            {isFormVisible && <form className="ideasForm">
                <small>Write or generate themes of your future artwork</small>
                <div className="add-topic-label">
                    <input 
                        type="text" 
                        className="topic-field"
                        name="AddTopic"
                        value={inputValues.AddTopic}
                        onChange={handleInputChange}
                    />
                    <button className="topic-btn" type="button" onClick={addNewTopicBtn}>ADD TOPIC</button>
                </div>
                
                {topics.map((topic, index) => {
                    const key = topic; 

                    return (
                        <div className="topic-block" key={index}>
                            <button 
                                type="button" 
                                onClick={() => removeTopicBtn(key)}    
                            >-</button>
                                <p>{key}</p>
                                <textarea 
                                    id="ideaTextArea"
                                    name={key} 
                                    value={inputValues[key as keyof typeof inputValues]}
                                    onChange={handleInputChange}
                                    
                                />
                            <div className="btn-column">
                                <button type="button" onClick={(event) => saveIdeaBtn(key, event)}>SAVE</button>
                                <button type="button" onClick={() => clearText(key)}>CLEAR</button>
                            </div>
                        </div>
                    );
                })}

                <div className="btn-container">
                    <button 
                        type="button" 
                        disabled={isDisabled}
                        onClick={generateBtnHandler}>
                    {countDown && countDown > 0 ? `Generate (${countDown})` : "Generate"}</button>
                    
                </div>
            </form>}
        </>
    )
}

export default IdeasForm;