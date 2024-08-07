"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      // Fetch user's own posts
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setMyPosts(data);
    };

    const fetchLikedPosts = async () => {
      // Fetch posts liked by the user
      const response = await fetch(`/api/users/${session?.user.id}/liked-posts`);
      const data = await response.json();
      setLikedPosts(data);
    };

    const fetchBookmarkedPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/bookmarked-prompts`);
      const data = await response.json();
      setBookmarkedPosts(data);
    };

    if (session?.user.id) {
      fetchPosts();
      fetchLikedPosts();
      fetchBookmarkedPosts();
    }
  }, [session?.user.id]);
  

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
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

            if (response.ok) {
                const filteredPosts = myPosts.filter((item) => item._id !== post._id);
                setMyPosts(filteredPosts);
            } else {
                console.error("Failed to delete post:", response.statusText);
            }
        } catch (error) {
            console.log("Error deleting post:", error);
        }
    }
  };

  return (
    <section className='w-full'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>My Profile</span>
      </h1>
      <p className='desc text-left'>Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination</p>

      <Profile
        name='My'
        desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
        data={myPosts}
        likes={likedPosts}
        bookmarks={bookmarkedPosts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </section>
  );
};

export default MyProfile;