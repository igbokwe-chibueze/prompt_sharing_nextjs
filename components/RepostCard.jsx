"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import PromptCard from "./PromptCard";
import { RepeatIcon } from "@constants/icons";

const RepostCard = ({ repost, originalPost, handleTagClick }) => {
    const { data: session } = useSession(); // Access session data for authentication
    const pathName = usePathname(); // Get the current route path
    const router = useRouter(); // Next.js router for navigation

    const handleProfileClick = () => {
        if (!session) {
          // Redirect to login page with message
          const message = "You need to be logged in to view this profile. Please log in to continue.";
          router.push(`/login?message=${message}`);
          return;
        }
        
        if (repost.repostedBy._id === session.user.id) {
          router.push("/profile"); // Navigate to logged-in user's profile
        } else {
          router.push(`/profile/${repost.repostedBy._id}?name=${repost.repostedBy.username}`); // Navigate to other user's profile
        }
    };


  return (
    <div className="repost_card">
      <div 
        className="flex justify-start items-scenter px-6 pb-2 space-x-2 font-inter text-sm text-gray-500 cursor-pointer"
        onClick={handleProfileClick}
      >
        <RepeatIcon/>
        <h3>
            {repost.repostedBy.username} reposted:
        </h3>
      </div>

      {/* Embedded PromptCard */}
      <PromptCard
        post={originalPost}
        handleTagClick={handleTagClick}
      />
    </div>
  );
};

export default RepostCard;
