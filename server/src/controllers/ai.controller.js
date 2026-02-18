 import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecipeByAi = asyncHandler(async (req, res) => {
    const { ingredients, diet } = req.body;

    if (!ingredients || ingredients.length === 0) {
        throw new ApiError(400, "Ingredients are required");
    }

 
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 3 simple recipes using: ${ingredients}. Diet: ${diet}. 
    Format: Title, Ingredients, Time, Steps, Calories, Proteins, Carbs.`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        if (!responseText) {
            throw new ApiError(500, "AI returned empty text. Check API quota.");
        }

        return res.status(200).json(
            new ApiResponse(200, responseText, "Recipe generated")
        );
    } catch (error) {
        console.error("GEMINI ERROR:", error.message);
        // This ensures the frontend receives an error and stops the "Generating" state
        return res.status(500).json({
            success: false,
            message: "Gemini API Error: " + error.message
        });
    }
});

const ingredientsdetector = asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
        throw new ApiError(400, "No image uploaded");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const imageData = {
            inlineData: {
                data: file.buffer.toString("base64"),
                mimeType: file.mimetype,
            },
        };

        const prompt = "List the food ingredients in this image as a comma-separated list.";
        const result = await model.generateContent([prompt, imageData]);
        const responseText = result.response.text();

        return res.status(200).json(
            new ApiResponse(200, responseText, "Ingredients detected")
        );
    } catch (error) {
        console.error("VISION ERROR:", error.message);
        return res.status(500).json({
            success: false,
            message: "Vision API Error: " + error.message
        });
    }
});

export { generateRecipeByAi, ingredientsdetector };