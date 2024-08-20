import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import FollowButton from "@components/FollowButton";

const FollowsList = ({ follows, listType, userId }) => {
  const router = useRouter();
  const { data: session } = useSession();

  // Determine if the current profile being viewed is the logged-in user's profile
  const isOwnProfile = userId === session?.user?.id;

  // Define lists and no follow messages based on listType
  const listData = {
    followers: {
      list: follows.followers,
      noFollowsMessage: isOwnProfile
        ? "You have no followers yet."
        : "This user has no followers yet."
    },
    following: {
      list: follows.following,
      noFollowsMessage: isOwnProfile
        ? "You are not following anyone yet."
        : "This user is not following anyone yet."
    },
    mutuals: {
      list: follows.mutuals,
      noFollowsMessage: isOwnProfile
        ? "You have no mutual followers yet."
        : "This user has no mutual followers yet."
    }
  };

  // Extract the list and no follows message for the selected listType
  const { list, noFollowsMessage } = listData[listType] || {
    list: [],
    noFollowsMessage: "No users found."
  };

  /**
   * Handles profile click by navigating to the respective user's profile.
   * If the user is not logged in, redirects to the login page with a message.
   * If the clicked profile is the logged-in user's, navigates to their profile page.
   * Otherwise, navigates to the clicked user's profile page.
   */
  const handleProfileClick = (targetUserId, username) => {
    if (!session) {
      // Redirect to login page with a message if not logged in
      router.push(`/login?message=You need to be logged in to view this profile. Please log in to continue.`);
      return;
    }
    // Navigate to the user's own profile or the clicked user's profile
    const isOwnProfile = targetUserId === session.user.id;
    router.push(isOwnProfile ? "/profile" : `/profile/${targetUserId}?name=${username}`);
  };

  return (
    <div>
      {/* Render the list if there are users in the list, otherwise display the noFollowsMessage */}
      {list?.length ? (
        <ul className="space-y-6">
          {list.map((follow) => {
            // Determine the user data to display based on listType
            const user = follow.follower || follow.following || follow.user;

            return (
              <li key={user?._id} className="border p-4 rounded-md border-gray-500">
                <div
                  onClick={() => handleProfileClick(user?._id, user.username)}
                  className="flex justify-normal items-center space-x-2 cursor-pointer"
                >
                  {/* Display user image */}
                  <Image
                    src={user?.image}
                    alt={user?.username}
                    width={60}
                    height={60}
                    className="rounded-full object-contain"
                  />
                  {/* Display user information */}
                  <div className="space-y-1">
                    <h3 className="font-satoshi font-semibold text-gray-900">{user?.username}</h3>
                    <p className="font-inter text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                {/* Conditionally render the FollowButton if the user is not viewing their own profile */}
                {session && user?._id !== session.user.id && (
                  <FollowButton userId={user?._id} />
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
