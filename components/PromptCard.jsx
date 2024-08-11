"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Rating from "./Rating";
import Bookmarking from "./Bookmarking";
import Liking from "./Liking";
import Copy from "./Copy";
import Sharing from "./sharing/Sharing";

/**
 * PromptCard Component
 * Displays individual prompt cards with user information, prompt details,
 * and provides options for editing, deleting, and copying the prompt.
 */
const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession(); // Access session data for authentication
  const pathName = usePathname(); // Get the current route path
  const router = useRouter(); // Next.js router for navigation


  // Handles profile click - shows login popup if not logged in
  const handleProfileClick = () => {
    if (!session) {
      // Redirect to login page with message
      const message = "You need to be logged in to view this profile. Please log in to continue.";
      router.push(`/login?message=${message}`);
      return;
    }
    
    if (post.creator._id === session.user.id) {
      router.push("/profile"); // Navigate to logged-in user's profile
    } else {
      router.push(`/profile/${post.creator._id}?name=${post.creator.username}`); // Navigate to other user's profile
    }
  };


  // Handles prompt click - shows login popup if not logged in
  const handlePromptClick = () => {
    if (!session) {
      // Redirect to login page with message
      const message = "Sorry need to be logged in to view prompt details. Please log in to continue.";
      router.push(`/login?message=${message}`);
      return;
    }
    router.push(`/promptDetails/${post._id}`);
  };

 
  // Check if the post has been updated/edited
  const isUpdated = post.updatedAt && post.updatedAt !== post.createdAt;

  return (
    <div className="prompt_card">
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
        className="my-4 font-satoshi text-sm text-gray-700 cursor-pointer"
        onClick={handlePromptClick}
      >
        {post.prompt}
      </p>

      {/* Created at information */}
      <p className="font-inter text-sm text-gray-500">
        Created At: {new Date(post.createdAt).toLocaleString()}
      </p>

      {/* Conditionally render updated at information */}
      {isUpdated && (
        <p className="mt-2 font-inter text-sm text-gray-500">
          Updated At: {new Date(post.updatedAt).toLocaleDateString()}
        </p>
      )}

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

      {/* Like Button */}
      <Liking post={post} session={session}/>

      {/* Bookmark Button */}
      <Bookmarking post={post} session={session}/>

      {/* Rating */}
      <Rating post={post} session={session}/>

      <Sharing post={post}/>

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
    </div>
  );
};

export default PromptCard;
