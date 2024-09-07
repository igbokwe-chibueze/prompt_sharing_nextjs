"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Rating from "./Rating";
import Bookmarking from "./Bookmarking";
import Liking from "./Liking";
import Copy from "./Copy";
import Sharing from "./sharing/Sharing";
import Reposting from "./Reposting";
import PostActivity from "./PostActivity";
import { useState } from "react";
import CommentList from "./commentsDir/CommentList";
import CommentBtn from "./commentsDir/CommentBtn";

/**
 * PromptCard Component
 * Displays individual prompt cards with user information, prompt details,
 * and provides options for editing, deleting, and copying the prompt.
 */
const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {

  const { data: session } = useSession(); // Access session data for authentication
  const pathName = usePathname(); // Get the current route path
  const router = useRouter(); // Next.js router for navigation

  const [profileClickCount, setProfileClickCount] = useState(post.profileClickCount || 0);
  const [promptClickCount, setPromptClickCount] = useState(post.promptClickCount || 0);

  const [totalEngagements, setTotalEngagements] = useState(0);


  // Handles profile click - shows login popup if not logged in
  const handleProfileClick = async () => {
    if (!session) {
      // Redirect to login page with message
      const message = "You need to be logged in to view this profile. Please log in to continue.";
      router.push(`/login?message=${message}`);
      return;
    }

    // Determine if the logged-in user is the creator of the prompt
    if (post.creator._id !== session.user.id) {
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
    if (post.creator._id === session.user.id) {
      router.push("/profile"); // Navigate to logged-in user's profile
    } else {
      router.push(`/profile/${post.creator._id}?name=${post.creator.username}`); // Navigate to other user's profile
    }
  };


  // Handles prompt click - shows login popup if not logged in
  const handlePromptClick = async () => {
    if (!session) {
      // Redirect to login page with message
      const message = "Sorry need to be logged in to view prompt details. Please log in to continue.";
      router.push(`/login?message=${message}`);
      return;
    }

    // Determine if the logged-in user is the creator of the prompt
    if (post.creator._id !== session.user.id) {
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

 
  // Check if the post has been updated/edited
  const isUpdated = post.updatedAt && post.updatedAt !== post.createdAt;

  return (
    <div className="prompt_card space-y-4">
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
        <Liking post={post} session={session}/>

        {/* Comment Button */}
        <CommentBtn post={post}/>
        
        {/* Reposting */}
        <Reposting post={post} session={session}/>

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
        <Bookmarking post={post} session={session}/>
        
        {/* Sharing */}
        <Sharing post={post}/>
      </div>

      {/* Rating */}
      <Rating post={post} session={session}/>

      {session?.user.id === post.creator._id && pathName !== "/" && (
        <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
          <p
            className="font-inter text-sm green_gradient cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="font-inter text-sm orange_gradient cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}

      {/* Comment List */}
      <CommentList post={post} />
    </div>
  );
};

export default PromptCard;
