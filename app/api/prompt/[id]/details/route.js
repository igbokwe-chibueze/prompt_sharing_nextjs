import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

/**
 * GET API Route
 * Fetches the details of a specific prompt based on the provided parameters.
 */
export const GET = async (request, { params }) => {
  try {
    await connectToDB(); // Ensure the database connection is established

    // Fetch the prompt from the database using the provided params
    const prompt = await Prompt.find(params[1]).populate("creator");

    if (!prompt) {
      return new Response("Prompt Not Found", { status: 404 }); // Return 404 if no prompt is found
    }

    // Return the prompt data as a JSON response
    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 }); // Handle server errors
  }
};
