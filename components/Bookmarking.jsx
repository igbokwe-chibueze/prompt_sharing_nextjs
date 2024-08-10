import { useRouter } from "next/navigation";
import { useState } from "react";

import { BookmarkIcon } from "@constants/icons";


const Bookmarking = ({ post, session }) => {

    const router = useRouter(); // Next.js router for navigation

    const [isBookmarked, setIsBookmarked] = useState(post.bookmarks.includes(session?.user.id)); // State to manage if the prompt is bookmarked
    // State to manage the number of bookmarks
    const [bookmarkCount, setBookmarkCount] = useState(post.bookmarks.length);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBookmark = async () => {
        if (!session) {
            router.push(`/login?message=You need to be logged in to bookmark this post.`);
            return;
        }
    
        const newBookmarkedStatus = !isBookmarked;
        setIsBookmarked(newBookmarkedStatus); // Optimistically update the icon
        setIsSubmitting(true);
    
        try {
            const response = await fetch(`/api/prompt/${post._id}/bookmark`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    bookmark: newBookmarkedStatus
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update bookmark");
            }
    
            const data = await response.json();
            setBookmarkCount(data.bookmarks); // Update bookmark count only after successful response
        } catch (error) {
            console.log("Error:", error);
            // Revert icon state on failure
            setIsBookmarked(!newBookmarkedStatus);
        } finally {
            setIsSubmitting(false);
        }
    };


  return (
    <>
        <div className="mt-4 bookmark_btn" onClick={handleBookmark} disabled={isSubmitting}>
            <BookmarkIcon className={`text-gray-800 ${isBookmarked ? "fill-gray-800" : "hover:fill-gray-800"}`}/>
            <p>{bookmarkCount}</p>
        </div>
    </>
  )
}

export default Bookmarking