// pages/api/users/[userId]/unfollowed-users.js

import User from "@models/user";
import Follow from "@models/follow";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the users the logged-in user is following
    const followings = await Follow.find({ follower: params.id }).select("following");

    // Create a list of userIds the logged-in user is following
    const followingIds = followings.map(follow => follow.following.toString());

    // Find all users except the logged-in user
    const unfollowedUsers = await User.find({
      _id: { $ne: params.id, $nin: followingIds },
    }).select("username image email");

    return new Response(JSON.stringify(unfollowedUsers), { status: 200 });
  } catch (error) {
    return new Response("Error retrieving unfollowed users", { status: 500 });
  }
};
