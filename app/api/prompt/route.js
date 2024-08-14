import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
    try {
        await connectToDB();

        // Fetch prompts and sort them by createdAt in descending order
        const prompts = await Prompt.find({}).populate('creator').populate('reposts.repostedBy').sort({ createdAt: -1 });

        return new Response(JSON.stringify(prompts), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
};