// components/CommentList.js
import { useState, useEffect } from 'react';
import Comment from './Comment';
import { useSession } from 'next-auth/react';

const CommentList = ({ postId }) => {
    const { data: session } = useSession();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const [userDetails, setUserDetails] = useState({ userName: "", userImage: "" });

    // Destructure user information from session
    const user = session?.user;

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/comments/${postId}`);
                const data = await response.json();
                setComments(data); // Set the comments with the fully populated data
            } catch (error) {
                console.error('Failed to fetch comments:', error);
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
        fetchComments();
    }, [postId, user]);


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
    );
};

export default CommentList;
