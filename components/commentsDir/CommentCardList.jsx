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
    const [loading, setLoading] = useState(true);

    const commentId = params.id;

    useEffect(() => {
        const fetchComment = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/comments/commentDetails/${commentId}`);
                const data = await res.json();
                setComment(data.comment);
                setRootComments(data.populatedComments); // rootComments includes replies
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch comment details:", error);
                setLoading(false);
            }
        };

        fetchComment();
    }, [commentId]);

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
                const result = await res.json();  // The API should return the updated comment or a success message
    
                if (result.deletedAt) {
                    // Soft delete: update the content and deletedAt for the soft-deleted comment
                    setRootComments((prevComments) =>
                        prevComments.map((comment) =>
                            comment._id === commentId
                                ? { ...comment, content: result.content, deletedAt: result.deletedAt }
                                : comment
                        )
                    );
                } else {
                    // Hard delete: filter the comment out from the state
                    setRootComments((prevComments) =>
                        prevComments.filter(comment => comment._id !== commentId)
                    );
                }
    
                alert("Comment deleted successfully");
            } else {
                alert("Failed to delete comment.");
            }
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("An error occurred while deleting the comment.");
        }
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

    </div>
  )
}

export default CommentCardList