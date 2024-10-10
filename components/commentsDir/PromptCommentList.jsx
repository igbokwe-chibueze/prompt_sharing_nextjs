"use client";

import { useEffect, useState } from "react";
import { LoadingIcon } from "@constants/icons";
import { CommentCard } from "@components/commentsDir";

const PromptCommentList = ({ entity, user, entityType }) => {

    const [rootComments, setRootComments] = useState(null);
    const [rootCommentsCount, setTotalRootCommentsCount] = useState(0);
    const [commentsLimit, setCommentsLimit] = useState(2); // Initial limit for comments
    const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false); // Track loading state for "See More" button on root comments

    const [repliesLimit, setRepliesLimit] = useState(1); // Fixed limit for nested replies
    const [isLoadingMoreReplies, setIsLoadingMoreReplies] = useState(false); // Track loading state for "See More" button on nested replies

    const [loadingState, setLoadingState] = useState({ type: null, isLoading: false }); // Unified loading state
    const [loading, setLoading] = useState(true);

    const commentId = entity?.id;

    useEffect(() => {

        // NOTE !! Since this is recieving a dynamic post id, this fetch should have been handled in the prompt api route and not comments. 
        // This should have been an endpoint under the dynamic prompt folder [id] i.e api/prompt/[id]/comments
        const fetchComment = async () => {
            // Only set loading for the initial fetch, not when loading more comments
            if (rootComments === null) setLoading(true);

            try {
                const res = await fetch(`/api/comments/commentDetails/${commentId}?commentsLimit=${commentsLimit}&repliesLimit=${repliesLimit}&entityType=${entityType}`);
                const data = await res.json();
                setRootComments(data.populatedComments); // rootComments includes replies

                // Fetch the total count of comments and replies
                //const responseCount = await fetch(`/api/comments/commentDetails/${commentId}?count=true`);
                //const countData = await responseCount.json();

                //setTotalRootCommentsCount(countData.totalRootCommentCount); // Count of root comments (not replies)
            } catch (error) {
                console.error("Failed to fetch comment details:", error);
                setLoading(false);
            } finally {
                setLoading(false); // Stop loading once data is fetched
                setIsLoadingMoreComments(false); // Reset loading state after fetching
                setIsLoadingMoreReplies(false)
            }
        };

        fetchComment();
    }, []);

    const handleReply = async (commentId, replyContent) => {
        if (!replyContent) return;

        setLoadingState({ type: 'reply', isLoading: true }); // Set loading for reply

        try {
            const res = await fetch(`/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: commentId, // Use this to ensure the reply goes to the correct post or parent comment
                    userId: user.id, // Assuming session user info is available
                    content: replyContent,
                    parentCommentId: commentId, // The comment being replied to
                }),
            });

            if (res.ok) {
                const newReply = await res.json();

                // Add the new reply to the corresponding root comment in the state
                setRootComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment._id === commentId
                            ? {
                                ...comment,
                                replies: [...comment.replies, newReply], // Add new reply
                              }
                            : comment
                    )
                );
            } else {
                alert('Failed to post reply');
            }
        } catch (error) {
            console.error('Failed to post reply:', error);
        } finally {
            setLoadingState({ type: null, isLoading: false }); // Reset loading state
        }
    };


    const handleEdit = async (commentId, editContent) => {
        // Ensure we don't submit an empty or blank comment
        if (!editContent.trim()) return;
    
        // Set loading state specifically for the edit action
        setLoadingState({ type: 'edit', isLoading: true });
    
        try {
            // Send a PUT request to the server to update the comment with the given commentId
            const res = await fetch(`/api/comments/commentDetails/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json', // Specify the format of the request body
                },
                body: JSON.stringify({
                    content: editContent, // Include the new content for the comment
                }),
            });
    
            // Check if the response was successful (status code 200-299)
            if (res.ok) {
                // Parse the updated comment from the server response
                const updatedComment = await res.json();
    
                // Update the local state to reflect the edited comment
                // This ensures that the UI reflects the changes immediately without requiring a page reload
                setRootComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment._id === commentId
                            ? { 
                                ...comment, 
                                content: updatedComment.content, // Update the content to the new one
                                updatedAt: updatedComment.updatedAt, // Update the timestamp to reflect the latest change
                              }
                            : comment // Leave other comments unchanged
                    )
                );
            } else {
                // Handle failure if the response status is not ok
                alert('Failed to edit comment');
            }
        } catch (error) {
            // Handle any network or unexpected errors
            console.error('Failed to edit comment:', error);
            alert('An error occurred while editing the comment.');
        } finally {
            // Reset the loading state regardless of whether the request succeeded or failed
            setLoadingState({ type: null, isLoading: false });
        }
    };
    

    const handleDelete = async (commentId) => {
        const confirmDelete = confirm("Are you sure you want to delete this comment?");
        
        if (!confirmDelete) return;
    
        try {
            const res = await fetch(`/api/comments/commentDetails/${commentId}`, {
                method: 'DELETE',
            });
    
            if (res.ok) {
                const result = await res.json(); // The API should return the updated comment or a success message
                
                setRootComments((prevComments) => {
                    const updateComments = (comments) => {
                        return comments.map(comment => {
                            if (comment._id === commentId) {
                                if (result.deletedAt) {
                                    // Soft delete: mark as deleted and update content
                                    return { ...comment, content: result.content, deletedAt: result.deletedAt };
                                } else {
                                    // Hard delete: return null to filter out the comment
                                    return null;
                                }
                            }
    
                            // Check for replies: update the replies accordingly
                            const updatedReplies = updateComments(comment.replies || []).filter(Boolean);
                            
                            // If the comment was soft-deleted and has no replies, filter it out
                            if (comment.deletedAt && updatedReplies.length === 0) {
                                return null;
                            }
    
                            // Return the updated comment with its replies
                            return { ...comment, replies: updatedReplies };
                        }).filter(Boolean); // Remove null values (hard deleted comments)
                    };
    
                    return updateComments(prevComments);
                });
                setTotalRootCommentsCount(prev => prev - 1);
                alert("Comment deleted successfully");
            } else {
                alert("Failed to delete comment.");
            }
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("An error occurred while deleting the comment.");
        }
    };

    // Handle the "See More Comments" button click
    const handleSeeMoreComments = async () => {
        setIsLoadingMoreComments(true); // Set loading state to true
        setCommentsLimit((prevLimit) => prevLimit + 2); // Increase the comments limit to fetch more comments
    };

    // redirects to the comment details page of the root comment to show the replies.
    // const handleSeeMoreReplies = (rootCommentId) => {
    //     // Redirect to the comment details page for the selected root comment
    //     //router.push(`/commentDetails/${rootCommentId}`);
    // };

    // If i dont want to redirect, i can stream in more reply instead. I prefer to redirect instead as above.
    const handleSeeMoreReplies = async () => {
        setIsLoadingMoreReplies(true);
        setRepliesLimit((prevLimit) => prevLimit + 1); // Increase the replies limit to fetch more replies
    };

  return (
    <div className="mx-auto">
        {loading ? (
            <div className="text-center">
                <LoadingIcon className="animate-spin w-6 h-6 mx-auto text-black" />
                <p>Loading comments...</p>
            </div>
        ) : rootComments ? (
            <div className=" bg-gray-100 rounded-md">
                {rootComments?.map((rootComment) => (
                    <div className="border-t-2" key={rootComment._id}>
                        <CommentCard 
                            comment={rootComment}
                            onReply={handleReply}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            user={user}
                            loadingState={loadingState}
                        />

                        {/* Display nested replies for each root comment */}
                        {rootComment.replies?.length > 0 && (
                            <div className="pl-6 mt-2 space-y-4">
                                {rootComment.replies.map((reply) => (
                                    <div key={reply._id} className="border-l-2 pl-4">
                                        <div className="border-t-2 border-dotted">
                                            <CommentCard 
                                                comment={reply}
                                                onReply={handleReply}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                                user={user}
                                                loadingState={loadingState}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* See More Replies Button */}
                        {/* {rootComment.replies?.length < rootComment.totalReplyCount && (
                            <button
                                //className="text-blue-700 mt-2 p-2 rounded-md hover:underline hover:bg-gray-200"
                                className={`text-blue-700 mt-2 p-2 rounded-md
                                    ${isLoadingMoreReplies ? "bg-gray-400 border-0 cursor-not-allowed" : "hover:underline hover:bg-gray-200"}`}
                                disabled={isLoadingMoreReplies}
                                onClick={handleSeeMoreReplies}
                                //******!!!!DO NOT DELETE !!****
                                //onClick={() => handleSeeMoreReplies(rootComment._id)} // Use this if you a rerouting.
                            >
                                {isLoadingMoreReplies ? 
                                    <span className="flex items-center space-x-2">
                                        <LoadingIcon className={"animate-spin fill-white w-4 h-4"} />
                                        <p>Loading...</p>
                                    </span> : 
                                    `See ${rootComment.totalReplyCount - rootComment.replies?.length} More Comments`
                                }
                            </button>
                        )} */}
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center">
            <p className="text-red-500">Comment not found.</p>
            </div>
        )}
    </div>
  )
}

export default PromptCommentList