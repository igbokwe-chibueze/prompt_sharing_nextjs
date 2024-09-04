import { useState, useEffect } from 'react';
import Comment from './Comment';
import { useSession } from 'next-auth/react';
import { ChatBubbleIcon, LoadingIcon } from '@constants/icons';
import { usePathname, useRouter } from 'next/navigation';

const CommentList = ({ post }) => {
    // Session management
    const { data: session } = useSession();
    const user = session?.user; // Destructure user information from session

    // Routing and path management
    const pathName = usePathname();
    const router = useRouter();

    // State management for comments, new comment input, and user details
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userDetails, setUserDetails] = useState({ userName: "", userImage: "" });

    // State management for comments count and limits
    const [totalCommentsAndRepliesCount, setTotalCommentsAndRepliesCount] = useState(0);
    const [totalRootCommentsCount, setTotalRootCommentsCount] = useState(0);
    const [commentsLimit, setCommentsLimit] = useState(2); // Initial limit for comments
    const [repliesLimit] = useState(1); // Fixed limit for replies
    const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false); // Track loading state for "See More" button

    // Extract post details for easier reference
    const postId = post._id;
    const postCreator = post.creator._id;

    useEffect(() => {
        // Fetches comments and their count from the server
        const fetchCommentsAndCount = async () => {
            try {
                // Fetch comments with replies based on the current limits
                const responseComments = await fetch(`/api/comments/${postId}?commentsLimit=${commentsLimit}&repliesLimit=${repliesLimit}`);
                const commentsData = await responseComments.json();
                setComments(commentsData); // Update state with fetched comments

                // Fetch the total count of comments and replies
                const responseCount = await fetch(`/api/comments/${postId}?count=true`);
                const countData = await responseCount.json();
                setTotalCommentsAndRepliesCount(countData.totalCount); // Total count including replies
                setTotalRootCommentsCount(countData.commentsCount); // Count of root comments (not replies)
            } catch (error) {
                console.error('Failed to fetch comments or count:', error);
            } finally {
                setIsLoadingMoreComments(false); // Reset loading state after fetching
            }
        };

        // Fetch user details such as username and profile image
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/users/${user.id}/user-data`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUserDetails({
                    userName: data.username || "Unknown User",
                    userImage: data.image || "/default-profile.png"
                });
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (user) fetchUserDetails(); // Only fetch user details if user is logged in
        fetchCommentsAndCount(); // Fetch comments and their count whenever dependencies change
    }, [postId, user, commentsLimit]);

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

    // Handle submission of a new comment
    const handleNewComment = async () => {
        if (!newComment.trim()) return; // Prevent empty comments from being submitted

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, userId: user.id, content: newComment }),
            });

            if (res.ok) {
                const createdComment = await res.json();
                setComments([createdComment, ...comments]); // Add the new comment at the top of the list
                setNewComment(''); // Clear the comment input field
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };

    // Handle submission of a reply to a specific comment
    const handleReply = async (parentCommentId, replyContent) => {
        if (!replyContent.trim()) return; // Prevent empty replies from being submitted

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, userId: user.id, content: replyContent, parentCommentId }),
            });

            if (res.ok) {
                const createdReply = await res.json();
                setComments((prevComments) => {
                    // Recursively find the parent comment and add the reply to it
                    const addReplyToComment = (comment) => {
                        if (comment._id === parentCommentId) {
                            return {
                                ...comment,
                                replies: [...(comment.replies || []), createdReply],
                            };
                        }
                        if (comment.replies) {
                            return {
                                ...comment,
                                replies: comment.replies.map(addReplyToComment),
                            };
                        }
                        return comment;
                    };
                    return prevComments.map(addReplyToComment);
                });
            }
        } catch (error) {
            console.error('Failed to post reply:', error);
        }
    };

    // Handle the "See More Comments" button click
    const handleSeeMoreComments = async () => {
        setIsLoadingMoreComments(true); // Set loading state to true
        setCommentsLimit((prevLimit) => prevLimit + 2); // Increase the comments limit to fetch more comments
    };

    return (
        <div className="comment-list">
            <div 
                className={`flex items-center ${pathName !== `/promptDetails/${postId}` ? "cursor-pointer" : ""}`}
                onClick={pathName !== `/promptDetails/${postId}` ? handlePromptClick : undefined}
            >
                <ChatBubbleIcon className={`text-gray-800 ${pathName !== `/promptDetails/${postId}` ? "hover:fill-gray-800" : ""}`}/>
                <p>{totalCommentsAndRepliesCount}</p>
            </div>

            {pathName === `/promptDetails/${postId}` && (
                <div>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                    />
                    <button onClick={handleNewComment}>Submit</button>
    
                    {comments.map((comment) => (
                        <Comment 
                            key={comment._id} 
                            comment={comment} 
                            onReply={handleReply} 
                            user={user} // Pass user info to Comment component
                            userDetails={userDetails} // Pass user details to Comment component
                        />
                    ))}

                    {comments.length < totalRootCommentsCount && (
                        <button 
                            onClick={handleSeeMoreComments} disabled={isLoadingMoreComments}
                            className={`group mt-2 px-4 py-2 rounded-full 
                                ${isLoadingMoreComments ? "bg-gray-400 cursor-not-allowed" : "outline_btn"}`}
                        >
                            {isLoadingMoreComments ? 
                                <span className="flex items-center space-x-2">
                                    <LoadingIcon className={"animate-spin fill-white w-4 h-4"} />
                                    <p>Loading...</p>
                                </span> : 
                                `See ${totalRootCommentsCount - comments.length} More Comments`
                            }
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentList;
