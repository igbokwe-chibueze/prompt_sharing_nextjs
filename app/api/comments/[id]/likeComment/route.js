// pages/api/comments/[id]/likeComment/route.js

import { connectToDB } from "@utils/database";
import Comment from "@models/comment";

export const POST = async (request, { params }) => {
    const { userId } = await request.json();

    try {
        await connectToDB();

        const commentId = params.id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return new Response("Comment not found", { status: 404 });
        }

        const userLikedIndex = comment.likes?.indexOf(userId);

        if (userLikedIndex === -1) {
            // User hasn't liked the comment, so add the like
            comment.likes.push(userId);
        } else {
            // User has already liked the comment, so remove the like
            comment.likes?.splice(userLikedIndex, 1);
        }

        await comment.save();

       return new Response(JSON.stringify({ likes: comment.likes?.length }), { status: 200 });
    } catch (error) {
        console.error('Error handling like:', error);
        return new Response("Error updating comment likes", { status: 500 });
    }
}