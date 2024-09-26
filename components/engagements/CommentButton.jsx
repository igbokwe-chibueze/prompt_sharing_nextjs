import { ChatBubbleIcon } from "@constants/icons";
import { useEffect, useState } from "react";


const CommentButton = ({entity, entityType,}) => {

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
    }, [objectId, commentsCount]);

  return (
    <div
        className={`flex items-center`}
    >
        <div
            className="p-2 rounded-full transition-colors duration-200 text-gray-800 hover:bg-gray-300"
        >
            <ChatBubbleIcon className={`text-gray-800`}/>
        </div>
        <p className="text-sm text-gray-700">{commentsCount}</p>
    </div>
  )
}

export default CommentButton