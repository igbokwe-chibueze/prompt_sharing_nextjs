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

            return new Response(JSON.stringify({ comment, rootComments }), {
                status: 200,
            });
        }
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
};

// Helper function to fetch root-level comments based on entity type
const fetchRootComments = async (objectId, isPrompt, options = {}) => {
    const query = isPrompt
        ? { postId: objectId, parentCommentId: null }
        : { parentCommentId: objectId };

    // Apply optional sorting (e.g., by creation date) if specified in `options.sort`, default to no sorting.
    // Populate referenced fields (e.g., user details) if specified in `options.populate`, otherwise return raw ObjectIds.
    return Comment.find(query).sort(options.sort || {}).populate(options.populate || "");
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
