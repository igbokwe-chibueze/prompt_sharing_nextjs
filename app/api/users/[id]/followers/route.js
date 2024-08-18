// pages/api/users/[userId]/followers.js

import Follow from "@models/follow";
import { connectToDB } from "@utils/database";



export const GET = async (request, { params }) => {

  try {
    await connectToDB();

    // Find followers of the user, including the date they started following
    const followers = await Follow.find({ following: params.id })
      .populate('follower', 'username image email')
      .sort({ createdAt: -1 }); // Sort by most recent followers

    // Format the response to include the follow duration
    const formattedFollowers = followers.map(follow => ({
      follower: follow.follower,
      followedAt: follow.createdAt,
    }));

    return new Response(JSON.stringify(formattedFollowers), { status: 200 });
  } catch (error) {
    return new Response("Error retrieving followers", { status: 500 });
  }
};
