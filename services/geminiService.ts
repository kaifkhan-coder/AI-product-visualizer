
import { GoogleGenAI, Modality } from "@google/genai";
import { MarketingMedium } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash-image';

const extractBase64 = (dataUrl: string): { mimeType: string; data: string } => {
    const parts = dataUrl.split(',');
    if (parts.length !== 2) {
        throw new Error('Invalid data URL');
    }
    const mimeTypePart = parts[0].match(/:(.*?);/);
    if (!mimeTypePart || mimeTypePart.length < 2) {
        throw new Error('Could not extract MIME type from data URL');
    }
    const mimeType = mimeTypePart[1];
    const data = parts[1];
    return { mimeType, data };
};

const getGenerationPrompt = (medium: MarketingMedium): string => {
    switch (medium) {
        case MarketingMedium.MUG:
            return 'A photorealistic image of a glossy white coffee mug on a wooden table in a cozy cafe setting. The uploaded product image is featured prominently and clearly on the mug.';
        case MarketingMedium.TSHIRT:
            return 'A photorealistic image of a person wearing a plain white t-shirt, shown from the chest up. The t-shirt is the main focus. The uploaded product image is printed clearly on the front of the t-shirt.';
        case MarketingMedium.BILLBOARD:
            return 'A photorealistic image of a large, modern billboard in a bustling city square during the day. The uploaded product image is displayed clearly on the billboard.';
        default:
            throw new Error('Invalid marketing medium');
    }
};

export const generateMarketingImage = async (productImage: string, medium: MarketingMedium): Promise<string> => {
    try {
        const { mimeType, data } = extractBase64(productImage);
        const prompt = getGenerationPrompt(medium);

        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { inlineData: { mimeType, data } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }
        throw new Error("No image generated in the response.");

    } catch (error) {
        console.error("Error generating marketing image:", error);
        throw new Error("Failed to generate visualization. Please try again.");
    }
};

export const editImage = async (baseImage: string, prompt: string): Promise<string> => {
    try {
        const { mimeType, data } = extractBase64(baseImage);

        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { inlineData: { mimeType, data } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }
        throw new Error("No image generated in the response.");

    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image. Please try again.");
    }
};
