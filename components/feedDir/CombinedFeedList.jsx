import PromptCard from "@components/promptDir/PromptCard";
import { useSession } from "next-auth/react";
import RepostCard from "./RepostCard";
import { Comment, CommentCard } from "@components/commentsDir";

const CombinedFeedList = ({ promptData = [], commentData = [], handleTagClick }) => {
  // Session management for user info (used in CommentFeedList)
  const { data: session } = useSession();
  const user = session?.user;

  // Flatten prompt data (posts and reposts)
  const flattenedPromptData = [];
  promptData.forEach((post) => {
    // Original post
    flattenedPromptData.push({
      type: "post",
      post: post,
      date: new Date(post.createdAt),
    });

    // Reposts
    post.reposts.forEach((repost) => {
      flattenedPromptData.push({
        type: "repost",
        post: post,
        repost: repost,
        date: new Date(repost.repostedAt),
      });
    });
  });

  // Flatten comment data (comments and reposts)
  const flattenedCommentData = [];
  commentData.forEach((comment) => {
    // Original comment
    flattenedCommentData.push({
      type: "comment",
      comment: comment,
      date: new Date(comment.createdAt),
    });

    // Reposts
    comment.reposts?.forEach((repost) => {
      flattenedCommentData.push({
        type: "repost",
        comment: comment,
        repost: repost,
        date: new Date(repost.repostedAt),
      });
    });
  });

  // Combine both flattened data arrays
  const combinedData = [...flattenedPromptData, ...flattenedCommentData];

  // Sort combined data by date in descending order (most recent first)
  const sortedCombinedData = combinedData.sort((a, b) => b.date - a.date);

  return (
    <div>
      {sortedCombinedData.map((item, index) => (
        <div key={index} className="relative space-y-6 py-8">
          {/* Render based on the type of item */}
          {item.type === "post" ? ( // Render prompts and reposted prompts
            <PromptCard post={item.post} handleTagClick={handleTagClick} /> //prompts
          ) : item.type === "repost" && item.post ? ( //reposted prompts
            <RepostCard
              originalPost={item.post}
              repost={item.repost}
              handleTagClick={handleTagClick}
            />
          // Render comments and reposted comments
          ) : item.type === "comment" ? (
            <div className="prompt_card">
              {/* comments */}
              <CommentCard comment={item.comment} user={user} />
            </div>
          ) : (
            <div className="prompt_card">
              {/* reposted comments */}
              <RepostCard
                cardType={"comment"}
                originalPost={item.comment}
                repost={item.repost}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CombinedFeedList;
