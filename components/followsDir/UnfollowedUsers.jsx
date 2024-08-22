"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import FollowButton from "@components/FollowButton";
import { useRouter } from "next/navigation";

const UnfollowedUsers = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [unfollowedUsers, setUnfollowedUsers] = useState([]);

    // Search states
    const [searchText, setSearchText] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchedResults, setSearchedResults] = useState([]);

    useEffect(() => {
        if (!session) return;

        // Fetch the users the logged-in user is not following
        const fetchUnfollowedUsers = async () => {
            try {
                const response = await fetch(`/api/users/${session.user.id}/unfollowed-users`);
                if (!response.ok) {
                    throw new Error("Failed to fetch unfollowed users");
                }
                const data = await response.json();
                setUnfollowedUsers(data);
            } catch (error) {
                console.error("Error fetching unfollowed users:", error);
            }
        };

        fetchUnfollowedUsers();
    }, [session]);

    const filterPrompts = (searchtext) => {
        const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
        return unfollowedUsers.filter(
            (item) =>
                regex.test(item.username) ||
                regex.test(item.email)
        );
    };

    const handleSearchChange = (e) => {
        e.preventDefault();
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        // debounce method
        setSearchTimeout(
            setTimeout(() => {
                const searchResult = filterPrompts(e.target.value);
                setSearchedResults(searchResult);
            }, 500)
        );
    };

    const usersToDisplay = searchText ? searchedResults : unfollowedUsers;

    return (
        <div className="space-y-4">
            <button
                onClick={() => router.back()}
                className='text-blue-500 underline'
            >
                Back
            </button>

            <h2 className="text-xl font-semibold">Users You Are Not Following</h2>

            <form className='relative w-full flex-center'>
                <input
                    type='text'
                    placeholder='Search for a tag or a username'
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className='search_input peer'
                />
            </form>

            <ul className="space-y-6">
                {usersToDisplay.map(user => (
                    <li key={user._id} className="border p-4 rounded-md border-gray-500">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Image
                                    src={user.image}
                                    alt={user.username}
                                    width={60}
                                    height={60}
                                    className="rounded-full object-contain"
                                />
                                <div>
                                    <h3 className="font-satoshi font-semibold text-gray-900">{user.username}</h3>
                                    <p className="font-inter text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <FollowButton userId={user._id} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UnfollowedUsers;
