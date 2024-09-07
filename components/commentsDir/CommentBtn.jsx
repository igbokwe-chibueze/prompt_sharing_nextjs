import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { ChatBubbleIcon } from '@constants/icons';

const CommentBtn = ({ post }) => {
    // Session management
    const { data: session } = useSession();
    const user = session?.user; // Destructure user information from session

    // Routing and path management
    const pathName = usePathname();
    const router = useRouter();

    // State management for comments count and limits
    const [totalCommentsAndRepliesCount, setTotalCommentsAndRepliesCount] = useState(0);

    // Extract post details for easier reference
    const postId = post._id;
    const postCreator = post.creator._id;

    useEffect(() => {
        // Fetches comments and their count from the server
        const fetchCommentsAndCount = async () => {
            try {
                // Fetch the total count of comments and replies
                const responseCount = await fetch(`/api/comments/${postId}?count=true`);
                const countData = await responseCount.json();
                setTotalCommentsAndRepliesCount(countData.totalCount); // Total count including replies
            } catch (error) {
                console.error('Failed to fetch comments or count:', error);
            }
        };

        fetchCommentsAndCount(); // Fetch comments and their count whenever dependencies change
    }, [postId, totalCommentsAndRepliesCount]);

    // Handle navigation when the prompt is clicked
    const handlePromptClick = async () => {
        if (!session) {
            // If user is not logged in, redirect to login page with a message
            const message = "Sorry, you need to be logged in to view prompt details. Please log in to continue.";
            router.push(`/login?message=${message}`);
            return;
        }

        // If the user is not the creator of the prompt, increment the prompt click count
        if (postCreator !== user.id) {
            try {
                await fetch(`/api/prompt/${postId}/incrementPromptClick`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.log("Error incrementing prompt click:", error);
            }
        }

        // Navigate to the prompt details page
        router.push(`/promptDetails/${postId}`);
    };

  return (
    <>
        <div 
            className={`flex items-center ${pathName !== `/promptDetails/${postId}` ? "cursor-pointer" : ""}`}
            onClick={pathName !== `/promptDetails/${postId}` ? handlePromptClick : undefined}
        >
            <ChatBubbleIcon className={`text-gray-800 ${pathName !== `/promptDetails/${postId}` ? "hover:fill-gray-800" : ""}`}/>
            <p className="text-sm text-gray-700">{totalCommentsAndRepliesCount}</p>
        </div>
    </>
  )
}

export default CommentBtn