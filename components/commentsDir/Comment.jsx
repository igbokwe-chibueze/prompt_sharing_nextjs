// components/Comment.js
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Comment = ({ comment, onReply, user, userDetails }) => {
    const router = useRouter(); // Next.js router for navigation

    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReply = () => {
        onReply(comment._id, replyContent); // Trigger the reply handler passed as a prop
        setReplyContent(''); // Clear the reply content after submitting
        setShowReplyBox(false); // Hide the reply box after submitting
    };

    // Handles profile click - shows login popup if not logged in
    const handleProfileClick = async () => {
        // Navigate to the appropriate profile page
        if (comment.userId._id === user.id) {
            router.push("/profile"); // Navigate to logged-in user's profile
        } else {
            router.push(`/profile/${comment.userId._id}?name=${comment.userId.username}`); // Navigate to other user's profile
        }
    };

    return (
        <div className="comment p-4 bg-gray-100 rounded-md my-2">
            {/* Display user information */}
            <div 
                className="flex items-center mb-2 space-x-2 cursor-pointer"
                onClick={handleProfileClick}
            >
                <Image
                    src={comment.userId.image || userDetails?.userImage} // Fallback to user image if not available
                    alt={`${comment.userId.username || userDetails?.userName}'s profile picture`}
                    width={40}
                    height={40}
                    className="rounded-full object-contain"
                />
                <p className="font-bold">{comment.userId.username || userDetails?.userName}</p> {/* Fallback to username if not available */}
            </div>
            <p>{comment.content}</p> {/* Display comment content */}
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

            {/* Render nested replies recursively */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-4 border-l-2 border-b-2 border-gray-300 ">
                    {comment.replies.map((reply) => (
                        <Comment key={reply._id} comment={reply} onReply={onReply} user={user} userDetails={userDetails} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;
