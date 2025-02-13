export const apiKeyFetch = async (): Promise<string> => {
    try {
        const response = await fetch('/api/key', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {  
            const data = await response.json();



            if (data.success) {  
                return data.apikey;
            } else {
                throw new Error('Failed at getting api key');
            }


            
        } else {
            throw new Error('Server error');
        }

    } catch (error) {
        console.error('Error fetching api key: ', error);
        throw error;
    }
};
