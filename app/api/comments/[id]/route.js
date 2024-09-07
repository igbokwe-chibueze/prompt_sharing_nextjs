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
            // Count documents with deletedAt being null or not set
            const totalCommentsAndReplies = await Comment.countDocuments({ postId, $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] });

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

export const PATCH = async (request, { params }) => {
    const { content } = await request.json();
    try {
        await connectToDB();

        // Find the existing prompt by ID
        const existingContent = await Comment.findById(params.id);

        if (!existingContent) {
            return new Response("Comment not found", { status: 404 });
        }

        existingContent.content = content;
        existingContent.updatedAt = new Date(),

        await existingContent.save();

        return new Response("Successfully updated the Comment", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Comment", { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        const commentId = params.id;

        // Find the comment by ID
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return new Response("Comment not found", { status: 404 });
        }

        // Check if the comment has replies
        const hasReplies = await Comment.countDocuments({ parentCommentId: commentId });   

        if (hasReplies) {
            // If the comment has replies, "soft delete" it by setting deletedAt, this  keep replies intact
            comment.deletedAt = new Date();
            comment.content = "This comment is no longer available";
            await comment.save();
        } else {
            // If the comment has no replies, hard delete it
            await Comment.findByIdAndDelete(commentId);
        }

        return new Response("Comment marked as deleted successfully", { status: 200 });
    } catch (error) {
        console.error('Error marking comment as deleted:', error);
        return new Response("Error marking comment as deleted", { status: 500 });
    }
};
