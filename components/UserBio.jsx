import Image from 'next/image';
import { useEffect, useState } from 'react';

const UserBio = ({ userId }) => {
  // State variables to store user details
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userCreatedAt, setUserCreatedAt] = useState(null);

  useEffect(() => {
    if (!userId || !userId.id) {
      console.error("Invalid userId:", userId);
      return;
    }

    // Fetch user details from API
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/users/${userId.id}/user-data`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Set user details in state
        setUserName(data.username || "Unknown User");
        setUserImage(data.image || "/default-profile.png"); // Fallback to a default image if image is not provided
        setUserCreatedAt(new Date(data.createdAt).toLocaleDateString());
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <>
      {/* Display user's profile image */}
      {userImage ? (
        <Image
          src={userImage}
          width={80}
          height={80}
          quality={100}
          className='rounded-full'
          alt='profile'
        />
      ) : (
        <p>Loading image...</p>
      )}

      {/* Display user's name, username, and account creation date */}
      <div className='mt-4 space-y-2'>
        {userName ? (
          <>
            <p className="font-satoshi font-semibold text-gray-900">{userName}</p>
            <p className="font-inter text-sm text-gray-500">@{userName}</p>
            <p className='font-inter text-sm text-gray-500 text-left'>
              <strong>Member since: </strong>{userCreatedAt || 'Not Available'}
            </p>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </>
  );
};

export default UserBio;
