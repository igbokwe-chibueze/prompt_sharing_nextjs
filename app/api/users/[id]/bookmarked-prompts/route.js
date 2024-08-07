// app/api/users/[id]/bookmarked-prompts/route.js

import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  const userId = params.id;

  try {
    await connectToDB();

    // Find all prompts where the user has bookmarked them
    const prompts = await Prompt.find({ bookmarks: userId }).populate("creator");

    if (!prompts) {
      return new Response("No bookmarks found", { status: 404 });
    }

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Error fetching bookmarked prompts", { status: 500 });
  }
};

