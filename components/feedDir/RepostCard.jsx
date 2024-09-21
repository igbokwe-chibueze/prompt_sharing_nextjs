"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import PromptCard from "../promptDir/PromptCard";
import { RepeatIcon } from "@constants/icons";
import { Comment } from "../commentsDir";

const RepostCard = ({ repost, originalPost, cardType = "prompt", handleTagClick }) => {
    const { data: session } = useSession(); // Access session data for authentication
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

    // Conditional rendering based on card type
    const renderCard = () => {
      switch (cardType) {
        case "prompt":
          return <PromptCard post={originalPost} handleTagClick={handleTagClick} />;
        case "comment":
          return <Comment comment={originalPost} user={session?.user} />;
        default:
          return null;
      }
    };


  return (
    <div>
      <div 
        className="flex justify-start items-scenter px-6 pb-2 space-x-2 font-inter text-sm text-gray-500 cursor-pointer"
        onClick={handleProfileClick}
      >
        <RepeatIcon/>
        <h3>
            {repost.repostedBy.username} reposted: At: {new Date(repost.repostedAt).toLocaleDateString()}
        </h3>
      </div>

      {/* Render the appropriate card based on cardType */}
      {renderCard()}
    </div>
  );
};

export default RepostCard;
