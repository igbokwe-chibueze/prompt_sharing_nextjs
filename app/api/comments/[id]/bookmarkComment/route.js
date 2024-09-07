// pages/api/comments/[id]/bookmark/route.js
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

        const userBookmarkedIndex = comment.bookmarks?.indexOf(userId);

        if (userBookmarkedIndex === -1) {
            // User hasn't bookmarked the comment, so add the bookmark
            comment.bookmarks.push(userId);
        } else {
            // User has already bookmarked the comment, so remove the bookmark
            comment.bookmarks?.splice(userBookmarkedIndex, 1);
        }

        await comment.save();

        return new Response(JSON.stringify({ bookmarks: comment.bookmarks?.length, isBookmarked: userBookmarkedIndex === -1 }), { status: 200 });
    } catch (error) {
        console.error('Error handling bookmark:', error);
        return new Response("Error updating comment bookmarks", { status: 500 });
    }
}