import { useState, useEffect } from 'react';
import Comment from './Comment';
import { useSession } from 'next-auth/react';
import { LoadingIcon } from '@constants/icons';
import { usePathname } from 'next/navigation';

const CommentList = ({ post }) => {
    // Session management
    const { data: session } = useSession();
    const user = session?.user; // Destructure user information from session

    // Routing and path management
    const pathName = usePathname();

    // State management for comments, new comment input, and user details
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userDetails, setUserDetails] = useState({ userName: "", userImage: "" });

    // State management for comments count and limits
    const [totalRootCommentsCount, setTotalRootCommentsCount] = useState(0);
    const [commentsLimit, setCommentsLimit] = useState(2); // Initial limit for comments
    const [repliesLimit] = useState(1); // Fixed limit for replies
    const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false); // Track loading state for "See More" button

    // Extract post details for easier reference
    const postId = post._id;

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

    const handleEdit = async (commentId, newContent) => {
    
        if (!commentId) return alert("Missing commentId!");
    
        try {
          const response = await fetch(`/api/comments/${commentId}`, {
            method: "PATCH",
            body: JSON.stringify({
                content: newContent
            }),
          });

          if (response.ok) {
            // Update the comment in the local state
            setComments((prevComments) => {  // Update the comments state with a function that receives the previous state
              const updateComment = (comment) => {  // Function to update a specific comment or its replies
                // If the current comment's ID matches the ID of the comment that was edited...
                if (comment._id === commentId) {
                  // Return the updated comment with new content and an updated timestamp
                  return { ...comment, content: newContent, updatedAt: new Date() };
                }
                // If the current comment has replies, recursively apply this function to the replies
                if (comment.replies) {
                  return {
                    ...comment,  // Keep the rest of the comment properties unchanged
                    replies: comment.replies.map(updateComment),  // Map over the replies to update the relevant reply
                  };
                }
                // Return the comment unchanged if it doesn't match the ID and has no replies
                return comment;
              };
              // Map over the previous comments, applying the update function to each one
              return prevComments.map(updateComment);
            });
          }
          
        } catch (error) {
          console.log(error);
        }
    };

    return (
        <div className="comment-list">
            {/* Show comments only in prompt details page */}
            {pathName === `/promptDetails/${postId}` && (
                <div>
                    <div className="mt-2">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <button 
                            onClick={handleNewComment}
                            className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
                        >
                            Submit
                        </button>
                    </div>
    
                    {comments.map((comment) => (
                        <Comment 
                            key={comment._id}
                            comment={comment}
                            onReply={handleReply}
                            onEdit={handleEdit}
                            user={user} // Pass user info to Comment component
                            userDetails={userDetails} // Pass user details to Comment component
                        />
                    ))}
                    
                    {/* See More Btn */}
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
