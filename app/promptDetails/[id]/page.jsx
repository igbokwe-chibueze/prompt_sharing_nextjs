"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PromptCard from "@components/promptDir/PromptCard";

/**
 * PromptDetails Component
 * Fetches and displays details of a specific prompt, including user information and the prompt itself.
 */
const PromptDetails = ({ params }) => {
  const [prompt, setPrompt] = useState(null); // State to store prompt data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const router = useRouter(); // Next.js router for navigation

  // Fetch prompt details on component mount
  useEffect(() => {
    if (params) {
      const fetchPromptDetails = async () => {
        try {
          const response = await fetch(`/api/prompt/${params.id}/`); // API endpoint for fetching prompt details
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

  const handleEdit = (prompt) => {
    router.push(`/update-prompt?id=${prompt._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
        try {
          const response = await fetch(`/api/prompt/${post._id.toString()}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            console.error("Failed to delete post:", response.statusText);
          }
        } catch (error) {
          console.log("Error deleting post:", error);
        }
    }

    router.push("/")
  };

  return (
    <section>
      <h1 className="head_text text-left">
        <span className="blue_gradient">PromptDetails</span>
      </h1>

      <div className="mt-10">
        <PromptCard
          key={prompt._id}
          post={prompt}
          handleEdit={() => handleEdit && handleEdit(prompt)}
          handleDelete={() => handleDelete && handleDelete(prompt)}
        />
        
      </div>

      
    </section>
  );
};

export default PromptDetails;
