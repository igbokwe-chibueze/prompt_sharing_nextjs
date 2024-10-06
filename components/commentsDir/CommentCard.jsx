
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BookmarkButton, CommentButton, LikeButton, RepostButton } from '@components/engagements';
import Sharing from '@components/sharing/Sharing';

const CommentCard = ({ comment, onReply, onEdit, onDelete, user, userDetails, loadingState  }) => {

    const pathName = usePathname(); // Get the current route path
    const router = useRouter();
    const searchParams = useSearchParams()

    const [showReplyBox, setShowReplyBox] = useState(true);
    const [replyContent, setReplyContent] = useState('');

    const [showEditBox, setShowEditBox] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const replyBoxRef = useRef(null); // Create a ref for the reply textarea

    useEffect(() => {
        // Open reply box and focus on it if the query param `reply=true` is present
        if (searchParams.get('reply') === 'true') {
            setShowReplyBox(true); // Open the reply box if not already open
            if (replyBoxRef.current) {
                replyBoxRef.current.focus(); // Automatically focus the reply box
            }
        }
    }, [searchParams]);

    const handleReply = async () => {
        // Check if replyContent is empty
        if (!replyContent) return;
    
        // Call the onReply function and pass in comment ID and reply content
        await onReply(comment._id, replyContent); // Wait for the reply to be processed
    
        // Clear the reply content only after reply is successfully submitted
        setReplyContent('');
    };

    // Function to handle editting
    const handleEdit = () => {
        onEdit(comment._id, editContent);
        setShowEditBox(false);
    };

    // Function to handle cancelling edit and resetting the content
    const handleCancelEdit = () => {
        setEditContent(comment.content); // Reset the edited content to the original comment
        setShowEditBox(false); // Close the edit box
        setShowReplyBox(!showReplyBox);
    };

    const handleDelete = () => {
        onDelete(comment._id);
    };

    const handleProfileClick = async () => {
        if (comment.userId._id === user.id) {
            router.push("/profile");
        } else {
            router.push(`/profile/${comment.userId._id}?name=${comment.userId.username}`);
        }
    };

    // Handles commentt click - shows login popup if not logged in
    const handleCommentClick = async () => {
        if (!user) {
        // Redirect to login page with message
            const message = "Sorry need to be logged in to view comment details. Please log in to continue.";
            router.push(`/login?message=${message}`);
            return;
        }

        // Determine if the logged-in user is the creator of the prompt
        // if (post.creator._id !== user.id) {
        // // Increment the prompt click count if not the creator
        // try {
        //     await fetch(`/api/prompt/${post._id}/incrementPromptClick`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     });
        
        //     setPromptClickCount(promptClickCount + 1);
        // } catch (error) {
        //     console.log("Error:", error);
        // }
        // }

        // Navigate to the prompt details page
        router.push(`/commentDetails/${comment._id}`);
    };

    const engagementProps = {
        entity: comment,
        entityType: "comment",
        user: user,
    };

    const isUpdated = comment.updatedAt && comment.updatedAt !== comment.createdAt;

  // Check if comment is marked as deleted
  const isDeleted = !!comment.deletedAt;

  return (
    <div className="p-4">

        {isDeleted ? (
                <p className="italic text-gray-500">{comment.content}</p>
            ): (
                <>
                    <div className="flex items-center mb-2 space-x-2 cursor-pointer" onClick={handleProfileClick}>
                        <Image
                            src={comment.userId.image || userDetails?.userImage} //Note userDetails is only needed if i am not populating the comment by userId in the API
                            alt={`${comment.userId.username || userDetails?.userName}'s profile picture`}
                            width={40}
                            height={40}
                            className="rounded-full object-contain"
                        />
                        <p className="font-bold">{comment.userId.username || userDetails?.userName}</p>
                    </div>

                    {showEditBox ? (
                        <div className="mt-2">
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Edit your comment..."
                            />
                            <div className="mt-2 space-x-2">
                                <button 
                                    className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-md" 
                                    onClick={handleEdit}
                                >
                                    Save
                                </button>

                                <button 
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-md" 
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p
                            className={`${pathName !== `/commentDetails/${comment._id}` ? "cursor-pointer" : ""}`}
                            onClick={pathName !== `/commentDetails/${comment._id}` ? handleCommentClick : undefined}
                        >
                            {comment.content}
                        </p>
                    )}
                </>
            )
        }

        {/* Only render date and actions if the comment is not deleted */}
        {!isDeleted && (
                <div className='mt-2 space-y-2'>
                    <div className="flex items-center space-x-2 font-inter text-xs text-gray-500">
                        <p>Created At: {new Date(comment.createdAt).toLocaleDateString()}</p>
                        {isUpdated && <p>Updated At: {new Date(comment.updatedAt).toLocaleDateString()}</p>}
                    </div>

                    <div className="flex justify-between items-center">

                        <LikeButton
                            {...engagementProps}
                            initialCount={comment.likes.length}
                        />

                        <CommentButton {...engagementProps}/>

                        <RepostButton
                            {...engagementProps}
                            initialCount={comment.reposts.length}
                        />

                        <BookmarkButton 
                            {...engagementProps}
                            initialCount={comment.bookmarks.length}
                        />

                        <Sharing {...engagementProps}/>
                    </div>

                </div>
            )}

            {user?.id === comment.userId._id && !isDeleted && (
                <div className="mt-2 flex-center gap-4 border-t border-gray-100 pt-3">
                    <p
                        className="font-inter text-sm green_gradient cursor-pointer hover:text-purple-700"
                        onClick={() => {
                            setShowEditBox(!showEditBox);
                            setShowReplyBox(false);
                        }}
                    >
                        Edit
                    </p>
                    <p
                        className="font-inter text-sm orange_gradient cursor-pointer hover:text-red-700"
                        onClick={handleDelete}
                    >
                        Delete
                    </p>
                </div>
            )}

            {/* Show the reply box if on comment details page, or if manually toggled */}
            {showReplyBox && pathName === `/commentDetails/${comment._id}` && (
                <div className="mt-2">
                    <textarea
                        ref={replyBoxRef} 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        disabled={loadingState.isLoading && loadingState.type === 'reply'} // Disable while loading
                    />
                    <button
                        //className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                        className={`bg-blue-500 text-white mt-2 px-4 py-2 rounded-md
                            ${loadingState.isLoading && loadingState.type === 'reply' ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"}`}
                        onClick={handleReply}
                        disabled={loadingState.isLoading && loadingState.type === 'reply'} // Disable while loading
                    >
                        {loadingState.isLoading && loadingState.type === 'reply' ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            )}
    </div>
  )
}

export default CommentCard