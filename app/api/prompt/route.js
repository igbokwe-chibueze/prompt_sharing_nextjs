import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
    try {
        await connectToDB();

        // Fetch prompts where deletedAt is null. This is to make sure soft-deleted prompts are not shown in the feed.
        const prompts = await Prompt.find({ deletedAt: null })
            .populate('creator')
            .populate('reposts.repostedBy');

        return new Response(JSON.stringify(prompts), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
};