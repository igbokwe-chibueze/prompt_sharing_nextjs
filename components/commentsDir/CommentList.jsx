// components/CommentList.js
import { useState, useEffect } from 'react';
import Comment from './Comment';
import { useSession } from 'next-auth/react';

const CommentList = ({ postId }) => {
    const { data: session } = useSession();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

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
        fetchComments();
    }, [postId]);

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

    // Destructure user information from session
    const user = session?.user;

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
                />
            ))}
        </div>
    );
};

export default CommentList;
