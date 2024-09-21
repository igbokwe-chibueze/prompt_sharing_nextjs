"use client"; // This is a client-side component

import { useState, useEffect, Suspense } from "react";
import PromptCard from "./PromptCard";
import Loading from "@app/profile/loading";
import RepostCard from "./RepostCard";
import CommentFeedList from "./commentsDir/CommentFeedList";

const PromptCardList = ({ data, handleTagClick }) => {
  // Flatten the data to treat reposts as separate items from prompt posts for sorting
  // This is to ensure the most recent posts or reposts shows ontop.
  const flattenedData = [];

  data.forEach(post => {
    // Push the original post into the flattenedData array
    flattenedData.push({
      type: 'post',
      post: post,
      date: new Date(post.createdAt),
    });

    // Push each repost as a separate entity into the flattenedData array
    post.reposts.forEach(repost => {
      flattenedData.push({
        type: 'repost',
        post: post,  // Keep reference to the original post
        repost: repost, // The repost object itself
        date: new Date(repost.repostedAt), // Repost date
      });
    });
  });

  // Sort flattened data by date in descending order
  const sortedData = flattenedData.sort((a, b) => b.date - a.date);

  return (
    <div className="mt-6">
      <Suspense fallback={<Loading />}>
        {sortedData.map((item, index) => (
          <div key={index} className="relative space-y-6 py-8">
            {/* Check if the item is a post or a repost and render accordingly */}
            {item.type === 'post' ? (
              <PromptCard post={item.post} handleTagClick={handleTagClick} />
            ) : (
              <RepostCard
                originalPost={item.post}  // Pass original post to the repost card
                repost={item.repost}
                handleTagClick={handleTagClick}
              />
            )}
          </div>
        ))}
      </Suspense>
    </div>
  );
};


const Feed = () => {
  const [allPosts, setAllPosts] = useState([]); // Store fetched posts
  const [allComments, setAllComments] = useState([]); // Store fetched comments

  const [searchText, setSearchText] = useState(""); // Search query state
  const [searchTimeout, setSearchTimeout] = useState(null); // Timeout for debouncing search
  const [searchedResults, setSearchedResults] = useState([]); // Store search results

  // Fetch all posts (prompts and reposts) from the API
  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setAllPosts(data); // Set the fetched data to allPosts state
  };

  // Fetch all posts (prompts and reposts) from the API
  const fetchComments = async () => {
    const response = await fetch("/api/comments");
    const data = await response.json();
    setAllComments(data); // Set the fetched data to allPosts state
  };

  // Fetch comments when the component mounts
  useEffect(() => {
    fetchPosts();
    fetchComments();
  }, []);

  // Filter posts based on search input
  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i"); // Case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) || // Match username
        regex.test(item.tags) || // Match tags
        regex.test(item.prompt) // Match prompt content
    );
  };

  // Handle search input changes with debounce
  const handleSearchChange = (e) => {
    e.preventDefault();
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // Set a timeout to delay search execution
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  // Handle tag click to perform a search
  const handleTagClick = (tagName) => {
    setSearchText(tagName); // Set clicked tag as the search text
    const searchResult = filterPrompts(tagName); // Filter posts by tag
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      {/* Search input field */}
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* Display posts: either search results or all posts */}
      {searchText ? (
        <PromptCardList data={searchedResults} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}

      <CommentFeedList data={allComments}/>
    </section>
  );
};

export default Feed;
