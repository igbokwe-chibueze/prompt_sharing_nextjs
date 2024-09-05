import { useRouter } from "next/navigation";
import { useState } from "react";

import { HeartIcon } from "@constants/icons";

const Liking = ({ post, session }) => {

    const router = useRouter(); // Next.js router for navigation

    // State to manage if the prompt is liked by the current user
    const [liked, setLiked] = useState(post.likes.includes(session?.user.id));
    // State to manage the number of likes
    const [likeCount, setLikeCount] = useState(post.likes.length);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleLike = async () => {
        if (!session) {
            router.push(`/login?message=You need to be logged in to like this post.`);
            return;
        }
    
        const newLikedStatus = !liked;
        setLiked(newLikedStatus); // Optimistically update the icon
        setIsSubmitting(true);
    
        try {
            const response = await fetch(`/api/prompt/${post._id}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    like: newLikedStatus
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update like");
            }
    
            const data = await response.json();
            setLikeCount(data.likes); // Update like count only after successful response
        } catch (error) {
            console.log("Error:", error);
            // Revert icon state on failure
            setLiked(!newLikedStatus);
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <>
        <div className="like_btn" onClick={handleLike} disabled={isSubmitting}>
            <HeartIcon className={`text-gray-800 ${liked ? "fill-gray-800" : "hover:fill-gray-800"}`}/>
            <p className="text-sm text-gray-700">{likeCount}</p>
        </div>
    </>
  )
}

export default Liking