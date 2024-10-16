
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BookmarkButton, CommentButton, LikeButton, RepostButton } from '@components/engagements';
import Sharing from '@components/sharing/Sharing';

const CommentCard = ({ comment, onReply, onEdit, onDelete, user, promptDetails, loadingState  }) => {

    const pathName = usePathname(); // Get the current route path
    const router = useRouter();
    const searchParams = useSearchParams()

    const [showReplyBox, setShowReplyBox] = useState(true);
    const [replyContent, setReplyContent] = useState('');

    const [showEditBox, setShowEditBox] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const replyBoxRef = useRef(null); // Create a ref for the reply textarea

    const commenterDetails = comment.userId
    const rootCommentCreator = comment.parentCommentId?.userId
    const promptCreatorDetails = promptDetails?.creator

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
    const handleEdit = async () => {
        if (!editContent) return;
        
        // Call the onEdit function and pass in comment ID and edi content
        await onEdit(comment._id, editContent); // Wait for the edit to be processed

        // Close the edit box only after the edit content is successfully submitted
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

    const handleProfileRedirect = (details) => {
        if (details._id === user.id) {
            router.push("/profile");
        } else {
            router.push(`/profile/${details._id}?name=${details.username}`);
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
                <div className="space-y-2">
                    {/* Displays who is being replied to */}
                    <p className=" flex items-center italic text-gray-500 space-x-2">
                        replied... 
                        {rootCommentCreator ? (
                            <span 
                                className = "text-blue-700 cursor-pointer hover:underline"
                                onClick={() => handleProfileRedirect(rootCommentCreator)}
                            > 
                                {rootCommentCreator.username} and 
                            </span>
                        ) : ""}

                        {promptCreatorDetails ? (
                            <span 
                                className = "text-blue-700 cursor-pointer hover:underline" 
                                onClick={() => handleProfileRedirect(promptCreatorDetails)}
                            > 
                                {promptCreatorDetails.username}
                            </span>
                        ) : ""}
                    </p>

                    <div className="flex items-center space-x-2 cursor-pointer" 
                        onClick={() => handleProfileRedirect(commenterDetails)}
                    >
                        <Image
                            src={commenterDetails.image }
                            alt={`${commenterDetails.username }'s profile picture`}
                            width={40}
                            height={40}
                            className="rounded-full object-contain"
                        />
                        <p className="font-bold">{commenterDetails.username}</p>
                    </div>

                    {showEditBox ? (
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Edit your comment..."
                                disabled={loadingState?.isLoading && loadingState.type === 'edit'}
                            />
                            <div className="mt-2 space-x-2">
                                <button 
                                    className={`bg-green-500 text-white mt-2 px-4 py-2 rounded-md
                                        ${loadingState?.isLoading && loadingState.type === 'reply' ? "bg-gray-400 cursor-not-allowed" : "hover:bg-green-700"}`}
                                    onClick={handleEdit}
                                    disabled={loadingState?.isLoading && loadingState.type === 'edit'}
                                >
                                    {loadingState?.isLoading && loadingState.type === 'edit' ? 'Saving...' : 'Save'}
                                </button>

                                <button 
                                    className={`bg-gray-500 text-white mt-2 px-4 py-2 rounded-md
                                        ${loadingState?.isLoading && loadingState.type === 'edit' ? "invisible" : "hover:bg-gray-700"}`}
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        // If not in edit mode, display the comment content
                        <p
                            className={`${pathName !== `/commentDetails/${comment._id}` ? "cursor-pointer" : ""}`}
                            onClick={pathName !== `/commentDetails/${comment._id}` ? handleCommentClick : undefined}
                        >
                            {comment.content}
                        </p>
                    )}
                </div>
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

            {user?.id === commenterDetails._id && !isDeleted && (
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