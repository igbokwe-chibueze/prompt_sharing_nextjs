import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import qs from 'query-string'; // Import query-string to help with query string creation

const Follows = ({ userId, userDetails, loggedInUserId }) => {
    const router = useRouter();

    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [mutualCount, setMutualCount] = useState(0);

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

        const fetchMutualCount = async () => {
            const response = await fetch(`/api/users/${userId.id}/mutuals?loggedInUserId=${loggedInUserId}`);
            const data = await response.json();
            setMutualCount(data.length);
        };

        fetchFollowersCount();
        fetchFollowingCount();
        fetchMutualCount();
      
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
        const queryString = qs.stringify({ name: userDetails.userName, image: userDetails.userImage });
        router.push(`/profile/${userId.id}/mutuals?loggedInUserId=${loggedInUserId}&${queryString}`);
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
                <button onClick={handleNavigateToMutual}>
                    Mutual: {mutualCount}
                </button>
            </div>
        </>
    );
};

export default Follows;
