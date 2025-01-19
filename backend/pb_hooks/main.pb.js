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
        // Send the POST request
        const response = await $http.send({
            url:    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=",
            method: "POST",
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: message }]
                    }
                ]
            }),
            headers: { 'Content-Type': 'application/json' },
            timeout: 120, // in seconds
        });

        console.log('Raw response:', response);

        // Since `response` is already a plain object, no need to parse
        if (!response || typeof response !== 'object') {
            throw new Error('Unexpected response format');
        }
        const textResponse = response?.json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log('Gemini server response:', textResponse);

        // Return the response to the client
        return e.json(200, {
            success: true,
            message: textResponse
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