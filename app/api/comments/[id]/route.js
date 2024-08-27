// pages/api/comments/[postId]/route.js

import Comment from "@models/comment";
//import User from "@models/user"; // Assuming a User model exists
import { connectToDB } from "@utils/database";

// GET request handler for fetching comments and their replies with user information
export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        const postId = params.id;

        // Fetch root comments and populate user information
        const rootComments = await Comment.find({ postId, parentCommentId: null })
            .sort({ createdAt: -1 })
            .populate('userId', 'username image'); // Populate username and image from User model

        // Function to recursively populate replies with user information
        const populateReplies = async (comment) => {
            const replies = await Comment.find({ parentCommentId: comment._id })
                .sort({ createdAt: 1 })
                .populate('userId', 'username image');

            for (let reply of replies) {
                reply.replies = await populateReplies(reply); // Recursively populate nested replies
            }

            return replies;
        };

        const populatedComments = [];
        for (let comment of rootComments) {
            const populatedComment = comment.toObject(); // Convert Mongoose document to plain JavaScript object
            populatedComment.replies = await populateReplies(populatedComment); // Populate and attach replies
            populatedComments.push(populatedComment);
        }

        return new Response(JSON.stringify(populatedComments), { status: 200 });

    } catch (error) {
        console.error('Error fetching comments:', error);
        return new Response("Error fetching comments", { status: 500 });
    }
};
