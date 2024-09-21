import { useSession } from "next-auth/react";
import Comment from "./Comment"
import RepostCard from "@components/RepostCard";

const CommentFeedList = ({data}) => {
    // Session management
    const { data: session } = useSession();
    const user = session?.user; // Destructure user information from session

    const flattenedData = [];

    data.forEach(comment => {
        // Push the original post into the flattenedData array
        flattenedData.push({
            type: 'comment',
            comment: comment,
            date: new Date(comment.createdAt),
        });

        // Push each repost as a separate entity into the flattenedData array
        comment.reposts.forEach(repost => {
            flattenedData.push({
                type: 'repost',
                comment: comment,  // Keep reference to the original comment
                repost: repost, // The repost object itself
                date: new Date(repost.repostedAt), // Repost date
            });
        });
    });

  // Sort flattened data by date in descending order
  const sortedData = flattenedData.sort((a, b) => b.date - a.date);

  return (
    <div>
        
        {sortedData.map((item, index) => (
          <div key={index} className="relative space-y-6 py-8">
            {/* Check if the item is a comment or a repost and render accordingly */}
                {item.type === 'comment' ? (
                    <div className="prompt_card">
                        <p>Comment</p>
                        <Comment 
                            comment={item.comment}
                            // onReply={handleReply}
                            // onEdit={handleEdit}
                            // onDelete={handleDelete}
                            user={user}
                            //userDetails={userDetails}
                        />
                    </div>
                ) : (
                    <>
                        <div className="prompt_card">
                            <p>Comment Repost</p>
                            <RepostCard
                                cardType={"comment"}
                                originalPost={item.comment}
                                repost={item.repost}
                            />
                        </div>
                    </>
                )}
          </div>
        ))}
    </div>
  )
}

export default CommentFeedList