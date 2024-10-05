"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingIcon } from "@constants/icons";
import { CommentCard } from "@components/commentsDir";

const CommentCardList = ({ params }) => {

    const { data: session } = useSession();
    const user = session?.user;

    const router = useRouter();
    const [comment, setComment] = useState(null);
    const [rootComments, setRootComments] = useState(null);

    const [rootCommentsCount, setTotalRootCommentsCount] = useState(0);
    const [commentsLimit, setCommentsLimit] = useState(2); // Initial limit for comments

    const [loading, setLoading] = useState(true);
    const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false); // Track loading state for "See More" button

    const commentId = params.id;

    useEffect(() => {
        const fetchComment = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/comments/commentDetails/${commentId}?commentsLimit=${commentsLimit}`);
                const data = await res.json();
                setComment(data.comment);
                setRootComments(data.populatedComments); // rootComments includes replies
                setLoading(false);

                // Fetch the total count of comments and replies
                const responseCount = await fetch(`/api/comments/commentDetails/${commentId}?count=true`);
                const countData = await responseCount.json();

                setTotalRootCommentsCount(countData.totalRootCommentCount); // Count of root comments (not replies)
            } catch (error) {
                console.error("Failed to fetch comment details:", error);
                setLoading(false);
            } finally {
                setIsLoadingMoreComments(false); // Reset loading state after fetching
            }
        };

        fetchComment();
    }, [commentId, commentsLimit]);

    const handleReply = async (commentId, replyContent) => {
        // Implement reply logic
    };

    const handleEdit = async (commentId, editContent) => {
        // Implement edit logic
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

    if (loading) {
        return (
        <div className="flex justify-center items-center h-screen">
            <LoadingIcon className="animate-spin w-8 h-8 text-blue-500" />
        </div>
        );
    }

  return (
    <div className="container mx-auto p-4">

        {comment ? (
            <div className="border p-4 bg-gray-100 rounded-md">
            <CommentCard 
                comment={comment}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                user={user}
            />

            {/* Display root comments and their replies */}
            {rootComments?.map((rootComment) => (
                <div className="border-t-2 pl-10" key={rootComment._id}>
                <CommentCard 
                    comment={rootComment}
                    onReply={handleReply}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    user={user}
                />

                {/* Display nested replies for each root comment */}
                {rootComment.replies?.length > 0 && (
                    <div className="pl-6 mt-2">
                    {rootComment.replies.map((reply) => (
                        <div key={reply._id} className="border-l-2 pl-4">
                        <CommentCard 
                            comment={reply}
                            onReply={handleReply}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            user={user}
                        />
                        </div>
                    ))}
                    </div>
                )}
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center">
            <p className="text-red-500">Comment not found.</p>
            </div>
        )}

        <p>Count : {rootComments.length}</p>

        {/* See More Btn */}
        {rootComments.length < rootCommentsCount && (
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
                    `See ${rootCommentsCount - rootComments.length} More Comments`
                }
            </button>
        )}

    </div>
  )
}

export default CommentCardList