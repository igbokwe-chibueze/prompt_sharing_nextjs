// app/api/incrementEntityClick/[id].js

import { connectToDB } from "@utils/database";
import Comment from "@models/comment";
import Prompt from "@models/prompt";

const modelMap = {
  comment: Comment,
  prompt: Prompt
};

export const POST = async (request, { params }) => {
    const { entityType } = await request.json();
    const { id } = params;

    try {
        await connectToDB();

        const Model = modelMap[entityType];

        if (!Model) {
            return new Response("Invalid entity type", { status: 400 });
        }

        const entity = await Model.findById(id);

        if (!entity) {
            return new Response("Entity not found", { status: 404 });
        }

        const updatedComment = await Model.findByIdAndUpdate(
            entity,
            { $inc: { entityClickCount: 1 } }, // Use the $inc operator to increment the entityClickCount by 1
            { new: true } // Return the updated document after the update operation
        );

        return new Response(JSON.stringify({ updatedComment }), { status: 200 });
    } catch (error) {
        return new Response("Error updating entityClickCount", { status: 500 });
    }
}
