"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from 'next/image';
import FollowsList from "@components/followsDir/FollowsList";

const FollowersPage = ({ params }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [followers, setFollowers] = useState([]);
    
    // Retrieve user details from query parameters
    const userName = searchParams.get("name");
    const userImage = searchParams.get("image");

    useEffect(() => {
        const fetchFollowers = async () => {
            const response = await fetch(`/api/users/${params?.id}/followers`);
            const data = await response.json();
            setFollowers(data);
        };

        if (params?.id) {
            fetchFollowers();
        }
    }, [params?.id]);

    return (
        <section className='w-full space-y-4'>
            <button 
                onClick={() => router.back()} 
                className='text-blue-500 underline mb-4'
            >
                Back
            </button>

            <div className='flex items-center space-x-4'>
                {userImage && (
                    <Image
                        src={userImage}
                        width={50}
                        height={50}
                        className='rounded-full'
                        alt={`${userName}'s profile picture`}
                    />
                )}
                <h1 className='font-satoshi font-semibold text-gray-900'>
                    {userName}
                </h1>
            </div>

            <h1 className='head_text text-left'>
                <span className='blue_gradient'>Followers</span>
            </h1>

            <div className="w-1/2 h-1 bg-gradient-to-r from-blue-600 to-cyan-600"/>

            <FollowsList follows={{followers}} listType={"followers"} userId={params?.id}/>
        </section>
    );
};

export default FollowersPage;
