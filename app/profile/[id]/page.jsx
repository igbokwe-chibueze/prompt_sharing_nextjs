"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';

import Profile from "@components/Profile";
import UserBio from "@components/UserBio";

const UserProfile = ({ params }) => {
    const searchParams = useSearchParams();
    const userName = searchParams.get("name");
    const { data: session } = useSession();

    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/users/${params?.id}/posts`);
            const data = await response.json();
            setUserPosts(data);
        };

        if (params?.id) {
          fetchPosts();
        }
    }, [params.id, session]);

    return (
        <section className='w-full'>
            <UserBio userId={{ id: params.id }} />

            <h1 className='head_text text-left'>
                <span className='blue_gradient'>{userName} Profile</span>
            </h1>
            <p className='desc text-left'>{`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}</p>

            <Profile data={userPosts} />
        </section>
    );
};

export default UserProfile;
