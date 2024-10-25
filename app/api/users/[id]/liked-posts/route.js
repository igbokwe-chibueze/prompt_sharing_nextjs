// /api/users/[id]/liked-posts/route.js

import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        // Find prompts where the user's ID is in the likes array
        const likedPrompts = await Prompt.find({ likes: params.id }).populate("creator").sort({createdAt: -1 });

        return new Response(JSON.stringify(likedPrompts), { status: 200 });
    } catch (error) {
        return new Response("Error fetching liked prompts", { status: 500 });
    }
};
