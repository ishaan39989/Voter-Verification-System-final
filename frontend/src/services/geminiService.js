import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';
// This line is causing the issue - let's read the key directly from the .env file that we've verified exists
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const captureVoterIdPhoto = async (imageData) => {
    try {
        console.log("Sending image to Gemini API...");
        console.log("Using API key:", GEMINI_API_KEY ? "API key is set" : "API key is missing");

        // Ensure the image is properly formatted
        if (!imageData.startsWith('data:image/')) {
            throw new Error('Invalid image format. Please provide a valid base64 image.');
        }
        const imageDataEncoded = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

        const payload = {
            contents: [
                {
                    parts: [
                        { text: "Extract the voter ID number from this image. Only return the ID number, nothing else." },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: imageDataEncoded
                            }
                        }
                    ]
                }
            ]
        };

        console.log("Sending request to Gemini API...");

        // Make API request
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            payload,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log("Gemini API response received:", response.data);

        // Extract text from response
        const extractedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!extractedText) {
            throw new Error('No voter ID detected in the image.');
        }

        return extractedText.trim();
    } catch (error) {
        console.error("Error in Gemini API:", error.response?.data || error.message);
        if (error.response?.status === 400) {
            console.error("Bad Request: Check the payload or API key.");
        }
        if (error.response?.status === 401) {
            throw new Error('Unauthorized: Please check your API key.');
        } else if (error.response?.status === 500) {
            throw new Error('Server Error: Gemini API is currently unavailable. Please try again later.');
        } else {
            throw new Error(error.response?.data?.message || 'Failed to process the voter ID image.');
        }
    }
};

export const sendToGemini = async (imageData) => {
    try {
        // Ensure the image is properly formatted
        if (!imageData.startsWith('data:image/')) {
            throw new Error('Invalid image format. Please provide a valid base64 image.');
        }
        const imageDataEncoded = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

        // Make a request to Gemini API for advanced processing
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: "Extract any text visible in this image, especially voter ID information." },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: imageDataEncoded
                                }
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Log the response for debugging
        console.log('Gemini response:', response.data);
        
        return {
            success: true,
            data: response.data,
            detectedText: response.data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        };
    } catch (error) {
        console.error('Error processing with Gemini:', error);
        return {
            success: false,
            error: error.message || 'Failed to process with Gemini API'
        };
    }
};
