// pages/api/users/[userId]/mutual

import Follow from "@models/follow";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  const { searchParams } = new URL(request.url);
  const loggedInUserId = searchParams.get('loggedInUserId'); // Get the logged-in user's ID from the query parameters

  try {
    await connectToDB();

    // Get followers of the profile user (params.id)
    const profileUserFollowers = await Follow.find({ following: params.id }).select('follower');
    
    // Get the followings of the logged-in user
    const loggedInUserFollowings = await Follow.find({ follower: loggedInUserId }).select('following');

    // Extract IDs for comparison
    const profileUserFollowerIds = profileUserFollowers.map(follow => follow.follower.toString());
    const loggedInUserFollowingIds = loggedInUserFollowings.map(follow => follow.following.toString());

    // Find mutuals by checking where the IDs match
    const mutualFollowerIds = profileUserFollowerIds.filter(id => loggedInUserFollowingIds.includes(id));

    // Populate mutual followers
    const mutualFollowers = await Follow.find({
      follower: { $in: mutualFollowerIds },
      following: params.id
    }).populate('follower', 'username image email');

    // Format the response
    const formattedMutuals = mutualFollowers.map(follow => ({
      follower: follow.follower,
      followedAt: follow.createdAt,
    }));

    return new Response(JSON.stringify(formattedMutuals), { status: 200 });
  } catch (error) {
    return new Response("Error retrieving mutual followers", { status: 500 });
  }
};
