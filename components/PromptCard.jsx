"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

/**
 * PromptCard Component
 * Displays individual prompt cards with user information, prompt details,
 * and provides options for editing, deleting, and copying the prompt.
 */
const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession(); // Access session data for authentication
  const pathName = usePathname(); // Get the current route path
  const router = useRouter(); // Next.js router for navigation

  const [copied, setCopied] = useState(""); // State to manage copied prompt

  // Handles profile click - navigates to user's profile
  const handleProfileClick = () => {
    if (post.creator._id === session?.user.id) {
      router.push("/profile"); // Navigate to logged-in user's profile
    } else {
      router.push(`/profile/${post.creator._id}?name=${post.creator.username}`); // Navigate to other user's profile
    }
  };

  // Handles prompt click - navigates to prompt details page
  const handlePromptClick = () => {
    console.log(post._id)
    router.push(`/promptDetails/${post._id}`);
  };

  // Handles copying the prompt text to clipboard
  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000); // Reset copied state after 3 seconds
  };

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        {/* User information and profile navigation */}
        <div
          className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
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
        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
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

      {/* Tag with click functionality */}
      <p
        className="font-inter text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>

      {/* Edit and Delete buttons for creator on profile page */}
      {session?.user.id === post.creator._id && pathName === "/profile" && (
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
