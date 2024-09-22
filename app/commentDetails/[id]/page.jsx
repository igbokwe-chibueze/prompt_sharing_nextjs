"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingIcon } from "@constants/icons";
import { Comment } from "@components/commentsDir";

/**
 * CommentDetails Page
 * Displays detailed information about a specific comment,
 * and handles editing, deleting, replying, and other interactions.
 */
const CommentDetails = ({ params }) => {
  const { data: session } = useSession(); // Get session data
  const user = session?.user;

  const router = useRouter(); // For navigation

  const [comment, setComment] = useState(null); // Holds the fetched comment data
  const [loading, setLoading] = useState(true); // Loading state for fetching

  const commentId = params.id; // Comment ID from the route

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/comments/commentDetails/${commentId}`);
        const data = await res.json();
        setComment(data);
        console.log("Comment data: "+data)
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch comment details:", error);
        setLoading(false);
      }
    };

    fetchComment();
  }, [commentId]);

  // Function to handle replying to the comment
  const handleReply = async (commentId, replyContent) => {
    // Implement reply logic
  };

  // Function to handle editing the comment
  const handleEdit = async (commentId, editContent) => {
    // Implement edit logic
  };

  // Function to handle deleting the comment
  const handleDelete = async (commentId) => {
    // Implement delete logic
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
        <h1 className="head_text text-left">
            <span className="blue_gradient">Comment Details</span>
        </h1>
        {comment ? (
            <Comment
                comment={comment}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                user={user}
            />
        ) : (
            <div className="text-center">
            <p className="text-red-500">Comment not found.</p>
            </div>
        )}
    </div>
  );
};

export default CommentDetails;
