// components/Comment.js
import { useState } from 'react';

const Comment = ({ comment, onReply }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReply = () => {
        onReply(comment._id, replyContent);
        setReplyContent('');
        setShowReplyBox(false);
    };

  return (
    <div className="comment p-4 bg-gray-100 rounded-md my-2">
        {/* Display user information */}
        <div className="flex items-center mb-2">
            <img
                src={comment.userId.image} // Display user image
                alt={`${comment.userId.username}'s profile picture`}
                className="w-8 h-8 rounded-full mr-2"
            />
            <p className="font-bold">{comment.userId.username}</p> {/* Display username */}
        </div>
        <p>{comment.content}</p>
        <button 
            className="text-blue-500 text-sm mt-2"
            onClick={() => setShowReplyBox(!showReplyBox)}
        >
            Reply
        </button>

        {showReplyBox && (
            <div className="mt-2">
            <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleReply}
            >
                Submit
            </button>
            </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
            <div className="replies">
                {comment.replies.map((reply) => (
                    <Comment key={reply._id} comment={reply} onReply={onReply} />
                ))}
            </div>
        )}
    </div>
  );
};

export default Comment;
