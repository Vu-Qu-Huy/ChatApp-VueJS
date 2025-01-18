routerAdd('POST', '/api/{message}', async (e) => {
    try {
        // Extract the message from the URL path parameter
        const message = e.request.pathValue('message');
        console.log('Parsed message:', message);

        if (!message) {
            return e.json(400, {
                success: false,
                message: 'Message content is required',
            });
        }

        // Send the prompt to the Gemini server using $http
       
        const response = await $http.send({
            url:     "http://localhost:4000/generate",
            method:  "POST",
            body:    JSON.stringify({ prompt: message }),
            headers: {'Content-Type': 'application/json'}, 
            timeout: 120, // in seconds
        })
        console.log('Gemini server response:', response);

        // Return the response to the client
        return e.json(200, {
            success: true,
            message: response,
        });
    } catch (error) {
        console.error('Chat endpoint error:', error);
        return e.json(500, {
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});
