import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import FollowButton from './FollowButton';
import Follows from './followsDir/Follows';

const UserBio = ({ userId }) => {
  const { data: session } = useSession();

  // State variables to store user details
  const [userDetails, setUserDetails] = useState({ userName: "", userImage: "" });
  const [userCreatedAt, setUserCreatedAt] = useState(null);

  useEffect(() => {
    // If the userId is invalid, log an error and return
    if (!userId || !userId.id) {
      console.error("Invalid userId:", userId);
      return;
    }

    // Fetch user details from the API
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/users/${userId.id}/user-data`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Set user details and format the account creation date to long format
        setUserDetails({ 
          userName: data.username || "Unknown User", 
          userImage: data.image || "/default-profile.png" 
        });
        setUserCreatedAt(new Date(data.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric', 
          month: 'long', 
          year: 'numeric'
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Fetch user details when component mounts or userId changes
    fetchUserDetails();
  }, [userId]);

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div>
          {/* Display the user's profile image */}
          {userDetails.userImage ? (
            <Image
              src={userDetails.userImage}
              width={80}
              height={80}
              quality={100}
              className='rounded-full'
              alt='profile'
            />
          ) : (
            <p>Loading image...</p>
          )}

          {/* Display the user's name, username, and account creation date */}
          <div className='mt-4 space-y-2'>
            {userDetails.userName ? (
              <>
                <p className="font-satoshi font-semibold text-gray-900">{userDetails.userName}</p>
                <p className="font-inter text-sm text-gray-500">@{userDetails.userName}</p>
                <p className='font-inter text-sm text-gray-500 text-left'>
                  <strong>Member since: </strong>{userCreatedAt || 'Not Available'}
                </p>
              </>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
        </div>

        {/* Show the Follow/Unfollow button if logged in and viewing another user's profile */}
        {session && userId.id !== session.user.id && (
          <FollowButton userId={userId.id} />
        )}
      </div>
      
      {/* Display the followers and following counts */}
      <Follows userId={userId} userDetails={userDetails} loggedInUserId={session?.user.id} />
    </div>
  );
};

export default UserBio;
