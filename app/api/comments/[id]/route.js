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
        // Establish a connection to the database
        await connectToDB();

        const postId = params.id; // Extract the postId from the route parameters

        // Fetch all root-level comments (i.e., comments with no parent) for the specified post
        const rootComments = await Comment.find({ postId, parentCommentId: null })
            .sort({ createdAt: -1 }) // Sort root comments by creation date in descending order
            .populate('userId', 'username image'); // Populate the 'userId' field with the username and image of the user

        // Initialize an array to hold the fully populated comments
        const populatedComments = [];

        // Iterate over each root comment to populate its replies
        for (let comment of rootComments) {
            const populatedComment = comment.toObject(); // Convert the Mongoose document to a plain JavaScript object

            // Recursively populate replies and assign them to the 'replies' field of the root comment
            populatedComment.replies = await populateReplies(populatedComment._id); 

            // Push the fully populated root comment object to the 'populatedComments' array
            populatedComments.push(populatedComment);
        }

        // Return the populated comments array as a JSON response with a status of 200 (OK)
        return new Response(JSON.stringify(populatedComments), { status: 200 });

    } catch (error) {
        console.error('Error fetching comments:', error); // Log any errors that occur during the process
        return new Response("Error fetching comments", { status: 500 }); // Return an error response with a status of 500 (Internal Server Error)
    }
};
