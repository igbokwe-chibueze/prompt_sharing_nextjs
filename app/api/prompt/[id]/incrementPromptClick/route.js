import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (request, { params }) => {
  
  try {
    await connectToDB();

    // Find the prompt by ID
    const prompt = await Prompt.findById(params.id);

    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    const updatedPrompt = await Prompt.findByIdAndUpdate(
        prompt,
        { $inc: { promptClickCount: 1 } }, // Use the $inc operator to increment the promptClickCount by 1
        { new: true } // Return the updated document after the update operation
    );

    // Return the updated prompt with the new bookmark count
    return new Response(JSON.stringify({ updatedPrompt }), { status: 200 });
  } catch (error) {
    return new Response("Error updating prompt bookmarks", { status: 500 });
  }
};
