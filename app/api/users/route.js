import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
    try {
        await connectToDB();

        // Fetch all users
        const users = await User.find({});

        // Shuffle users and select a random five
        const shuffledUsers = users.sort(() => 0.5 - Math.random());
        const randomUsers = shuffledUsers.slice(0, 5);

        return new Response(JSON.stringify(randomUsers), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch users", { status: 500 });
    }
};
