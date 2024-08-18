// pages/api/users/[userId]/followings.js

import Follow from "@models/follow";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    // Find users that the current user is following
    const followings = await Follow.find({ follower: params.id })
      .populate('following', 'username image email')
      .sort({ createdAt: -1 });

    // Format the response
    const formattedFollowings = followings.map(follow => ({
      following: follow.following,
      followedAt: follow.createdAt,
    }));

    return new Response(JSON.stringify(formattedFollowings), { status: 200 });
  } catch (error) {
    return new Response("Error retrieving followings", { status: 500 });
  }
};
