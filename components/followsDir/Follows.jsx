import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import qs from 'query-string';
import Image from 'next/image';

const Follows = ({ userId, userDetails, loggedInUserId, displayCount = 2 }) => {
    const router = useRouter();

    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [mutuals, setMutuals] = useState([]);

    useEffect(() => {
        if (!userId || !userId.id) {
            console.error("Invalid userId:", userId);
            return;
        }

        const fetchFollowersCount = async () => {
            const response = await fetch(`/api/users/${userId.id}/followers`);
            const data = await response.json();
            setFollowersCount(data.length);
        };

        const fetchFollowingCount = async () => {
            const response = await fetch(`/api/users/${userId.id}/followings`);
            const data = await response.json();
            setFollowingCount(data.length);
        };

        const fetchMutuals = async () => {
            const response = await fetch(`/api/users/${userId.id}/mutuals?loggedInUserId=${loggedInUserId}`);
            const data = await response.json();
            setMutuals(data);
        };

        fetchFollowersCount();
        fetchFollowingCount();
        fetchMutuals();
      
    }, [userId]);

    const handleNavigateToFollowers = () => {
        const queryString = qs.stringify({ name: userDetails.userName, image: userDetails.userImage });
        router.push(`/profile/${userId.id}/followers?${queryString}`);
    };

    const handleNavigateToFollowing = () => {
        const queryString = qs.stringify({ name: userDetails.userName, image: userDetails.userImage });
        router.push(`/profile/${userId.id}/following?${queryString}`);
    };

    const handleNavigateToMutual = () => {
        const queryString = qs.stringify({
            name: userDetails.userName,
            image: userDetails.userImage,
            mutuals: JSON.stringify(mutuals),
        });
        router.push(`/profile/${userId.id}/mutuals?${queryString}`);
    };

    return (
        <>
            <div className="mt-4 space-y-4">
                {/* mutuals */}
                <div 
                    className="flex items-center gap-2 cursor-pointer
                    font-inter text-sm text-gray-500" 
                    onClick={handleNavigateToMutual}
                >
                    {/* Display Mutuals Images */}
                    <div className="flex justify-center md:justify-start items-center -space-x-3 overflow-hidden peer">
                        {mutuals.slice(0, displayCount).map((mutual, index) => (
                            <Image
                                key={`image-${index}`}
                                src={mutual.follower.image}
                                width={30}
                                height={30}
                                className="object-cover border-2 border-white rounded-full"
                                alt={`${mutual.follower.username}'s profile picture`}
                            />
                        ))}
                    </div>

                    <div className='peer-hover:underline flex items-center gap-2'>
                        <p>Followed by </p>
                        
                        {/* Display Mutuals Usernames */}
                        <div className="flex items-center gap-2">
                            {mutuals.slice(0, displayCount).map((mutual, index) => (
                                <span key={`name-${index}`}>{mutual.follower.username},</span>
                            ))}
                        </div>

                        {/* Display "See more" or count */}
                        <div>
                            {mutuals.length > displayCount ? (
                                <span>
                                    and {mutuals.length - displayCount} other of your mutual
                                </span>
                            ) : (
                                mutuals.length <= displayCount && (
                                    <span>
                                        See all
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex gap-4'>
                    {/* Followers */}
                    <button onClick={handleNavigateToFollowers}>
                        Followers: {followersCount}
                    </button>
                    
                    {/* Followings */}
                    <button onClick={handleNavigateToFollowing}>
                        Following: {followingCount}
                    </button>
                </div>

            </div>
        </>
    );
};

export default Follows;
