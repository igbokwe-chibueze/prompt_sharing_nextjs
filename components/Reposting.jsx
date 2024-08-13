import { RepeatIcon } from "@constants/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Reposting = ({ post, session }) => {

    const router = useRouter(); // Next.js router for navigation

    const [isReposted, setIsReposted] = useState(post.reposts?.find(repostObject => repostObject.repostedBy.toString() === session?.user.id));
    // State to manage the number of bookmarks
    const [repostCount, setRepostCount] = useState(post.reposts.length);
    const [isRepostting, setIsRepostting] = useState(false);

    const handleRepost = async () => {
        if (!session) {
            router.push(`/login?message=You need to be logged in to repost this post.`);
            return;
        }
    
        const newRepostedStatus = !isReposted;
        setIsReposted(newRepostedStatus); // Optimistically update the icon
        setIsRepostting(true);
    
        try {
            const response = await fetch(`/api/prompt/${post._id}/repost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    repost: newRepostedStatus
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update repost");
            }
    
            const data = await response.json();
            setRepostCount(data.reposts); // Update repost count only after successful response
        } catch (error) {
            console.log("Error:", error);
            // Revert icon state on failure
            setIsReposted(!newRepostedStatus);
        } finally {
            setIsRepostting(false);
        }
    };

  return (
    <>
        <div className="mt-4 bookmark_btn" onClick={handleRepost} disabled={isRepostting}>
            <RepeatIcon className={`text-gray-800 ${isReposted ? "text-green-600" : "hover:text-green-800"}`}/>
            {/* <span className="text-green-600">{`${isReposted ? "Resposted" : "Repost"}`}</span> */}
            <p>{repostCount}</p>
        </div>
    </>
  )
}

export default Reposting