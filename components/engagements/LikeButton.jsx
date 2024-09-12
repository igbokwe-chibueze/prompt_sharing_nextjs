import { HeartIcon } from '@constants/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

const LikeButton = ({ entity, user, entityType, initialCount }) => {

    const router = useRouter();
    const [isLiked, setIsLiked] = useState(entity?.likes.includes(user?.id));
    const [likeCount, setLikeCount] = useState(initialCount);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLike = async () => {
        if (!user) {
            router.push(`/login?message=You need to be logged in to like this post.`);
            return;
        }

        const newLikedStatus = !isLiked;
        setIsLiked(newLikedStatus);
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/like/${entity._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    entityType: entityType
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update like");
            }

            const data = await response.json();
            setLikeCount(data.likes);
        } catch (error) {
            console.log("Error:", error);
            setIsLiked(!newLikedStatus);
        } finally {
            setIsSubmitting(false);
        }
    };

  return (

    <div className='flex items-center'>
        <div 
            onClick={handleLike} disabled={isSubmitting}
            className="p-2 rounded-full transition-colors duration-200 text-gray-800 hover:bg-gray-300"
        >
            <HeartIcon className={`text-gray-800 ${isLiked ? "fill-gray-800" : ""}`}/>
            <span className="sr-only">{isLiked ? 'Unlike' : 'Like'}</span>
        </div>

        <p className="text-sm text-gray-500">{likeCount}</p>
    </div>
  )
}

export default LikeButton