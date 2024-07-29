import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
    // Extract the data from the post request of the form.
    const { userId, prompt, tag } = await request.json();

    try {
        await connectToDB(); // connect to the data base 
        const newPrompt = new Prompt({ creator: userId, prompt, tag }); // Create a new prompt and pass it to prompt.js

        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}