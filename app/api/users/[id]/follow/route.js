import { connectToDB } from "@utils/database";
import Follow from "@models/follow";

export const POST = async (request) => {
    try {
        await connectToDB();

        // Extract followerId and followingId from the request body
        const { userId, followingId } = await request.json();

        // Check if the follow relationship already exists
        const followExists = await Follow.findOne({ follower: userId, following: followingId });

        if (followExists) {
            return new Response("Already following", { status: 400 });
        }

        // Create a new follow relationship
        const newFollow = new Follow({ follower: userId, following: followingId });
        await newFollow.save();

        return new Response("User followed successfully", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Failed to follow user", { status: 500 });
    }
};

export const DELETE = async (request) => {
    try {
        await connectToDB();

        // Extract followerId and followingId from the request body
        const { userId, followingId } = await request.json();

        // Delete the follow relationship
        const result = await Follow.findOneAndDelete({ follower: userId, following: followingId });

        if (!result) {
            return new Response("Follow relationship not found", { status: 404 });
        }

        return new Response("User unfollowed successfully", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Failed to unfollow user", { status: 500 });
    }
};
