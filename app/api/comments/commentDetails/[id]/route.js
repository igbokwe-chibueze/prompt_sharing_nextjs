import Comment from "@models/comment";
import { connectToDB } from "@utils/database";

// GET request handler for fetching comments or counts
export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        const objectId = params.id; // Post or comment ID
        const url = new URL(request.url);
        const countOnly = url.searchParams.get("count"); // Query param to check if only count is needed
        const limit = parseInt(url.searchParams.get('commentsLimit')) || undefined;
        const replyLimit = parseInt(url.searchParams.get('repliesLimit')) || undefined;
        const entityType = url.searchParams.get("entityType"); // Determines if it's a 'prompt' or 'comment'

        const prompt = entityType === "prompt"; // Check if entity type is 'prompt'

        // Handle count requests
        if (countOnly) {
            const rootComments = await fetchRootComments(objectId, prompt);

            // Initialize total comment count
            const rootCommentCount = rootComments.length;

            let totalCommentCount = rootCommentCount;

            // Count nested replies, subtract deleted comments if necessary
            for (const comment of rootComments) {
                if (comment.deletedAt !== null) totalCommentCount -= 1;
                totalCommentCount += await countCommentsRecursively(comment._id);
            }

            return new Response(JSON.stringify({ totalCount: totalCommentCount, totalRootCommentCount: rootCommentCount }), {
                status: 200,
            });

        // Handle requests to fetch actual comments
        } else {
            if (prompt) { // This is called on a prompt

                const rootComments = await fetchRootComments(objectId, prompt, {
                    sort: { createdAt: -1 },
                    populate: "userId",
                    limit: limit,
                });

                const populatedComments = [];

                for (let comment of rootComments) {
                    const populatedComment = comment.toObject();
                    const { replies, totalReplyCount } = await populateReplies(populatedComment._id, replyLimit);
                    populatedComment.replies = replies;
                    populatedComment.totalReplyCount = totalReplyCount; // Add the total reply count to the comment object
                    populatedComments.push(populatedComment);
                }

                return new Response(JSON.stringify({ populatedComments }), {
                    status: 200,
                });

            } else { // This is called on a comment.
                const comment = await Comment.findById(objectId).populate("userId");

                if (!comment)
                    return new Response("Comment Not Found", { status: 404 });

                const rootComments = await fetchRootComments(objectId, prompt, {
                    sort: { createdAt: -1 },
                    populate: "userId",
                    limit: limit,
                });  

                const populatedComments = [];

                //******!!!!DO NOT DELETE !!****
                //This is used if "See More" btn redirects to the root comment details page.
                // Returns a fixed numeber of replies(replyLimit) to the root comment.
                // for (let comment of rootComments) {
                //     const populatedComment = comment.toObject();
                //     populatedComment.replies = await populateReplies(populatedComment._id, replyLimit );
                //     populatedComments.push(populatedComment);
                // }

                // This is not needed if nested replies navigate to the comment details page of its root comment instead use the commented out code above.
                // Returns not just the replies to the root comments but also the count. 
                //This is needed for the "See More" btn to be able to load additional replies.
                for (let comment of rootComments) {
                    const populatedComment = comment.toObject();
                    const { replies, totalReplyCount } = await populateReplies(populatedComment._id, replyLimit);
                    populatedComment.replies = replies;
                    populatedComment.totalReplyCount = totalReplyCount; // Add the total reply count to the comment object
                    populatedComments.push(populatedComment);
                }

                return new Response(JSON.stringify({ comment, populatedComments }), {
                    status: 200,
                });
            }
        }
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
};

const populateReplies = async (commentId, replyLimit) => {
    const replies = await Comment.find({ parentCommentId: commentId })
        .sort({ createdAt: -1 })
        .populate('userId', 'username image')
        .limit(replyLimit) // set how many replies are allowed to show.

    // Fetch the total count of replies for the given commentId
    // This is not needed if nested replies navigate to the comment details page of its root comment
    const totalReplyCount = await Comment.countDocuments({ parentCommentId: commentId });

    return { replies, totalReplyCount }; // totalReplyCount is not needed if the nested replies navigate to the comment details page of its root comment
};

// Helper function to fetch root-level comments based on entity type
const fetchRootComments = async (objectId, isPrompt, options = {}) => {
    const query = isPrompt
        ? { objectId, parentCommentId: null }
        : { parentCommentId: objectId };

    // Apply optional sorting (e.g., by creation date) if specified in `options.sort`, default to no sorting.
    // Populate referenced fields (e.g., user details) if specified in `options.populate`, otherwise return raw ObjectIds.
    const baseQuery = Comment.find(query)
        .sort(options.sort || {})
        .populate(options.populate || "");

    // If a limit is specified, apply it
    if (options.limit) {
        baseQuery.limit(options.limit);
    }

    return await baseQuery;
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

            // Return the soft-deleted comment
            return new Response(JSON.stringify(comment), { status: 200 });
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

            return new Response(JSON.stringify({ message: "Comment hard deleted" }), { status: 200 });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        return new Response("Error deleting comment", { status: 500 });
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

        //return new Response("Successfully updated the Comment", { status: 200 });
        return new Response(JSON.stringify({ existingContent }), {
            status: 200,
        });
    } catch (error) {
        return new Response("Error Updating Comment", { status: 500 });
    }
};