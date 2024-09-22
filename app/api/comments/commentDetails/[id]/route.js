import Comment from "@models/comment";
import { connectToDB } from "@utils/database";


export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const comment = await Comment.findById(params.id).populate("userId")
        if (!comment) return new Response("Comment Not Found", { status: 404 });

        return new Response(JSON.stringify(comment), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}