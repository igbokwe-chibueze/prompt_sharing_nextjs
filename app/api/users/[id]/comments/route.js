import Comment from "@models/comment";
import Prompt from "@models/prompt"; // Ensure you import the Prompt model
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        // Fetch comments based on userId, and populate relevant fields
        const comments = await Comment.find({ userId: params.id })
            .sort({createdAt: -1 })
            .populate("userId")
            .populate({
                path: 'parentCommentId', // Populate the parent comment (the comment that this reply is responding to)
                populate: {
                    path: 'userId', // Populate the user who made the parent comment
                    select: 'username image' // Only select the fields you want to display
                }
            });

        // Initialize an array to hold the comments with the associated prompts
        const commentsWithPrompts = [];

        // Iterate over each comment
        for (let comment of comments) {
            // Convert the comment to a plain JS object
            const commentObj = comment.toObject();

            // Fetch the prompt associated with the comment's postId
            const promptDetail = await Prompt.findById(comment.postId).populate("creator", "username image");

            // Add the prompt detail to the comment object
            commentObj.prompt = promptDetail;

            // Push the modified comment to the array
            commentsWithPrompts.push(commentObj);
        }

        // Return the comments with the associated prompts as the response
        return new Response(JSON.stringify(commentsWithPrompts), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch comments with prompts", { status: 500 });
    }
};
