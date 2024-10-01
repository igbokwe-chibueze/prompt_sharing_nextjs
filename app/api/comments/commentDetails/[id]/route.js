import Comment from "@models/comment";
import { connectToDB } from "@utils/database";

// GET request handler for fetching comments or counts
export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        const objectId = params.id; // Post or comment ID
        const url = new URL(request.url);
        const countOnly = url.searchParams.get("count"); // Query param to check if only count is needed
        const entityType = url.searchParams.get("entityType"); // Determines if it's a 'prompt' or 'comment'
        const prompt = entityType === "prompt"; // Check if entity type is 'prompt'

        // Handle count requests
        if (countOnly) {
            const rootComments = await fetchRootComments(objectId, prompt);

            // Initialize total comment count
            let totalCommentCount = rootComments.length;

            // Count nested replies, subtract deleted comments if necessary
            for (const comment of rootComments) {
                if (comment.deletedAt !== null) totalCommentCount -= 1;
                totalCommentCount += await countCommentsRecursively(comment._id);
            }

            return new Response(JSON.stringify({ totalCount: totalCommentCount }), {
                status: 200,
            });


        } else {
            // Handle requests to fetch actual comments
            const comment = await Comment.findById(objectId).populate("userId");

            if (!comment)
                return new Response("Comment Not Found", { status: 404 });

            const rootComments = await fetchRootComments(objectId, prompt, {
                sort: { createdAt: -1 },
                populate: "userId",
            });  

            const populatedComments = [];

            for (let comment of rootComments) {
                const populatedComment = comment.toObject();
                populatedComment.replies = await populateReplies(populatedComment._id );
                populatedComments.push(populatedComment);
            }

            return new Response(JSON.stringify({ comment, populatedComments }), {
                status: 200,
            });
        }
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
};

const populateReplies = async (commentId) => {
    const replies = await Comment.find({ parentCommentId: commentId })
        .sort({ createdAt: 1 })
        .populate('userId', 'username image')

    return replies;
};

// Helper function to fetch root-level comments based on entity type
const fetchRootComments = async (objectId, isPrompt, options = {}) => {
    const query = isPrompt
        ? { postId: objectId, parentCommentId: null }
        : { parentCommentId: objectId };

    // Apply optional sorting (e.g., by creation date) if specified in `options.sort`, default to no sorting.
    // Populate referenced fields (e.g., user details) if specified in `options.populate`, otherwise return raw ObjectIds.
    const rootComments = await Comment.find(query)
        .sort(options.sort || {})
        .populate(options.populate || "");

    return rootComments;
};


// Helper function to recursively count nested comments
const countCommentsRecursively = async (parentCommentId) => {
    const childComments = await Comment.find({ parentCommentId });
    let totalCount = childComments.length;

    for (const comment of childComments) {
        totalCount += await countCommentsRecursively(comment._id);
    }

    return totalCount;
};


export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        const objectId = params.id;

        // Find the comment by ID
        const comment = await Comment.findById(objectId);

        if (!comment) {
            return new Response("Comment not found", { status: 404 });
        }

        // Check if the comment has non-deleted replies
        const hasNonDeletedReplies = await Comment.countDocuments({ 
            parentCommentId: objectId,
            deletedAt: null, // Find only non-deleted replies
        });

        if (hasNonDeletedReplies) {
            // If the comment has non-deleted replies, "soft delete" it
            comment.deletedAt = new Date();
            comment.content = "This comment is no longer available";
            await comment.save();
        } else {
            // If the comment has no non-deleted replies, hard delete it
            await Comment.findByIdAndDelete(objectId);

            // Check if this comment was a reply to a soft-deleted parent
            if (comment.parentCommentId) {
                const parentComment = await Comment.findById(comment.parentCommentId);
                if (parentComment && parentComment.deletedAt) {
                    // Check if the parent has any other non-deleted replies
                    const parentHasOtherReplies = await Comment.countDocuments({
                        parentCommentId: comment.parentCommentId,
                        _id: { $ne: objectId }, // Exclude the current comment
                        deletedAt: null,
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