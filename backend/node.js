import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

async function generateResponse(prompt) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
        const result = await model.generateContent(prompt);
        const text = typeof result.response.text === 'function'
            ? await result.response.text()
            : result.response.text;

        return text;
    } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Failed to generate AI response');
    }
}

app.post('/generate', async (req, res) => {
    console.log('Request body:', req.body);
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({
            success: false,
            message: 'Prompt is required',
        });
    }
    console.log('Received prompt:', prompt);
    try {
        const aiResponse = await generateResponse(prompt);
        console.log('AI response:', aiResponse);
        res.status(200).send(aiResponse);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});

app.listen(4000, () => {
    console.log(`Server is running on http://localhost:4000`);
});
