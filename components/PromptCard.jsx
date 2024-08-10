"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { BookmarkIcon, CloseFilledIcon, HeartIcon, StarFilledIcon, StarHalfFilledIcon, } from "@constants/icons";

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

  //const [showLoginPopup, setShowLoginPopup] = useState(false); // State to manage popup visibility
  //const [popupMessage, setPopupMessage] = useState(""); // State to manage popup message

  // State to manage if the prompt is liked by the current user
  const [liked, setLiked] = useState(post.likes.includes(session?.user.id));
  // State to manage the number of likes
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiking, setIsLiking] = useState(false); // State for managing liking action

  const [isBookmarked, setIsBookmarked] = useState(post.bookmarks.includes(session?.user.id)); // State to manage if the prompt is bookmarked
  // State to manage the number of bookmarks
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmarks.length);
  const [isBookmarking, setIsBookmarking] = useState(false); // State for managing liking action

  // State to manage the rating
  const [userRating, setUserRating] = useState(null); // Store user's rating
  const [averageRating, setAverageRating] = useState(Number(post.averageRating) || 0);
  const [isRating, setIsRating] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(null);


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


  // Handles copying the prompt text to clipboard
  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000); // Reset copied state after 3 seconds
  };


  const handleLike = async () => {
    if (!session) {
        router.push(`/login?message=You need to be logged in to like this post.`);
        return;
    }

    const newLikedStatus = !liked;
    setLiked(newLikedStatus); // Optimistically update the icon
    setIsLiking(true);

    try {
        const response = await fetch(`/api/prompt/${post._id}/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: session.user.id,
                like: newLikedStatus
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update like");
        }

        const data = await response.json();
        setLikeCount(data.likes); // Update like count only after successful response
    } catch (error) {
        console.log("Error:", error);
        // Revert icon state on failure
        setLiked(!newLikedStatus);
    } finally {
        setIsLiking(false);
    }
  };


  const handleBookmark = async () => {
    if (!session) {
        router.push(`/login?message=You need to be logged in to bookmark this post.`);
        return;
    }

    const newBookmarkedStatus = !isBookmarked;
    setIsBookmarked(newBookmarkedStatus); // Optimistically update the icon
    setIsBookmarking(true);

    try {
        const response = await fetch(`/api/prompt/${post._id}/bookmark`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: session.user.id,
                bookmark: newBookmarkedStatus
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update bookmark");
        }

        const data = await response.json();
        setBookmarkCount(data.bookmarks); // Update bookmark count only after successful response
    } catch (error) {
        console.log("Error:", error);
        // Revert icon state on failure
        setIsBookmarked(!newBookmarkedStatus);
    } finally {
        setIsBookmarking(false);
    }
  };


  // Function to handle rating submission

  useEffect(() => {
    // Initialize userRating from post data if available
    setUserRating(post.userRating || null);

    if (session) {
      const userId = session.user.id
      // Retrieve the rating given by the current user from the post's ratings array.
      const existingRating = post.ratings.find(ratingObject => ratingObject.userId.toString() === userId).rating;

      setUserRating(existingRating);
    }

  }, [post]);

  const handleRate = async (rating) => {
    if (!session) {
      router.push(`/login?message=You need to be logged in to rate this post.`);
      return;
    }

    // Prevent rating if the user is the creator of the post
    if (post.creator._id === session.user.id) {
      return;
    }

    setUserRating(rating); // Optimistically update user rating
    setIsRating(true);

    try {
      const response = await fetch(`/api/prompt/${post._id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update rating");
      }

      const data = await response.json();
      setAverageRating(Number(data.averageRating));
      setUserRating(data.userRating); // Update userRating from server response

    } catch (error) {
      console.log("Error:", error);
      // Revert user rating on failure
      setUserRating(null);
    } finally {
      setIsRating(false);
    }
  };

  const openRateModal = () => setIsRateModalOpen(true);
  const closeRateModal = () => setIsRateModalOpen(false);

 
  // Check if the post has been updated
  
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
      <div className="like_btn" onClick={handleLike} disabled={isLiking}>
        <HeartIcon className={`text-gray-800 ${liked ? "fill-gray-800" : "hover:fill-gray-800"}`}/>
        <p>{likeCount}</p>
      </div>

      {/* Bookmark Button */}
      <div className="mt-4 bookmark_btn" onClick={handleBookmark} disabled={isBookmarking}>
        <BookmarkIcon className={`text-gray-800 ${isBookmarked ? "fill-gray-800" : "hover:fill-gray-800"}`}/>
        <p>{bookmarkCount}</p>
      </div>

      {/* The rating the user gave the post should always be displayed */}
      <div className="rating_section flex">
        <button
          onClick={openRateModal}
          disabled={post.creator._id === session?.user.id} // Disable if user is the creator
          className={`mt-4 flex items-center space-x-2 font-inter text-sm text-blue-500 ${post.creator._id === session?.user.id ? "": "cursor-pointer"}`}
        >
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(star => {
              if (averageRating >= star) {
                return (
                  <StarFilledIcon key={star} className={"w-4 h-4 text-yellow-400"} />
                );
              } else if (averageRating >= star - 0.5) {
                return (
                  <StarHalfFilledIcon key={star} className={"w-4 h-4 text-yellow-400"} />
                );
              }
              return (
                <StarFilledIcon key={star} className={"w-4 h-4 text-gray-400"} />
              );
            })}
          </div>
          <p>({averageRating.toFixed(1)})</p>
        </button>

        {isRateModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 px-10 py-20">
            <div className="bg-white p-5 rounded shadow-lg relative w-full h-full">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={closeRateModal}
              >
                <CloseFilledIcon className={"w-6 h-6"}/>
              </button>
              <h2 className="mt-2 text-center text-xl font-bold mb-4">Rate this prompt</h2>
              <div className="flex justify-center items-center flex-col">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <button
                      key={index}
                      className={`${
                        (index + 1 <= (hoveredRating || userRating))
                          ? 'text-yellow-500'
                          : 'hover:text-yellow-500'
                      }`}
                      onClick={() => handleRate(index + 1)}
                      onMouseEnter={() => setHoveredRating(index + 1)}
                      onMouseLeave={() => setHoveredRating(null)}
                    >
                      <StarFilledIcon />
                    </button>
                  ))}
                </div>
                <p className="font-inter text-sm text-gray-500 mt-4">Your Current Rating: {userRating || 'None'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

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
