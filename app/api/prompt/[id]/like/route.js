import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (request, { params }) => {
    const { userId, like } = await request.json(); // Expecting userId and like status to be passed
    
    try {
        await connectToDB();

        // Find the prompt by ID
        const prompt = await Prompt.findById(params.id);

        if (!prompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Check if the user has already liked the prompt
        if (like) {
            // User wants to like the prompt, so we add the like
            if (!prompt.likes.includes(userId)) {
                prompt.likes.push(userId);
            }
        } else {
            // User wants to unlike the prompt, so we remove the like
            prompt.likes = prompt.likes.filter(id => id.toString() !== userId);
        }

        await prompt.save();

        // Return the updated prompt with the new like count
        return new Response(JSON.stringify({ likes: prompt.likes.length }), { status: 200 });
    } catch (error) {
        return new Response("Error updating prompt likes", { status: 500 });
    }
};
