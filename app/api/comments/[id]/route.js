// pages/api/comments/[postId]/route.js

import Comment from "@models/comment";
import { connectToDB } from "@utils/database";

// Function to recursively populate replies with user information
const populateReplies = async (commentId) => {
    // Find all replies that have the current comment as their parent
    const replies = await Comment.find({ parentCommentId: commentId })
        .sort({ createdAt: 1 }) // Sort replies by creation date in ascending order
        .populate('userId', 'username image'); // Populate the 'userId' field to include the username and image of the user

    // Initialize an array to hold the populated replies
    const populatedReplies = [];

    // Iterate over each reply to populate deeper levels of replies
    for (let reply of replies) {
        const populatedReply = reply.toObject(); // Convert the Mongoose document to a plain JavaScript object

        // Recursively call the function to populate nested replies and assign to the 'replies' field
        populatedReply.replies = await populateReplies(populatedReply._id); 

        // Push the fully populated reply object to the 'populatedReplies' array
        populatedReplies.push(populatedReply);
    }

    // Return the array of populated replies, including all nested levels
    return populatedReplies;
};

// GET request handler for fetching comments and their nested replies
export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        const postId = params.id;
        const url = new URL(request.url);
        const countOnly = url.searchParams.get('count');

        // If the request URL includes ?count=true, the API will return only the total count of comments and replies.
        // If ?count=true is not present, the API will return the full comment data with nested replies.

        if (countOnly) {
            // Return the total count of comments and replies
            const totalCommentsAndReplies = await Comment.countDocuments({ postId });
            return new Response(JSON.stringify({ total: totalCommentsAndReplies }), { status: 200 });
        } else {
            // Return the full comments with replies
            const rootComments = await Comment.find({ postId, parentCommentId: null })
                .sort({ createdAt: -1 })
                .populate('userId', 'username image');

            const populatedComments = [];

            for (let comment of rootComments) {
                const populatedComment = comment.toObject();
                populatedComment.replies = await populateReplies(populatedComment._id);
                populatedComments.push(populatedComment);
            }

            return new Response(JSON.stringify(populatedComments), { status: 200 });
        }

    } catch (error) {
        console.error('Error handling request:', error);
        return new Response("Error handling request", { status: 500 });
    }
};

