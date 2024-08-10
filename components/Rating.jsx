import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { StarFilledIcon, StarHalfFilledIcon, CloseFilledIcon } from "@constants/icons";

const Rating = ({ post, session }) => {

    const router = useRouter(); // Next.js router for navigation

    const [isRateModalOpen, setIsRateModalOpen] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(null);
    const [currentRating, setCurrentRating] = useState(null);
    const [averageRating, setAverageRating] = useState(Number(post.averageRating) || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (session) {
        const userId = session.user.id;
        const existingRating = post.ratings.find(ratingObject => ratingObject.userId.toString() === userId)?.rating || null;
        setCurrentRating(existingRating);
        }
    }, [post, session]);

    const handleRate = async (rating) => {
        if (!session) {
        // Handle redirect to login
        router.push(`/login?message=You need to be logged in to rate this post.`);
        return;
        }

        // Prevent rating if the user is the creator of the post
        if (post.creator._id === session.user.id) {
            return;
        }

        setIsSubmitting(true);
        setCurrentRating(rating);
        
        try {
        const response = await fetch(`/api/prompt/${post._id}/rate`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            userId: session.user.id,
            rating: rating,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update rating");
        }

        const data = await response.json();
            // Update average rating based on data from the server
            setAverageRating(Number(data.averageRating));
        } catch (error) {
            console.log("Error:", error);
            setCurrentRating(prevRating => prevRating); // Revert rating on failure
        } finally {
            setIsSubmitting(false);
            setIsRateModalOpen(false); // Close the modal after submission
        }
    };

  return (
    <>
      {/* Display average rating */}
      <div className="rating_section flex">
        <button
          onClick={() => setIsRateModalOpen(true)}
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
                onClick={() => setIsRateModalOpen(false)}
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
                        (index + 1 <= (hoveredRating || currentRating))
                          ? 'text-yellow-500'
                          : 'hover:text-yellow-500'
                      }`}
                      onClick={() => handleRate(index + 1)}
                      onMouseEnter={() => setHoveredRating(index + 1)}
                      onMouseLeave={() => setHoveredRating(null)}
                      disabled={isSubmitting} // Disable button during submission
                    >
                      <StarFilledIcon />
                    </button>
                  ))}
                </div>
                <p className="font-inter text-sm text-gray-500 mt-4">Your Current Rating: {currentRating || 'None'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Rating;
