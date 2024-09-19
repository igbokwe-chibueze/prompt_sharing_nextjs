// pages/api/repost/[id]/route.js

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

        const userRepostedIndex = entity.reposts.findIndex(repost => repost.repostedBy.toString() === userId); // Check if the user has already reposted

        if (userRepostedIndex === -1) {
            //User hasn't bookmarked the entity, so add the bookmark
            entity.reposts.push({
                repostedBy: userId,
                repostedAt: new Date(),
            });
        } else {
            // User has already bookmarked the entity, so remove the bookmark
            entity.reposts.splice(userRepostedIndex, 1);
        }

        await entity.save();

        return new Response(JSON.stringify({ reposts: entity.reposts.length, isReposted: userRepostedIndex === -1 }), { status: 200 });
    } catch (error) {
        console.error('Error handling repost:', error);
        return new Response("Error updating entity reposts", { status: 500 });
    }
}


// Handle GET request to check if a user has reposted a specific entity
export const GET = async (request, { params }) => {
    const { id } = params;
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId'); // Get the userId from query params
    const entityType = url.searchParams.get('entityType'); // Get the entityType from query params
  
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
  
      const isReposted = entity.reposts.some(repost => repost.repostedBy.toString() === userId);
  
      return new Response(JSON.stringify({ isReposted }), { status: 200 });
    } catch (error) {
      console.error('Error fetching repost status:', error);
      return new Response("Error fetching repost status", { status: 500 });
    }
  };
