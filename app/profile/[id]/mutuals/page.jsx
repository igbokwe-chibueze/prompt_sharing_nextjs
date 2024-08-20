"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FollowsList from "@components/followsDir/FollowsList";
import Image from "next/image";

const MutualFollowersPage = ({ params }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const userName = searchParams.get("name");
    const userImage = searchParams.get("image");
    const mutuals = JSON.parse(searchParams.get("mutuals"));

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
                <span className='blue_gradient'>Mutual Followers</span>
            </h1>

            <div className="w-1/2 h-1 bg-gradient-to-r from-blue-600 to-cyan-600"/>

            <FollowsList follows={{ mutuals }} listType={"mutuals"} userId={params?.id}/>
        </section>
    );
};

export default MutualFollowersPage;
