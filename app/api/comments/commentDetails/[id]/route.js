import Comment from "@models/comment";
import { connectToDB } from "@utils/database";


export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const commentId = params.id;

        const comment = await Comment.findById(commentId).populate("userId")
        if (!comment) return new Response("Comment Not Found", { status: 404 });

        const totalReplies = await Comment.countDocuments({ parentCommentId: commentId })

        const rootComments = await Comment.find({ parentCommentId: commentId })
            .sort({ createdAt: -1 })
            .populate('userId', 'username image')
            //.limit(limit); // Limit the number of root comments returned

        return new Response(JSON.stringify({comment, rootComments, totalReplies}), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}