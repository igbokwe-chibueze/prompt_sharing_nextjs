"use client";

import { useState, useEffect } from "react";
import CombinedFeedList from "./CombinedFeedList";

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]); // Store fetched posts
  const [allComments, setAllComments] = useState([]); // Store fetched comments

  const [searchText, setSearchText] = useState(""); // Search query state
  const [searchTimeout, setSearchTimeout] = useState(null); // Timeout for debouncing search
  const [searchedResults, setSearchedResults] = useState([]); // Store search results

  const fetchContent = async () => {
    try {
      const [postsResponse, commentsResponse] = await Promise.all([
        fetch("/api/prompt"),
        fetch("/api/comments"),
      ]);
      const postsData = await postsResponse.json();
      const commentsData = await commentsResponse.json();
      setAllPosts(postsData);
      setAllComments(commentsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // Fetch posts and comments when the component mounts
  useEffect(() => {
    fetchContent();
  }, []);

  // Filter both posts and comments based on search input
  const filterContent = (searchText) => {
    const regex = new RegExp(searchText, "i"); // Case-insensitive search

    const filteredPosts = allPosts.filter(
      (item) =>
        regex.test(item.creator.username) || // Match username in posts
        regex.test(item.tags) || // Match tags in posts
        regex.test(item.prompt) // Match prompt content in posts
    );

    const filteredComments = allComments.filter(
      (comment) =>
        regex.test(comment.userId.username) || // Match username in comments
        regex.test(comment.content) // Match comment content
    );

    // Combine both filtered posts and comments
    return { filteredPosts, filteredComments };
  };

  // Handle search input changes with debounce
  const handleSearchChange = (e) => {
    e.preventDefault();
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // Set a timeout to delay search execution
    setSearchTimeout(
      setTimeout(() => {
        const { filteredPosts, filteredComments } = filterContent(e.target.value);
        setSearchedResults({ posts: filteredPosts, comments: filteredComments });
      }, 500)
    );
  };

  // Handle tag click to perform a search
  const handleTagClick = (tagName) => {
    setSearchText(tagName); // Set clicked tag as the search text
    const { filteredPosts, filteredComments } = filterContent(tagName); // Filter both posts and comments by tag
    setSearchedResults({ posts: filteredPosts, comments: filteredComments });
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

      {/* Display posts and comments: either search results or all posts and comments */}
      {searchText ? (
        <CombinedFeedList
          promptData={searchedResults.posts}
          commentData={searchedResults.comments}
          handleTagClick={handleTagClick}
        />
      ) : (
        <CombinedFeedList
          promptData={allPosts}
          commentData={allComments}
          handleTagClick={handleTagClick}
        />
      )}
    </section>
  );
};

export default Feed;
