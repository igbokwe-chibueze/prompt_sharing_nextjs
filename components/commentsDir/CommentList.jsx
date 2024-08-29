// components/CommentList.js
import { useState, useEffect } from 'react';
import Comment from './Comment';
import { useSession } from 'next-auth/react';
import { ChatBubbleIcon } from '@constants/icons';
import { usePathname, useRouter } from 'next/navigation';

const CommentList = ({ post }) => {
    const { data: session } = useSession();
    const pathName = usePathname(); // Get the current route path
    const router = useRouter(); // Next.js router for navigation

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [countComments, setCountComments] = useState([]);

    const [userDetails, setUserDetails] = useState({ userName: "", userImage: "" });

    // Destructure user information from session
    const user = session?.user;

    const postId = post._id
    const postCreator = post.creator._id

    useEffect(() => {

        const fetchCommentsAndCount = async () => {
            try {
                // Fetch comments with replies
                const responseComments = await fetch(`/api/comments/${postId}`);
                const commentsData = await responseComments.json();
                setComments(commentsData); // Set the comments with the fully populated data
        
                // Fetch the total count of comments and replies
                const responseCount = await fetch(`/api/comments/${postId}?count=true`);
                const countData = await responseCount.json();
                setCountComments(countData.total);
        
            } catch (error) {
                console.error('Failed to fetch comments or count:', error);
            }
        };
        

        // Fetch user details from the API
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/users/${user.id}/user-data`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
    
            // Set user details and format the account creation date to long format
            setUserDetails({ 
                userName: data.username || "Unknown User", 
                userImage: data.image || "/default-profile.png" 
            });
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
  
        fetchUserDetails();
        fetchCommentsAndCount();
    }, [postId, user]);

    // Handles prompt click - shows login popup if not logged in
    const handlePromptClick = async () => {
        if (!session) {
            // Redirect to login page with message
            const message = "Sorry need to be logged in to view prompt details. Please log in to continue.";
            router.push(`/login?message=${message}`);
            return;
        }

            // Determine if the logged-in user is the creator of the prompt
            if ( postCreator !== user.id) {
                // Increment the prompt click count if not the creator
                try {
                    await fetch(`/api/prompt/${post._id}/incrementPromptClick`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    });
                } catch (error) {
                    console.log("Error:", error);
                }
            }

        // Navigate to the prompt details page
        router.push(`/promptDetails/${postId}`);
    };


    const handleNewComment = async () => {
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, userId: session?.user.id, content: newComment }),
            });

            if (res.ok) {
                const createdComment = await res.json();
                setComments([createdComment, ...comments]); // Prepend the new comment to the existing list
                setNewComment('');
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };

    const handleReply = async (parentCommentId, replyContent) => {
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, userId: session?.user.id, content: replyContent, parentCommentId }),
            });

            if (res.ok) {
                const createdReply = await res.json();
                setComments((prevComments) => {
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

    return (
        <div className="comment-list">
            <div 
                className={`flex items-center ${pathName !== `/promptDetails/${postId}` ? "cursor-pointer" : ""}`}
                onClick={pathName !== `/promptDetails/${postId}` ? handlePromptClick : undefined}
            >
                <ChatBubbleIcon className={`text-gray-800 ${pathName !== `/promptDetails/${postId}` ? "hover:fill-gray-800" : ""}`}/>
                <p>{countComments}</p>
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
                            userDetails={userDetails} // Pass user info to Comment component
                        />
                    ))}
                </div>
            )}
            
        </div>
    );
};

export default CommentList;
