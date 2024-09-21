"use client";

import { useState, useEffect, Suspense } from "react";
import CombinedFeedList from "./CombinedFeedList";


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
        <CombinedFeedList 
          promptData={searchedResults} 
          commentData={allComments} 
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
