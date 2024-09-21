import Comment from "@models/comment";
import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const prompt = await Prompt.findById(params.id).populate("creator")
        if (!prompt) return new Response("Prompt Not Found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const { prompt, tags } = await request.json();

    try {
        await connectToDB();

        // Find the existing prompt by ID
        const existingPrompt = await Prompt.findById(params.id);

        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Update the prompt with new data
        existingPrompt.prompt = prompt;
        existingPrompt.tags = tags;
        existingPrompt.updatedAt = new Date(),

        await existingPrompt.save();

        return new Response("Successfully updated the Prompts", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Prompt", { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    
    try {
        await connectToDB();

        const promptId = params.id;

        // Find the prompt by ID
        const prompt = await Prompt.findById(promptId);

        if (!prompt) {
            return new Response("prompt not found", { status: 404 });
        }

        // Check if the propmt has non-deleted comments and replies.
        const hasNonDeletedComments = await Comment.countDocuments({ 
            postId: promptId,
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }]
        });

        if (hasNonDeletedComments) {
            // If the prompt has non-deleted comments, "soft delete" it
            prompt.deletedAt = new Date();
            prompt.prompt = "This prompt is no longer available";
            await prompt.save();
        } else {
            // If the prompt has no non-deleted comments, hard delete it
            await Prompt.findByIdAndDelete(promptId);
        }

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500 });
    }
};