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
