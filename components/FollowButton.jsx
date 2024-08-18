"use client";

import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { LoadingIcon } from "@constants/icons";

const FollowButton = ({ userId }) => {
    const { data: session } = useSession();
    const [theyFollowYou, setTheyFollowYou] = useState(false);
    const [youFollowThem, setYouFollowThem] = useState(false);
    const [submitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchFollowStatus = async () => {
            if (!userId || !session?.user?.id) return;

            setIsSubmitting(true);

            try {
                // Check if the logged-in user follows the profile user
                const followersResponse = await fetch(`/api/users/${userId}/followers`);
                const followers = await followersResponse.json();
                setYouFollowThem(followers.some(follow => follow.follower._id === session.user.id));

                // Check if the profile user follows the logged-in user
                const followingResponse = await fetch(`/api/users/${userId}/followings`);
                const following = await followingResponse.json();
                setTheyFollowYou(following.some(follow => follow.following._id === session.user.id));
            } catch (error) {
                console.error("Failed to fetch follow status:", error);
            } finally {
                setIsSubmitting(false);
            }
        };

        fetchFollowStatus();
    }, [userId]);

    const handleFollowToggle = async () => {
        if (!session) return;

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/users/${userId}/follow`, {
                method: youFollowThem ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    followingId: userId
                }),
            });

            if (response.ok) {
                setYouFollowThem(!youFollowThem);  // Toggle the follow state
            }
        } catch (error) {
            console.error("Failed to update follow status:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4 text-gray-700">
            <p>{youFollowThem ? "You are following this user" : "You are not following this user"}</p>
            <p>{theyFollowYou ? "This user follows you" : "This user does not follow you"}</p>
            <button
                onClick={handleFollowToggle}
                disabled={submitting}
                className={`mt-2 px-4 py-2 rounded-full 
                    ${submitting ? "bg-gray-400 cursor-not-allowed" : youFollowThem ? "black_btn" : "outline_btn"}`}
            >
                {submitting ? (
                    <span className="flex items-center space-x-2">
                        <LoadingIcon className={"animate-spin fill-white"}/>
                        <p>Loading...</p>
                    </span>
                ) : youFollowThem ? "Unfollow" : "Follow"}
            </button>
        </div>
    );
};

export default FollowButton;
