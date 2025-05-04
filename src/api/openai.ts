
export const generateOpenAiIdeas = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch('https://art-board-app-backend.onrender.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error('Failed to get data from server');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error generating ideas:', error);
        throw error;
    }
};



/*const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku about ai"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));*/

//completion.then((result) => console.log(result.choices[0].message));
export default generateOpenAiIdeas;
