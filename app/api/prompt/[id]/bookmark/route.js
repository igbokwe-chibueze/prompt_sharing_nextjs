import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (request, { params }) => {
  const { userId, bookmark } = await request.json(); // Expecting userId and bookmark status to be passed
  
  try {
    await connectToDB();

    // Find the prompt by ID
    const prompt = await Prompt.findById(params.id);

    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    // Check if the user has already bookmarked the prompt
    if (bookmark) {
      // User wants to bookmark the prompt, so we add the bookmark
      if (!prompt.bookmarks.includes(userId)) {
        prompt.bookmarks.push(userId);
      }
    } else {
      // User wants to remove the bookmark, so we remove it
      prompt.bookmarks = prompt.bookmarks.filter(id => id.toString() !== userId);
    }

    await prompt.save();

    // Return the updated prompt with the new bookmark count
    return new Response(JSON.stringify({ bookmarks: prompt.bookmarks.length }), { status: 200 });
  } catch (error) {
    return new Response("Error updating prompt bookmarks", { status: 500 });
  }
};
