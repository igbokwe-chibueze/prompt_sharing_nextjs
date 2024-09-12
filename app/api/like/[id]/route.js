// pages/api/like/[id].js

import { connectToDB } from "@utils/database";
import Comment from "@models/comment";
import Prompt from "@models/prompt";

const modelMap = {
  comment: Comment,
  prompt: Prompt
};

export const POST = async (request, { params }) => {
    const { userId, entityType } = await request.json();
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

        const userLikedIndex = entity.likes.indexOf(userId);

        if (userLikedIndex === -1) {
            // User hasn't bookmarked the entity, so add the bookmark
            entity.likes.push(userId);
        } else {
            // User has already bookmarked the entity, so remove the bookmark
            entity.likes.splice(userLikedIndex, 1);
        }

        await entity.save();

        return new Response(JSON.stringify({ likes: entity.likes.length, isLiked: userLikedIndex === -1 }), { status: 200 });
    } catch (error) {
        console.error('Error handling like:', error);
        return new Response("Error updating entity likes", { status: 500 });
    }
}
