import generateOpenAiIdeas from "../../api/openai";

    let requestAllowed = true;
    //gets array of topics and formats text for openai prompt
    const prepareRequest = (topics: string[]) => {
        let requestText = `
            Generate a JSON object based on the topics I will provide. 
            Each topic should be a key in the JSON object. 

            The JSON should follow this format:
            {
            "Topic Name": {
                "shortIdea": "1-3 words",
                "example": "very short example"
            },
            ...
            }
            
            Ensure the keys match the topic names I provide exactly. Strictly return only a valid JSON object.
            
            Provided topics: `;
        topics.forEach(topic => {
            requestText += `${topic}, `;
        })
        
        return requestText;
    }
    //uses openai api to generate ideas and returns result
    const generateIdeas = async (requestText: string) => {
        if (!requestAllowed) {
            console.warn("Wait before another request")
            return;
        }
        requestAllowed = false;
        setTimeout(() => {
            requestAllowed = true
        }, 5000)
        //calls function that handles idea generation from openai api
        try {
            const result = await generateOpenAiIdeas(requestText);
            console.log(requestText);
            //console.log(result);
            return JSON.parse(result);

        } catch (error) {
            console.error('Error generating ideas:', error);
        }
    }    
    
    const handleGeneratedAnswer = () => {
        // либо здесь либо в том файле вывести ответы в поля
    }

    export const getGenerationResult = async (topics: string[]) => {
        const requestText = prepareRequest(topics);
        const result = await generateIdeas(requestText);
        return result;
    }

