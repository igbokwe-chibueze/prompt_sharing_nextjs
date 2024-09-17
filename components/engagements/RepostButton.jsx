
import { RepeatIcon } from '@constants/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

const RepostButton = ({ entity, user, entityType, initialCount }) => {

    const router = useRouter();
    const [isReposted, setIsReposted] = useState(entity?.reposts.some(repost => repost.repostedBy === user?.id));
    const [repostCount, setRepostCount] = useState(initialCount);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRepost = async () => {
        if (!user) {
            router.push(`/login?message=You need to be logged in to repost this post.`);
            return;
        }

        const newRepostedStatus = !isReposted;
        setIsReposted(newRepostedStatus);
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/repost/${entity._id}`, {
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
                throw new Error("Failed to update repost");
            }

            const data = await response.json();
            setRepostCount(data.reposts);
        } catch (error) {
            console.log("Error:", error);
            setIsReposted(!newRepostedStatus);
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className='flex items-center'>
        <div 
            onClick={handleRepost} disabled={isSubmitting}
            className="p-2 rounded-full transition-colors duration-200 text-gray-800 hover:bg-green-200"
        >
            <RepeatIcon className={`text-gray-800 ${isReposted ? "text-green-600" : ""}`}/>
            <span className="sr-only">{isReposted ? 'Unrepost' : 'repost'}</span>
        </div>

        <p className="text-sm text-gray-500">{repostCount}</p>
    </div>
  )
}

export default RepostButton