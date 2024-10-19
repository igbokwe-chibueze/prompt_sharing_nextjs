import { BookmarkIcon, CenterIcon, CloseFilledIcon, HeartIcon, RepeatIcon, StarIcon } from "@constants/icons"
import { useEffect, useState } from "react";


const EntityActivity = ({ entity, user, entityType, initialCount }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalEngagements, setTotalEngagements] = useState(initialCount);

    const likes = entity.likes?.length || 0;
    const bookmarks = entity.bookmarks?.length || 0;
    const reposts = entity.reposts?.length || 0;
    const ratings = entityType === "prompt" ? entity?.ratings?.length || 0 : 0; // add rating only if entityType is "prompt", if not make rating 0.

    // Determine if the current user is the creator of the entity (either a 'prompt' or other type).
    // For 'prompt', compare the creator's ID; otherwise, compare the userId.
    const isCreator = (entityType === "prompt" ? entity?.creator?._id : entity?.userId?._id) === user?.id;

    // Recalculate total engagements when likes, bookmarks, reposts, or ratings change
    useEffect(() => {
        const total = likes + bookmarks + reposts + ratings;
        setTotalEngagements(total);
    }, [likes, bookmarks, reposts, ratings, initialCount]); // Dependencies array watches these values for changes


  return (
    <div>
        <div className='flex items-center'>
            <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-full transition-colors duration-200 text-gray-800 hover:bg-blue-200"
            >
                <CenterIcon />
            </button>
            <p className="text-sm text-gray-500">{totalEngagements}</p>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 p-2">
                <div className="bg-white p-5 rounded shadow-lg relative w-full h-full">
                    <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <CloseFilledIcon className={"w-6 h-6"} />
                    </button>

                    <h2 className="mt-2 capitalize text-center text-xl font-bold mb-4">
                        {entityType} Activity
                    </h2>

                    <div className="space-y-4">
                        {/* Display detailed metrics if the user is the creator */}
                        {isCreator ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center space-x-4 p-2 border border-gray-500 rounded-lg">
                                    {/* Display Likes click count */}
                                    <p className="flex flex-col justify-center items-center font-inter text-sm text-gray-500">
                                        <HeartIcon />
                                        {likes}
                                    </p>

                                    {/* Display Bookmarks click count */}
                                    <p className="flex flex-col justify-center items-center font-inter text-sm text-gray-500">
                                        <BookmarkIcon />
                                        {bookmarks}
                                    </p>

                                    {/* Display Repost click count */}
                                    <p className="flex flex-col justify-center items-center font-inter text-sm text-gray-500">
                                        <RepeatIcon />
                                        {reposts}
                                    </p>

                                    {entityType === "prompt" &&( // Display Ratings count but only for prompts
                                        <p className="flex flex-col justify-center items-center font-inter text-sm text-gray-500">
                                            <StarIcon />
                                            {ratings}
                                        </p>
                                    )}

                                </div>

                                <div className="font-inter text-sm text-gray-500 capitalize">
                                    {/* Display total engagement count */}
                                    <p>
                                        Engagements: {totalEngagements}
                                    </p>

                                    {/* Display profile click count */}
                                    <p>
                                        Profile Visits: {entity?.profileClickCount}
                                    </p>

                                    {/* Display prompt click count */}
                                    <p>
                                        {entityType} Details Visits: {entity?.entityClickCount}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // Display only total engagement count if the user is not the creator
                            <div className="flex flex-col items-center space-y-4">
                                <h2 className="mt-2 text-center text-md font-bold text-gray-500 capitalize">
                                    Total Engagements on this {entityType}.
                                </h2>
                                <p className="font-inter font-bold text-xl text-gray-500">
                                    {totalEngagements}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default EntityActivity