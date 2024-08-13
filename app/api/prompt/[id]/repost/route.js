// /api/prompt/[id]/repost/route.js

import { connectToDB } from "@/utils/database";
import Prompt from "@/models/prompt";

export const POST = async (request, { params }) => {
    const { userId, repost } = await request.json(); // Expecting userId and repost status to be passed

    try {
        await connectToDB();

        // Find the prompt by ID
        const prompt = await Prompt.findById(params.id);

        if (!prompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Check if the user has already reposted the prompt
        const existingRepost = prompt.reposts.find(repostObject => repostObject.repostedBy.toString() === userId);

        // User wants to repost the prompt
        if (repost) {
            // If user has not reposted before
            if (!existingRepost) {
                // We create a repost
                prompt.reposts.push({
                    repostedBy: userId,
                    repostedAt: new Date(),
                });
            }
        } else {
                // User wants to remove the repost, so we remove it
                prompt.reposts = prompt.reposts.filter(repost => repost.repostedBy.toString() !== userId);
            }

        
        
        // User wants to repost the prompt
        // if (repost) {
        //     console.log("Yes 1")
        //     // If user has not reposted before
        //     if (!existingRepost) {
        //         console.log("Yes 2")
        //         // We create a repost
        //         prompt.reposts.push({
        //             repostedBy: userId,
        //             repostedAt: new Date(),
        //         });
        //     } else {
        //         // User wants to remove the repost, so we remove it
        //         //prompt.reposts = existingRepost.filter(id => id.toString() !== userId);
        //         console.log("Delete it here")
        //     }
        // }


        await prompt.save();

        // Return the updated prompt with the new repost count
        return new Response(JSON.stringify({ reposts: prompt.reposts.length }), { status: 200 });
    } catch (error) {
        return new Response("Error updating prompt reposts", { status: 500 });
    }
}