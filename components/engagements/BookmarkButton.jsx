import { BookmarkIcon } from '@constants/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

const BookmarkButton = ({ entity, user, entityType }) => {

    const router = useRouter();
    const [isBookmarked, setIsBookmarked] = useState(entity?.bookmarks.includes(user.id));
    const [bookmarkCount, setBookmarkCount] = useState(entity?.bookmarks.length);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBookmark = async () => {
        if (!user) {
            router.push(`/login?message=You need to be logged in to bookmark this post.`);
            return;
        }

        const newBookmarkedStatus = !isBookmarked;
        setIsBookmarked(newBookmarkedStatus);
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/bookmark/${entity._id}`, {
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
                throw new Error("Failed to update bookmark");
            }

            const data = await response.json();
            setBookmarkCount(data.bookmarks);
        } catch (error) {
            console.log("Error:", error);
            setIsBookmarked(!newBookmarkedStatus);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex items-center'>
            <div 
                onClick={handleBookmark} disabled={isSubmitting}
                className="p-2 rounded-full transition-colors duration-200 text-gray-800 hover:bg-gray-300"
            >
                <BookmarkIcon className={`text-gray-800 ${isBookmarked ? "fill-gray-800" : ""}`}/>
                <span className="sr-only">{isBookmarked ? 'Unbookmark' : 'Bookmark'}</span>
            </div>

            <p className="text-sm text-gray-500">{bookmarkCount}</p>
        </div>
    );
}

export default BookmarkButton