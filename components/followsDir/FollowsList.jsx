import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import FollowButton from "@components/FollowButton";

const FollowsList = ({ follows, listType, userId }) => {
  const router = useRouter();
  const { data: session } = useSession();

  /**
   * Handles profile click by navigating to the respective user's profile.
   * If the user is not logged in, redirects to the login page with a message.
   * If the clicked profile is the logged-in user's, navigates to their profile page.
   * Otherwise, navigates to the clicked user's profile page.
   */
  const handleProfileClick = (targetUserId, username) => {
    if (!session) {
      const message = "You need to be logged in to view this profile. Please log in to continue.";
      router.push(`/login?message=${message}`);
      return;
    }

    // Determine if the clicked profile is the logged-in user's profile
    router.push(targetUserId === session.user.id ? "/profile" : `/profile/${targetUserId}?name=${username}`);
  };

  // Determine if the current profile being viewed is the logged-in user's profile
  const isOwnProfile = userId === session?.user?.id;

  // Check whether the list to display is followers or following
  const isFollowersList = listType === "followers";

  // Select the appropriate list based on the type (followers or following)
  const list = isFollowersList ? follows.followers : follows.following;

  // Determine the appropriate message when the list is empty
  const noFollowsMessage = isFollowersList
    ? isOwnProfile
      ? "You have no followers yet." // Message when viewing your own profile and there are no followers
      : "This user has no followers yet." // Message when viewing another user's profile and there are no followers
    : isOwnProfile
    ? "You are not following anyone yet." // Message when viewing your own profile and you are not following anyone
    : "This user is not following anyone yet."; // Message when viewing another user's profile and they are not following anyone

  return (
    <div>
      {/* Render the list if there are followers/followings, otherwise display the noFollowsMessage */}
      {(list?.length ?? 0) > 0 ? (
        <ul className="space-y-6">
          {list.map((follow) => {
            // Determine whether to display the follower or following user
            const user = isFollowersList ? follow.follower : follow.following;
            return (
              <li
                key={user._id}
                onClick={() => handleProfileClick(user._id, user.username)}
                className="border p-4 rounded-md border-gray-500"
              >
                <div className="flex justify-normal items-center space-x-2 cursor-pointer">
                  {/* Display user image */}
                  <Image
                    src={user.image}
                    alt={user.username}
                    width={60}
                    height={60}
                    className="rounded-full object-contain"
                  />
                  {/* Display user information */}
                  <div className="space-y-1">
                    <h3 className="font-satoshi font-semibold text-gray-900">{user.username}</h3>
                    <p className="font-inter text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                {session && user._id !== session.user.id && (
                  <FollowButton userId={user._id} />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        // Display the no follows message if the list is empty
        <p className="text-center text-gray-500">{noFollowsMessage}</p>
      )}
    </div>
  );
};

export default FollowsList;
