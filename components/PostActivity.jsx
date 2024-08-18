import { BookmarkIcon, CenterIcon, CloseFilledIcon, HeartIcon, RepeatIcon, StarIcon } from "@constants/icons";
import { useState, useEffect } from "react";

/**
 * PostActivity Component
 * Displays detailed activity metrics for the post.
 * If the logged-in user is the creator, it displays detailed metrics.
 * Otherwise, it displays only the total engagement count.
 */
const PostActivity = ({ post, session, setEngagements }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const likes = post.likes.length;
    const bookmarks = post.bookmarks.length;
    const reposts = post.reposts.length;
    const ratings = post.ratings.length;
    const totalEngagements = likes + bookmarks + reposts + ratings;

    useEffect(() => {
        if (setEngagements) {
            setEngagements(totalEngagements);
        }
    }, [totalEngagements, setEngagements]);

    const isCreator = session?.user.id === post.creator._id;

    return (
        <>
            <div className="rating_section flex">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 font-inter text-sm text-blue-500"
                >
                    <CenterIcon />
                </button>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 px-10 py-20">
                        <div className="bg-white p-5 rounded shadow-lg relative w-full h-full">
                            <button
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <CloseFilledIcon className={"w-6 h-6"} />
                            </button>

                            <h2 className="mt-2 text-center text-xl font-bold mb-4">
                                Post Activity
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

                                            {/* Display Ratings count */}
                                            <p className="flex flex-col justify-center items-center font-inter text-sm text-gray-500">
                                                <StarIcon />
                                                {ratings}
                                            </p>
                                        </div>

                                        <div>
                                            {/* Display total engagement count */}
                                            <p className="font-inter text-sm text-gray-500">
                                                Engagements: {totalEngagements}
                                            </p>

                                            {/* Display profile click count */}
                                            <p className="font-inter text-sm text-gray-500">
                                                Profile Visits: {post.profileClickCount}
                                            </p>

                                            {/* Display prompt click count */}
                                            <p className="font-inter text-sm text-gray-500">
                                                Prompt Details Visits: {post.promptClickCount}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // Display only total engagement count if the user is not the creator
                                    <div className="flex flex-col items-center space-y-4">
                                        <h2 className="mt-2 text-center text-md font-bold text-gray-500">
                                            Total Engagements on this post.
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
        </>
    );
};

export default PostActivity;
