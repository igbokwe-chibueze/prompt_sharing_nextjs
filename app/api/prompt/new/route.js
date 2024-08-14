import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  try {
    await connectToDB(); // Connect to the database

    const { userId, prompt, tags } = await request.json();

    // Validate input
    if (!userId || !prompt || !tags || !Array.isArray(tags)) {
      console.error("Invalid input data:", { userId, prompt, tags });
      return new Response("Invalid input", { status: 400 });
    }

    const newPrompt = new Prompt({
      creator: userId,
      prompt,
      tags, // Ensure tags is an array
      createdAt: new Date(),
    });

    await newPrompt.save();
    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    console.error("Error creating new prompt:", error); // Log the error
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
