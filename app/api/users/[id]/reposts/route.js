import Prompt from "@models/prompt";
import Comment from "@models/comment";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        // Find reposts in prompts where the user's ID matches `repostedBy`
        const promptReposts = await Prompt.find({
            'reposts.repostedBy': params.id
        })
        .sort({createdAt: -1 })
        .populate("creator")
        .populate('reposts.repostedBy', 'username');

        // Find reposts in comments where the user's ID matches `repostedBy`
        const commentReposts = await Comment.find({
            'reposts.repostedBy': params.id
        })
        .sort({repostedAt: -1 })
        .populate('userId', 'username image email')
        .populate('reposts.repostedBy', 'username');

        // Combine results from prompts and comments
        const reposts = {
            prompts: promptReposts,
            comments: commentReposts
        };

        if (reposts.prompts.length > 0 || reposts.comments.length > 0) {
            console.log(`Reposts Found: ${reposts.prompts.length} in prompts, ${reposts.comments.length} in comments`);
        } else {
            console.log("No reposts found");
        }

        return new Response(JSON.stringify(reposts), { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return new Response("Error fetching reposted prompts and comments", { status: 500 });
    }
};


