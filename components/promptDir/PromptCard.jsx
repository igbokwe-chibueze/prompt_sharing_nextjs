"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Rating from "../Rating";
import Copy from "../Copy";
import Sharing from "../sharing/Sharing";
import PostActivity from "../PostActivity";
import { useState, useEffect, useRef } from "react";
import { BookmarkButton, CommentButton, LikeButton, RepostButton } from "../engagements";
import { CommentCardList } from "@components/commentsDir";

/**
 * PromptCard Component
 * Displays individual prompt cards with user information, prompt details,
 * and provides options for editing, deleting, and copying the prompt.
 */
const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {

  const { data: session } = useSession(); // Access session data for authentication
  const pathName = usePathname(); // Get the current route path
  const router = useRouter(); // Next.js router for navigation
  const searchParams = useSearchParams()

  const user = session?.user; // Destructure user information from session

  const [showReplyBox, setShowReplyBox] = useState(true);
  const [newComment, setNewComment] = useState('');

  const [isCommenting, setIsCommenting] = useState();

  const [profileClickCount, setProfileClickCount] = useState(post.profileClickCount || 0);
  const [promptClickCount, setPromptClickCount] = useState(post.promptClickCount || 0);

  const [totalEngagements, setTotalEngagements] = useState(0);

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

  const handleNewComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments from being submitted

    setIsCommenting(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post._id, userId: user.id, content: newComment }),
      });

      if (res.ok) {
        setNewComment(''); // Clear the comment input field
        setIsCommenting(false)
      }
    } catch (error) {
      setIsCommenting(false)
      console.error('Failed to post comment:', error);
    }
  };

  // Handles profile click - shows login popup if not logged in
  const handleProfileClick = async () => {
    if (!user) {
      // Redirect to login page with message
      const message = "You need to be logged in to view this profile. Please log in to continue.";
      router.push(`/login?message=${message}`);
      return;
    }

    // Determine if the logged-in user is the creator of the prompt
    if (post.creator._id !== user.id) {
      // Increment the profile click count if not the creator
      try {
        await fetch(`/api/prompt/${post._id}/incrementProfileClick`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        setProfileClickCount(profileClickCount + 1);
      } catch (error) {
        console.log("Error:", error);
      }
    }

    // Navigate to the appropriate profile page
    if (post.creator._id === user.id) {
      router.push("/profile"); // Navigate to logged-in user's profile
    } else {
      router.push(`/profile/${post.creator._id}?name=${post.creator.username}`); // Navigate to other user's profile
    }
  };


  // Handles prompt click - shows login popup if not logged in
  const handlePromptClick = async () => {
    if (!user) {
      // Redirect to login page with message
      const message = "Sorry need to be logged in to view prompt details. Please log in to continue.";
      router.push(`/login?message=${message}`);
      return;
    }

    // Determine if the logged-in user is the creator of the prompt
    if (post.creator._id !== user.id) {
      // Increment the prompt click count if not the creator
      try {
        await fetch(`/api/prompt/${post._id}/incrementPromptClick`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        setPromptClickCount(promptClickCount + 1);
      } catch (error) {
        console.log("Error:", error);
      }
    }

    // Navigate to the prompt details page
    router.push(`/promptDetails/${post._id}`);
  };


  const engagementProps = {
    entity: post,
    entityType: "prompt",
    user: user,
  };

  // Check if the post has been updated/edited
  const isUpdated = post.updatedAt && post.updatedAt !== post.createdAt;

  // Check if post is marked as deleted
  const isDeleted = !!post.deletedAt;

  return (
    <div className="prompt_card space-y-4">
      {isDeleted ? (
        <p className="italic text-gray-500">{post.prompt}</p>
      ): (
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-5">
            {/* User information and profile navigation */}
            <div
              className={"flex-1 flex justify-start items-center gap-3 cursor-pointer"}
              onClick={handleProfileClick}
            >
              <Image
                src={post.creator.image}
                alt="user_image"
                width={40}
                height={40}
                className="rounded-full object-contain"
              />
              <div className="flex flex-col">
                <h3 className="font-satoshi font-semibold text-gray-900">
                  {post.creator.username}
                </h3>
                <p className="font-inter text-sm text-gray-500">
                  {post.creator.email}
                </p>
              </div>
            </div>

            {/* Copy button */}
            <Copy post={post}/>
          </div>

          {/* Prompt text and navigation to details */}
          <p
            className={`my-4 font-satoshi text-sm text-gray-700 ${pathName !== `/promptDetails/${post._id}` ? "cursor-pointer" : ""}`}
            onClick={pathName !== `/promptDetails/${post._id}` ? handlePromptClick : undefined}
          >
            {post.prompt}
          </p>

          {/* Date and time */}
          <div className=" flex items-center space-x-2 font-inter text-xs text-gray-500">
            {/* Created at information */}
            <p>
              Created At: {new Date(post.createdAt).toLocaleDateString()}
            </p>

            {/* Conditionally render updated at information */}
            {isUpdated && (
              <p>
                Updated At: {new Date(post.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>    

          {/* Tag with click functionality */}
          <div className="flex justify-start items-center flex-wrap gap-2 mt-2">
            {post.tags.map((tag, index) => (
              <p
                key={index}
                className="font-inter text-sm blue_gradient cursor-pointer"
                onClick={() => handleTagClick && handleTagClick(tag)}
              >
                #{tag}
              </p>
            ))}
          </div>

          <div className="flex justify-between items-center">
            {/* Like Button */}
            <LikeButton
              {...engagementProps}
              initialCount={post.likes.length}
            />

            {/* Comment Button */}
            <CommentButton {...engagementProps}/>
            
            {/* Reposting */}
            <RepostButton
              {...engagementProps}
              initialCount={post.reposts.length}
            />

            {/* Post Activity */}
            <div className="flex justify-start items-center">
              
              <PostActivity post={post} session={session} setEngagements={setTotalEngagements}/>

              {/* Display Total Engagements */}
              {totalEngagements > 0 && (
                <div className="font-inter text-sm text-gray-700">
                  {totalEngagements}
                </div>
              )}
            </div>

            {/* Bookmark Button */}
            <BookmarkButton 
              {...engagementProps}
              initialCount={post.bookmarks.length}
            />
            
            {/* Sharing */}
            <Sharing {...engagementProps} />
          </div>

          {/* Rating */}
          <Rating post={post} session={session}/>

          {session?.user.id === post.creator._id && pathName !== "/" && (
            <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
              <p
                className="font-inter text-sm green_gradient cursor-pointer hover:text-purple-700"
                onClick={handleEdit}
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
        </div>
      )}

      {/* Show the reply box if on prompt details page, or if manually toggled */}
      {showReplyBox && pathName === `/promptDetails/${post._id}` && (
        <div className="mt-2">
          <textarea
            ref={replyBoxRef} 
            className="w-full p-2 border border-gray-300 rounded-md"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a reply..."
            disabled={isCommenting} // Disable while loading
          />
          <button
            className={`bg-blue-500 text-white mt-2 px-4 py-2 rounded-md
                ${isCommenting ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"}`}
            onClick={handleNewComment}
            disabled={isCommenting} // Disable while loading
          >
            {isCommenting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}


      {/* Comment List */}
      {pathName === `/promptDetails/${post._id}` && ( // Only display comments in prompt detail page.
        <CommentCardList params={post} entityType={"prompt"}/>
      )}
    </div>
  );
};

export default PromptCard;
