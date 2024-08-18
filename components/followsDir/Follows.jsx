import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import qs from 'query-string'; // Import query-string to help with query string creation

const Follows = ({ userId, userDetails }) => {
    const router = useRouter();

    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

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

        fetchFollowersCount();
        fetchFollowingCount();
      
    }, [userId]);

    const handleNavigateToFollowers = () => {
        const queryString = qs.stringify({ name: userDetails.userName, image: userDetails.userImage });
        router.push(`/profile/${userId.id}/followers?${queryString}`);
    };

    const handleNavigateToFollowing = () => {
        const queryString = qs.stringify({ name: userDetails.userName, image: userDetails.userImage });
        router.push(`/profile/${userId.id}/following?${queryString}`);
    };

    return (
        <>
            <div className="flex gap-4 mt-4">
                <button onClick={handleNavigateToFollowers}>
                    Followers: {followersCount}
                </button>
                <button onClick={handleNavigateToFollowing}>
                    Following: {followingCount}
                </button>
            </div>
        </>
    );
};

export default Follows;
