"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * PromptDetails Component
 * Fetches and displays details of a specific prompt, including user information and the prompt itself.
 */
const PromptDetails = ({ params }) => {
  const [prompt, setPrompt] = useState(null); // State to store prompt data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const { data: session } = useSession(); // Access session data for authentication
  const router = useRouter(); // Next.js router for navigation

  // Handles profile click - navigates to user's profile
  const handleProfileClick = () => {
    if (prompt[0].creator._id === session?.user.id) {
      router.push("/profile"); // Navigate to logged-in user's profile
    } else {
      router.push(`/profile/${prompt[0].creator._id}?name=${prompt[0].creator.username}`); // Navigate to other user's profile
    }
  };

  // Fetch prompt details on component mount
  useEffect(() => {
    if (params) {
      const fetchPromptDetails = async () => {
        try {
          const response = await fetch(`/api/prompt/${params}/details`); // API endpoint for fetching prompt details
          const data = await response.json();
          setPrompt(data);
          setLoading(false); // Stop loading when data is fetched
        } catch (error) {
          console.error("Failed to fetch prompt details:", error);
          setLoading(false); // Stop loading if there is an error
        }
      };

      fetchPromptDetails();
    }
  }, [params]);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (!prompt) {
    return <div>No prompt found</div>; // Show message if no prompt is found
  }

  console.log(prompt[0])

  return (
    <section>
      <h1 className="head_text text-left">
        <span className="blue_gradient">PromptDetails</span>
      </h1>

      <div className="mt-10">
        <div className="prompt_card">
          {/* User information and profile navigation */}
          <div
            className="flex justify-start items-center gap-5 cursor-pointer"
            onClick={handleProfileClick}
          >
            <Image
              src={prompt[0].creator.image}
              alt="user_image"
              width={50}
              height={50}
              className="rounded-full object-contain"
            />
            <div className="flex flex-col">
              <h3 className="font-satoshi font-semibold text-gray-900">
                {prompt[0].creator.username}
              </h3>
              <p className="font-inter text-sm text-gray-500">
                {prompt[0].creator.email}
              </p>
            </div>
          </div>

          {/* Prompt content */}
          <div className="my-5">
            <p className="my-4 font-satoshi text-sm text-gray-700">
              {prompt[0].prompt}
            </p>
            <p className="font-inter text-sm text-gray-500">
              Created At: {new Date(prompt[0].createdAt).toLocaleString()}
            </p>
          </div>

          {/* Tag */}
          <div className="font-inter text-sm blue_gradient">
            #{prompt[0].tag}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromptDetails;
