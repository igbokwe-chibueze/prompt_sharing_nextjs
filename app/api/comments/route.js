// pages/api/comments/route.js

import Comment from "@models/comment";
import { connectToDB } from "@utils/database";


export const POST = async (request) => {
    try {
        await connectToDB();

        const { postId, userId, content, parentCommentId } = await request.json();

        const newComment = new Comment({
            postId,
            userId,
            content,
            parentCommentId: parentCommentId || null, // Root comment if no parentCommentId is provided
        });

        await newComment.save();

        return new Response(JSON.stringify(newComment), { status: 200 });
    } catch (error) {
        return new Response("Error creating comment", { status: 500 });
  }
}


export const GET = async (request) => {
    try {
        await connectToDB();

        // Fetch prompts and sort them by createdAt in descending order
        const comments = await Comment.find({}).populate('userId').populate('reposts.repostedBy');

        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch all comments", { status: 500 });
    }
};
