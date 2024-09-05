// components/Comment.js
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LoadingIcon } from '@constants/icons';

const Comment = ({ comment, onReply, user, userDetails }) => {
    const router = useRouter();

    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [visibleRepliesCount, setVisibleRepliesCount] = useState(1); // Start with 1 reply visible
    const [loadingMoreReplies, setLoadingMoreReplies] = useState(false);

    const handleReply = () => {
        onReply(comment._id, replyContent);
        setReplyContent('');
        setShowReplyBox(false);
    };

    const handleProfileClick = async () => {
        if (comment.userId._id === user.id) {
            router.push("/profile");
        } else {
            router.push(`/profile/${comment.userId._id}?name=${comment.userId.username}`);
        }
    };

    const handleSeeMoreReplies = () => {
        setLoadingMoreReplies(true);
        setVisibleRepliesCount((prevCount) => prevCount + 1); // Increment visible replies by 1
        setLoadingMoreReplies(false);
    };

    return (
        <div className="comment p-4 bg-gray-100 rounded-md my-2">
            <div className="flex items-center mb-2 space-x-2 cursor-pointer" onClick={handleProfileClick}>
                <Image
                    src={comment.userId.image || userDetails?.userImage}
                    alt={`${comment.userId.username || userDetails?.userName}'s profile picture`}
                    width={40}
                    height={40}
                    className="rounded-full object-contain"
                />
                <p className="font-bold">{comment.userId.username || userDetails?.userName}</p>
            </div>
            <p>{comment.content}</p>
            <button className="text-blue-500 text-sm mt-2" onClick={() => setShowReplyBox(!showReplyBox)}>
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
                    <button className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md" onClick={handleReply}>
                        Submit
                    </button>
                </div>
            )}

            {/* Display nested replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-4 border-l border-b border-gray-300 pl-4 mt-2">
                    {comment.replies.slice(0, visibleRepliesCount).map((reply) => (
                        <Comment key={reply._id} comment={reply} onReply={onReply} user={user} userDetails={userDetails} />
                    ))}
                    {visibleRepliesCount < comment.replies.length && (
                        <button
                            onClick={handleSeeMoreReplies}
                            disabled={loadingMoreReplies}
                            className={`group mt-2 p-2 rounded-md
                                ${loadingMoreReplies ? "bg-gray-400 cursor-not-allowed" : "text-blue-500 hover:underline hover:bg-gray-200"}`}
                        >
                            {/* {loadingMoreReplies ? "Loading..." : "See More Replies"} */}

                            {loadingMoreReplies ? 
                                <span className="flex items-center space-x-2">
                                    <LoadingIcon className={"animate-spin fill-white w-4 h-4"} />
                                    <p>Loading...</p>
                                </span> : 
                                `See ${comment.replies.length - visibleRepliesCount} More Replies`
                            }
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Comment;
