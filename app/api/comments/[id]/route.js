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

        // Check if the comment has non-deleted replies
        const hasNonDeletedReplies = await Comment.countDocuments({ 
            parentCommentId: commentId,
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }]
        });

        if (hasNonDeletedReplies) {
            // If the comment has non-deleted replies, "soft delete" it
            comment.deletedAt = new Date();
            comment.content = "This comment is no longer available";
            await comment.save();
        } else {
            // If the comment has no non-deleted replies, hard delete it
            await Comment.findByIdAndDelete(commentId);

            // Check if this comment was a reply to a soft-deleted parent
            if (comment.parentCommentId) {
                const parentComment = await Comment.findById(comment.parentCommentId);
                if (parentComment && parentComment.deletedAt) {
                    // Check if the parent has any other non-deleted replies
                    const parentHasOtherReplies = await Comment.countDocuments({
                        parentCommentId: comment.parentCommentId,
                        _id: { $ne: commentId }, // Exclude the current comment
                        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }]
                    });

                    if (!parentHasOtherReplies) {
                        // If the parent has no other non-deleted replies, hard delete it
                        await Comment.findByIdAndDelete(comment.parentCommentId);
                    }
                }
            }
        }

        return new Response("Comment deleted successfully", { status: 200 });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return new Response("Error deleting comment", { status: 500 });
    }
};
