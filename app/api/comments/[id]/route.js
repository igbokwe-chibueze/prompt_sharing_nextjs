// pages/api/comments/[postId]/route.js

import Comment from "@models/comment";
import { connectToDB } from "@utils/database";

const populateReplies = async (commentId, limit = 2) => {
    const replies = await Comment.find({ parentCommentId: commentId })
        .sort({ createdAt: 1 })
        .populate('userId', 'username image')
        .limit(limit); // Limit the number of replies returned

    const populatedReplies = [];

    for (let reply of replies) {
        const populatedReply = reply.toObject();
        populatedReply.replies = await populateReplies(populatedReply._id, limit);
        populatedReplies.push(populatedReply);
    }

    return populatedReplies;
};

export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        const postId = params.id;
        const url = new URL(request.url);
        const countOnly = url.searchParams.get('count');
        const limit = parseInt(url.searchParams.get('commentsLimit')) || 2;

        if (countOnly) {
            const totalCommentsAndReplies = await Comment.countDocuments({ postId });
            const totalrootComments = await Comment.countDocuments({ postId, parentCommentId: null })
            return new Response(JSON.stringify({ totalCount: totalCommentsAndReplies, commentsCount:totalrootComments }), { status: 200 });
        } else {
            const rootComments = await Comment.find({ postId, parentCommentId: null })
                .sort({ createdAt: -1 })
                .populate('userId', 'username image')
                .limit(limit); // Limit the number of root comments returned

            const populatedComments = [];

            for (let comment of rootComments) {
                const populatedComment = comment.toObject();
                populatedComment.replies = await populateReplies(populatedComment._id, limit);
                populatedComments.push(populatedComment);
            }

            return new Response(JSON.stringify(populatedComments), { status: 200 });
        }

    } catch (error) {
        console.error('Error handling request:', error);
        return new Response("Error handling request", { status: 500 });
    }
};
