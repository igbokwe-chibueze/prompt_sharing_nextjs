import { ChatBubbleIcon } from "@constants/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const CommentButton = ({entity, entityType,}) => {

    const router = useRouter();
    const pathname = usePathname(); 

    // State management for comments count and limits
    const [commentsCount, setCommentsCount] = useState(0);

    const objectId = entity._id

    useEffect(() => {
        const fetchCommentCount = async () => {
            try {
                // Fetch the total count of comments and replies
                const responseCount = await fetch(`/api/comments/commentDetails/${objectId}?count=true&entityType=${entityType}`);
                const countData = await responseCount.json();
                setCommentsCount(countData.totalCount); // Total count including replies
            } catch (error) {
                console.error('Failed to fetch comments or count:', error);
            }
        };

        fetchCommentCount();
    }, [objectId, commentsCount, entityType]);

    const handleCommentButtonClick = () => {
        // Redirect to comment details page with query param to open and focus the reply box
        if (entityType === "prompt") {
            // Redirect to prompt details page if entity type is "prompt"
            router.push(`/promptDetails/${objectId}?reply=true`);
        } else if (entityType === "comment") {
            // Redirect to comment details page if entity type is "comment"
            router.push(`/commentDetails/${objectId}?reply=true`);
        }
    };

  return (
    <div 
        className={`flex items-center ${pathname.includes(objectId) ? 'pointer-events-none' : ''}`}
        onClick={handleCommentButtonClick}
    >
        <div
            className="p-2 rounded-full transition-colors duration-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
        >
            <ChatBubbleIcon className={`text-gray-800`}/>
        </div>
        <p className="text-sm text-gray-700">{commentsCount}</p>
    </div>
  )
}

export default CommentButton